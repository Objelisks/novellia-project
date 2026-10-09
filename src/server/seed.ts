import { Pet, Record } from './schema.ts'

const names = [
  'Luna',
  'Milo',
  'Leo',
  'Lily',
  'Coco',
  'Loki',
  'Simba',
  'Bella',
  'Ollie',
  'Charlie',
  'Willow',
  'Cleo',
  'Daisy',
  'Pepper',
  'Rosie',
  'Oreo',
  'Archie',
  'Lucy',
  'Penny',
  'Nova',
]
const genders = [
  'the wind',
  'male',
  'female',
  'nonbinary',
  'a rock',
  'a tree',
  'purple',
]
const pick = <T>(arr: T[]) => arr.at(Math.floor(Math.random() * arr.length))

export const createSeedData = async () => {
  const pets = []
  for (let i = 0; i < 25; i++) {
    pets.push({
      name: pick(names),
      birthdate: new Date('03-05-1991'),
      gender: pick(genders),
      imageUrl: 'https://placekittens.com/100/150',
    })
  }
  const allPets = await Pet.bulkCreate(pets)
  const records = []
  for (const pet of allPets) {
    // create some records
    for (let i = 0; i < 3; i++) {
      records.push({
        petId: pet.id,
        filename: `record${Math.floor(Math.random() * 300)}.txt`,
        data: 'was a good boy at the vet',
      })
    }
  }
  await Record.bulkCreate(records)
}
