import { PrismaClient } from '../../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const connectionString = process.env.DATABASE_URL

const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function seed() {
  const tasks = [
    { title: 'キッチン掃除', location: 'キッチン', frequency: 'WEEKLY' as const },
    { title: 'バスルーム掃除', location: 'バスルーム', frequency: 'WEEKLY' as const },
    { title: 'リビング掃除機', location: 'リビング', frequency: 'DAILY' as const },
  ]
  for (const task of tasks) {
    await prisma.cleaningTask.create({
      data: task
    })
  }
  console.log('Seed completed!')
}

seed()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
