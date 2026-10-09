import express from 'express'
import cors from 'cors'
import { sql } from './db.ts'
import { createSeedData } from './seed.ts'
import pets from './pets.ts'
import records from './records.ts'

const app = express()

app.use(cors())

app.use(express.json())

app.use(pets)

app.use(records)

console.log('resetting db')
await sql.sync({ force: true })
await createSeedData()

console.log('listening on 3000')
app.listen(3000)
