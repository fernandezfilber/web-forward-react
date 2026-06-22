const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { prisma }   = require('../config/database');
const { saveRefreshToken, verifyRefreshToken, revokeRefreshToken, savePasswordResetCode, verifyPasswordResetCode } = require('../config/redis');
const crypto = require('crypto');
const logger = require('../config/logger');
const { Resend } = require('resend');

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const generateTokens = (userId, role) => {
  const accessToken = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  return { accessToken, refreshToken };
};

/** POST /api/auth/register */
async function register(req, res) {
  const { name, email, password, phone } = req.body;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'El email ya está registrado' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, passwordHash, phone: phone || null, role: 'cliente' },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);
    await saveRefreshToken(user.id, refreshToken);

    res.status(201).json({ user, accessToken, refreshToken });
  } catch (err) {
    console.error('register error:', err);
    res.status(500).json({ error: 'Error al crear la cuenta' });
  }
}

/** POST /api/auth/login */
async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)           return res.status(401).json({ error: 'Credenciales incorrectas' });
    if (!user.isActive)  return res.status(403).json({ error: 'Cuenta desactivada. Contacta al administrador.' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Credenciales incorrectas' });

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);
    await saveRefreshToken(user.id, refreshToken);
    await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });

    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
}

/** POST /api/auth/refresh */
async function refresh(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'Refresh token requerido' });
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const userId  = await verifyRefreshToken(refreshToken);
    if (!userId || userId !== decoded.userId) {
      return res.status(401).json({ error: 'Refresh token inválido' });
    }
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, role: true },
    });
    const tokens = generateTokens(user.id, user.role);
    // Rotate: revoke old, save new
    await revokeRefreshToken(refreshToken);
    await saveRefreshToken(user.id, tokens.refreshToken);

    res.json({ ...tokens, user });
  } catch (err) {
    res.status(401).json({ error: 'Refresh token inválido o expirado' });
  }
}

/** POST /api/auth/logout */
async function logout(req, res) {
  const { refreshToken } = req.body;
  if (refreshToken) await revokeRefreshToken(refreshToken);
  res.json({ message: 'Sesión cerrada correctamente' });
}

/** GET /api/auth/me */
async function me(req, res) {
  res.json({ user: req.user });
}

/** PUT /api/auth/profile */
async function updateProfile(req, res) {
  const { name, phone, currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const dataToUpdate = { name, phone };

    // Update password if requested
    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ error: 'Debes proporcionar la contraseña actual' });
      // Only check current password if user is not Google-only (has a password hash)
      if (user.passwordHash) {
        const valid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!valid) return res.status(401).json({ error: 'La contraseña actual es incorrecta' });
      }
      dataToUpdate.passwordHash = await bcrypt.hash(newPassword, 12);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: { id: true, name: true, email: true, phone: true, role: true, avatarUrl: true },
    });

    res.json({ message: 'Perfil actualizado exitosamente', user: updatedUser });
  } catch (err) {
    logger.error('updateProfile error:', err);
    res.status(500).json({ error: 'Error al actualizar el perfil' });
  }
}

/** POST /api/auth/forgot-password */
async function forgotPassword(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'El email es requerido' });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({ message: 'Si el correo existe, se ha enviado un código de verificación.' });
    }

    // Generate 6-digit code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    await savePasswordResetCode(email, resetCode);

    // Send email using Resend
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'Soporte Forward Vision <onboarding@resend.dev>',
          to: email,
          subject: 'Código de Recuperación de Contraseña - Forward Vision',
          html: `
            <div style="font-family: sans-serif; max-w-md; margin: 0 auto; text-align: center;">
              <h2>Recuperación de Contraseña</h2>
              <p>Has solicitado restablecer tu contraseña. Utiliza el siguiente código de 6 dígitos:</p>
              <div style="background-color: #f3f4f6; padding: 20px; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 10px;">
                ${resetCode}
              </div>
              <p style="color: #6b7280; font-size: 14px;">Este código expirará en 15 minutos.</p>
              <p style="color: #6b7280; font-size: 14px;">Si no solicitaste este cambio, puedes ignorar este correo.</p>
            </div>
          `
        });
        logger.info(`Correo de recuperación enviado a ${email} vía Resend`);
      } catch (emailErr) {
        logger.error('Error enviando correo con Resend:', emailErr);
      }
    }

    res.json({ message: 'Si el correo existe, se ha enviado un código de verificación.' });
  } catch (err) {
    logger.error('forgotPassword error:', err);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
}

/** POST /api/auth/reset-password */
async function resetPassword(req, res) {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) {
    return res.status(400).json({ error: 'Email, código y nueva contraseña son requeridos' });
  }

  try {
    const isValid = await verifyPasswordResetCode(email, code);
    if (!isValid) {
      return res.status(400).json({ error: 'El código es inválido o ha expirado' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { email },
      data: { passwordHash },
    });

    res.json({ message: 'Contraseña actualizada exitosamente. Ya puedes iniciar sesión.' });
  } catch (err) {
    logger.error('resetPassword error:', err);
    res.status(500).json({ error: 'Error al restablecer la contraseña' });
  }
}

module.exports = { register, login, refresh, logout, me, updateProfile, forgotPassword, resetPassword };
