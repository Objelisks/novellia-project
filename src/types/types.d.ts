export interface Pet {
  id: number
  name: string
  birthdate: Date
  gender: string
  species: string
  imageUrl: string
}

export interface Record {
  id: number
  petId: number
  filename: string
  data: string
  url: string
}
