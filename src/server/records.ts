import { Router } from 'express'
import { Record } from './schema.ts'

const recordsRouter = Router()

recordsRouter.get('/records', async (req, res) => {
    const pets = await Record.findAll()
    res.send(JSON.stringify(pets))
})

recordsRouter.get('/records/:id', async (req, res) => {
    const id = req.params['id']
    const pets = await Record.findOne({ where: { id } })
    res.send(JSON.stringify(pets))
})

recordsRouter.post('/records', async (req, res) => {
    const pet = await Record.create(req.body, { fields: Record.safeFields })
    res.send(JSON.stringify(pet))
})

recordsRouter.patch('/records/:id', async (req, res) => {
    const id = req.params['id']
    const pet = await Record.findOne({ where: { id } })
    pet.set({
        ...req.body
    })
    const updated = await pet.save({ fields: Record.safeFields })
    res.send(JSON.stringify(updated))
})

recordsRouter.delete('/records/:id', async (req, res) => {
    const id = req.params['id']
    const count = await Record.destroy({ where: { id } })
    res.send(JSON.stringify({ count }))
})

export default recordsRouter