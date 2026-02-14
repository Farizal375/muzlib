// prisma.config.ts
export default {
  datasource: {
    // Sesuaikan provider jika Anda pakai mysql/sqlite
    provider: "postgresql", 
    url: process.env.DATABASE_URL,
  },
}