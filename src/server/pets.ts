import { Router } from 'express'
import { Pet, Record } from './schema.ts'

const petsRouter = Router()

petsRouter.get('/pets', async (_req, res) => {
    const pets = await Pet.findAll({ include: [Record] })
    res.send(JSON.stringify(pets))
})

petsRouter.get('/pets/:id', async (req, res) => {
    const id = req.params['id']
    const pets = await Pet.findOne({ where: { id }, include: [Record] })
    res.send(JSON.stringify(pets))
})

petsRouter.post('/pets', async (req, res) => {
    const pet = await Pet.create(req.body, { fields: Pet.safeFields })
    res.send(JSON.stringify(pet))
})

petsRouter.patch('/pets/:id', async (req, res) => {
    const id = req.params['id']
    const pet = await Pet.findOne({ where: { id } })
    if(!pet) {
        return res.send(JSON.stringify([]))
    }
    pet.set({
        ...req.body
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