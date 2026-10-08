export interface Pet {
    id: number
    name: string
    birthdate: Date
    gender: string
}

export interface Record {
    id: number
    petId: number
    filename: string
    data: string
    url: string
}