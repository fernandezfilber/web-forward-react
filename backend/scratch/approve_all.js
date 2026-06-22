const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.comment.updateMany({ where: { status: 'pending' }, data: { status: 'approved' } })
  .then(r => console.log('Aprobados:', r.count))
  .catch(console.error)
  .finally(() => p.$disconnect());
