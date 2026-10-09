import { Router } from 'express'
import { Record } from './schema.ts'
import { Op } from 'sequelize'

const recordsRouter = Router()

recordsRouter.get('/records', async (req, res) => {
  const id = req.query['id']
  const searchQuery = req.query['q']
  const records = await Record.findAll({
    where: {
      petId: id,
      ...(searchQuery && {
        [Op.or]: {
          filename: {
            [Op.like]: `%${searchQuery}%`,
          },
          data: {
            [Op.like]: `%${searchQuery}%`,
          },
        },
      }),
    },
  })
  res.send(JSON.stringify(records))
})

recordsRouter.get('/records/:id', async (req, res) => {
  const id = req.params['id']
  const records = await Record.findOne({ where: { id } })
  res.send(JSON.stringify(records))
})

recordsRouter.post('/records', async (req, res) => {
  const record = await Record.create(req.body, { fields: Record.safeFields })
  res.send(JSON.stringify(record))
})

recordsRouter.patch('/records/:id', async (req, res) => {
  const id = req.params['id']
  const record = await Record.findOne({ where: { id } })
  if (!record) {
    return res.send(JSON.stringify(false))
  }
  record.set({
    ...req.body,
  })
  const updated = await record.save({ fields: Record.safeFields })
  res.send(JSON.stringify(updated))
})

recordsRouter.delete('/records/:id', async (req, res) => {
  const id = req.params['id']
  const count = await Record.destroy({ where: { id } })
  res.send(JSON.stringify({ count }))
})

export default recordsRouter
