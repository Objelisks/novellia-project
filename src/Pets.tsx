import { useCallback, useEffect, useState } from 'react'
import type { Pet } from './types/types.d.ts'
import debounce from 'debounce'
import './App.css'

function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([])

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

  return (
    <main>
      <header>
        <input
          type="search"
          placeholder="search for pet name"
          onChange={handleSearchChange}
        ></input>
      </header>
      {pets.map((pet) => {
        return (
          <a key={pet.id} className="pet" href={`/pets/${pet.id}`}>
            <img src={pet.imageUrl}></img>
            <div className="infobox">
              <h2>{pet.name}</h2>
            </div>
          </a>
        )
      })}
    </main>
  )
}

export default PetsPage
