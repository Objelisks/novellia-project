import { useCallback, useEffect, useRef, useState } from 'react'
import debounce from 'debounce'
import type { Pet as PetType } from './types/types'
import { Pet } from './components/Pet'
import './App.css'

function PetsPage() {
  const [pets, setPets] = useState<PetType[]>([])
  const [editPet, setEditPet] = useState<PetType>(null)
  const addDialogRef = useRef(null)
  const editDialogRef = useRef(null)

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
    addDialogRef.current.showModal()
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
      addDialogRef.current?.close()
    },
    [pets]
  )

  const handleEditPet = useCallback(async (pet: PetType) => {
    editDialogRef.current.showModal()
    console.log(pet)
    setEditPet(pet)
    editDialogRef.current.querySelector('#edit-name').value = pet.name
    editDialogRef.current.querySelector('#edit-birthdate').value = new Date(
      pet.birthdate
    )
      .toISOString()
      .split('T')[0]
    editDialogRef.current.querySelector('#edit-gender').value = pet.gender
  }, [])

  const handleEditSubmit = useCallback(
    async (formData: FormData) => {
      const response: PetType = await fetch(
        `http://localhost:3000/pets/${editPet.id}`,
        {
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
        }
      ).then((res) => res.json())

      const newPets = [...pets]
      newPets.splice(newPets.indexOf(editPet), 1, response)
      setPets(newPets)
      setEditPet(null)
      editDialogRef.current?.close()
    },
    [pets, editPet]
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
      <dialog ref={addDialogRef} closedby="any">
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
      <dialog ref={editDialogRef} closedby="any">
        <h2>Edit a pet</h2>
        <form className="form" action={handleEditSubmit}>
          <label htmlFor="edit-name">name</label>
          <input type="text" name="name" id="edit-name" required />
          <label htmlFor="edit-birthdate">birthdate</label>
          <input type="date" name="birthdate" id="edit-birthdate" required />
          <label htmlFor="edit-gender">gender</label>
          <input type="text" name="gender" id="edit-gender" />
          <label htmlFor="edit-imageUrl">picture</label>
          <input type="file" name="imageUrl" id="edit-imageUrl" />
          <input type="submit" />
        </form>
      </dialog>
      {pets.map((pet) => {
        return (
          <Pet
            key={pet.id}
            pet={pet}
            handleRemovePet={handleRemovePet}
            handleEditPet={handleEditPet}
          />
        )
      })}
    </main>
  )
}

export default PetsPage
