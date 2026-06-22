const fs = require('fs');
const path = require('path');
const { pool } = require('./database');

async function runMigrations() {
  const migrationsDir = path.join(__dirname, '../../migrations');
  const files = fs.readdirSync(migrationsDir).sort();

  for (const file of files) {
    if (!file.endsWith('.sql')) continue;
    console.log(`🔄 Ejecutando migración: ${file}`);
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    await pool.query(sql);
    console.log(`✅ Migración completada: ${file}`);
  }
  process.exit(0);
}

runMigrations().catch(err => {
  console.error('❌ Error en migración:', err);
  process.exit(1);
});
