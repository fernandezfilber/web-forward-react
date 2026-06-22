const nodemailer = require('nodemailer');
const logger = require('./logger');

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST || 'smtp.resend.com',
  port:   parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER || 'resend',
    pass: process.env.SMTP_PASS || '',
  },
});

const FROM = `"Forward Vision" <${process.env.ADMIN_EMAIL || 'noreply@forwardvision.cloud'}>`;

/**
 * Notificación al admin cuando llega un comentario nuevo
 */
async function sendCommentNotification({ authorName, content, mediaTitle, stars }) {
  if (!process.env.SMTP_PASS) {
    logger.warn('SMTP_PASS no configurado — email de notificación omitido');
    return;
  }
  try {
    await transporter.sendMail({
      from:    FROM,
      to:      process.env.ADMIN_EMAIL,
      subject: `💬 Nuevo comentario en "${mediaTitle}"`,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;background:#030712;color:#fff;border-radius:16px;padding:32px;">
          <h2 style="color:#22d3ee;margin-bottom:4px;">Nuevo comentario pendiente</h2>
          <p style="color:#9ca3af;margin-top:0;">Requiere tu aprobación en el panel de administración.</p>
          <hr style="border-color:#ffffff10;margin:24px 0"/>
          <p><strong>Foto:</strong> ${mediaTitle}</p>
          <p><strong>Autor:</strong> ${authorName}</p>
          ${stars ? `<p><strong>Calificación:</strong> ${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}</p>` : ''}
          <blockquote style="background:#ffffff08;border-left:4px solid #22d3ee;margin:16px 0;padding:16px;border-radius:8px;">
            ${content}
          </blockquote>
          <a href="https://forwardvision.cloud/admin/comments"
             style="display:inline-block;margin-top:24px;padding:12px 24px;background:#22d3ee;color:#000;border-radius:8px;font-weight:bold;text-decoration:none;">
            Ver en el Panel Admin →
          </a>
        </div>
      `,
    });
    logger.info(`Email de notificación enviado al admin (comentario en "${mediaTitle}")`);
  } catch (err) {
    logger.error('Error enviando email de notificación:', err.message);
  }
}

/**
 * Email al cliente cuando su comentario es aprobado
 */
async function sendCommentApprovedEmail({ toEmail, toName, mediaTitle }) {
  if (!process.env.SMTP_PASS) return;
  try {
    await transporter.sendMail({
      from:    FROM,
      to:      toEmail,
      subject: `✅ Tu comentario en "${mediaTitle}" fue aprobado`,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;background:#030712;color:#fff;border-radius:16px;padding:32px;">
          <h2 style="color:#22d3ee;">¡Tu comentario fue publicado!</h2>
          <p>Hola <strong>${toName}</strong>, tu comentario sobre <strong>"${mediaTitle}"</strong> ya es visible en nuestra galería.</p>
          <a href="https://forwardvision.cloud/galeria"
             style="display:inline-block;margin-top:24px;padding:12px 24px;background:#22d3ee;color:#000;border-radius:8px;font-weight:bold;text-decoration:none;">
            Ver Galería →
          </a>
        </div>
      `,
    });
  } catch (err) {
    logger.error('Error enviando email de aprobación:', err.message);
  }
}

module.exports = { sendCommentNotification, sendCommentApprovedEmail };
