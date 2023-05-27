import fastify from 'fastify'
import { transactionsRoutes } from './routes/transactions'

export const app = fastify()

app.register(transactionsRoutes, {
  prefix: 'transactions',
})

app.get('/', (request, reply) => {
  reply.status(200).send({ message: 'It Works!' })
})
