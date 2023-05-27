import { expect, beforeAll, afterAll, describe, it, beforeEach } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'
import { execSync } from 'node:child_process' // usar comandos de terminal no node

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

beforeEach(() => {
  execSync('npm run knex migrate:rollback --all') // apaga o banco
  execSync('npm run knex migrate:latest') // cria novamente
})

describe('Transactions routes', () => {
  it('should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 100,
        type: 'credit',
      })
      .expect(201)
  })

  it('should be able to get all transactions', async () => {
    await request(app.server).post('/transactions').send({
      title: 'New transaction',
      amount: 400,
      type: 'credit',
    })

    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .expect(200)

    expect(listTransactionResponse.body).toHaveLength(1)

    expect(listTransactionResponse.body[0]).toContain({
      title: 'New transaction',
      amount: 400,
    })
  })
})
