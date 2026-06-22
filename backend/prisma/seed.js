const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // ── Admin user ──────────────────────────────────────────────
  const adminHash = await bcrypt.hash('Admin123!', 12);
  const admin = await prisma.user.upsert({
    where:  { email: 'admin@forwardvision.com' },
    update: {},
    create: {
      name:         'Administrador Forward Vision',
      email:        'admin@forwardvision.com',
      passwordHash: adminHash,
      role:         'admin',
    },
  });
  console.log('✅ Admin creado:', admin.email);

  // ── Demo client ─────────────────────────────────────────────
  const clientHash = await bcrypt.hash('Cliente123!', 12);
  const client = await prisma.user.upsert({
    where:  { email: 'demo@cliente.com' },
    update: {},
    create: {
      name:         'Cliente Demo',
      email:        'demo@cliente.com',
      passwordHash: clientHash,
      role:         'cliente',
    },
  });
  console.log('✅ Cliente demo creado:', client.email);

  // ── Gallery seed ─────────────────────────────────────────────
  const mediaItems = [
    { title: 'Fibra Óptica Residencial', type: 'image', category: 'Instalaciones',
      url: 'https://images.unsplash.com/photo-1600585154340-be6199f7d009?q=80&w=1200',
      thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6199f7d009?q=80&w=800' },
    { title: 'Configuración Router Giga', type: 'image', category: 'Instalaciones',
      url: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=800',
      thumbnailUrl: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=400' },
    { title: 'Técnicos en Acción - Santa Clara', type: 'image', category: 'Campo',
      url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1200',
      thumbnailUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800' },
    { title: 'Mantenimiento de Red Externa', type: 'image', category: 'Campo',
      url: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?q=80&w=800',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?q=80&w=400' },
    { title: 'Lanzamiento Giga Planes', type: 'image', category: 'Marketing',
      url: 'https://images.unsplash.com/photo-1533750516457-a7f992034fce?q=80&w=800',
      thumbnailUrl: 'https://images.unsplash.com/photo-1533750516457-a7f992034fce?q=80&w=400' },
    { title: 'Equipo de Ventas Forward', type: 'image', category: 'Marketing',
      url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800',
      thumbnailUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=400' },
  ];

  for (const item of mediaItems) {
    await prisma.media.upsert({
      where:  { id: item.title.replace(/\s+/g, '-').toLowerCase() },
      update: {},
      create: { ...item, uploadedById: admin.id, cloudinaryId: `seed-${item.category}` },
    }).catch(async () => {
      // If id doesn't exist as upsert key, just create
      await prisma.media.create({ data: { ...item, uploadedById: admin.id, cloudinaryId: `seed-${item.category}` } });
    });
  }
  console.log(`✅ ${mediaItems.length} elementos de galería creados`);
  console.log('\n🎉 Seed completado!');
  console.log('   Admin:  admin@forwardvision.com / Admin123!');
  console.log('   Client: demo@cliente.com / Cliente123!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
