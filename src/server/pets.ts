import { Router } from 'express'
import { Pet, Record } from './schema.ts'
import { Op } from 'sequelize'

const petsRouter = Router()

petsRouter.get('/pets', async (req, res) => {
  const searchQuery = req.query['q']
  const pets = await Pet.findAll({
    ...(searchQuery && { where: { name: { [Op.like]: `%${searchQuery}%` } } }),
  })
  res.send(JSON.stringify(pets))
})

petsRouter.get('/pets/:id', async (req, res) => {
  const id = req.params['id']
  const pets = await Pet.findOne({
    where: { id },
  })
  res.send(JSON.stringify(pets))
})

petsRouter.get('/pets/:id/records', async (req, res) => {
  const id = req.params['id']
  const searchQuery = req.query['q']
  const records = await Record.findAll({
    where: {
      petId: id,
      ...(searchQuery && { filename: { [Op.like]: `%${searchQuery}%` } }),
    },
  })
  res.send(JSON.stringify(records))
})

petsRouter.post('/pets', async (req, res) => {
  console.log('create', req.body)
  const pet = await Pet.create(req.body, { fields: Pet.safeFields })
  res.send(JSON.stringify(pet))
})

petsRouter.patch('/pets/:id', async (req, res) => {
  const id = req.params['id']
  const pet = await Pet.findOne({ where: { id } })
  if (!pet) {
    return res.send(JSON.stringify([]))
  }
  pet.set({
    ...req.body,
  })
  const updated = await pet.save({ fields: Pet.safeFields })
  res.send(JSON.stringify(updated))
})

petsRouter.delete('/pets/:id', async (req, res) => {
  const id = req.params['id']
  const count = await Pet.destroy({ where: { id } })
  res.send(JSON.stringify({ count }))
})

export default petsRouter
