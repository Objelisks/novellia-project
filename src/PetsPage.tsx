import { useCallback, useEffect, useRef, useState } from 'react'
import debounce from 'debounce'
import type { Pet as PetType } from './types/types'
import { Pet } from './components/Pet'
import './App.css'

function PetsPage() {
  const [pets, setPets] = useState<PetType[]>([])
  const dialogRef = useRef(null)

  const searchPets = useCallback(
    debounce((searchTerm?: string) => {
      console.log('search', searchTerm)
      fetch(`http://localhost:3000/pets${searchTerm ? `?q=${searchTerm}` : ''}`)
        .then((res) => res.json())
        .then((pets) => {
          setPets(pets)
        })
    }, 500),
    []
  )

  useEffect(() => {
    searchPets()
  }, [searchPets])

  const handleSearchChange = useCallback((e) => {
    const searchTerm = e.target.value
    searchPets(searchTerm)
  }, [])

  const handleAddPet = useCallback(() => {
    dialogRef.current.showModal()
  }, [])

  const handleAddSubmit = useCallback(
    async (formData: FormData) => {
      const response: PetType = await fetch(`http://localhost:3000/pets`, {
        method: 'post',
        body: JSON.stringify({
          name: formData.get('name'),
          birthdate: formData.get('birthdate'),
          gender: formData.get('gender'),
          imageUrl: formData.get('imageUrl')['name'],
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json())

      setPets([...pets, response])
      dialogRef.current?.close()
    },
    [pets]
  )

  const handleRemovePet = useCallback(
    async (pet: PetType) => {
      await fetch(`http://localhost:3000/pets/${pet.id}`, {
        method: 'delete',
      })
      const newPets = [...pets]
      newPets.splice(newPets.indexOf(pet), 1)
      setPets(newPets)
    },
    [pets]
  )

  return (
    <main>
      <header>
        <h1>Pet List</h1>
        <input
          type="search"
          placeholder="search for pet name"
          onChange={handleSearchChange}
        ></input>
        <button className="button" onClick={handleAddPet}>
          add pet
        </button>
      </header>
      <dialog ref={dialogRef} closedby="any">
        <h2>Add a pet</h2>
        <form className="form" action={handleAddSubmit}>
          <label htmlFor="name">name</label>
          <input type="text" name="name" id="name" required />
          <label htmlFor="birthdate">birthdate</label>
          <input type="date" name="birthdate" id="birthdate" required />
          <label htmlFor="gender">gender</label>
          <input type="text" name="gender" id="gender" />
          <label htmlFor="imageUrl">picture</label>
          <input type="file" name="imageUrl" id="imageUrl" />
          <input type="submit" />
        </form>
      </dialog>
      {pets.map((pet) => {
        return <Pet key={pet.id} pet={pet} handleRemovePet={handleRemovePet} />
      })}
    </main>
  )
}

export default PetsPage
