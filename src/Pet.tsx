import { useCallback, useEffect, useState } from 'react'
import type { Pet, Record } from './types/types.d.ts'
import debounce from 'debounce'
import './App.css'
import { useParams } from 'react-router'

function PetPage() {
  let { petId } = useParams()
  const [pet, setPet] = useState<Pet>(null)
  const [records, setRecords] = useState<Record[]>([])

  const fetchData = useCallback(async () => {
    const pet = await fetch(`http://localhost:3000/pets/${petId}`).then((res) =>
      res.json()
    )
    setPet(pet)
  }, [])

  const searchRecords = useCallback(
    debounce((searchTerm?: string) => {
      console.log('search', searchTerm)
      fetch(
        `http://localhost:3000/pets/${petId}/records${searchTerm ? `?q=${searchTerm}` : ''}`
      )
        .then((res) => res.json())
        .then((pets) => {
          setRecords(pets)
        })
    }, 500),
    []
  )

  const handleSearchChange = useCallback((e) => {
    const searchTerm = e.target.value
    searchRecords(searchTerm)
  }, [])

  useEffect(() => {
    fetchData()
    searchRecords()
  }, [searchRecords])

  return (
    <main>
      <header>
        <a href="/">{'< back'}</a>
        <input
          type="search"
          placeholder="search for records"
          onChange={handleSearchChange}
        ></input>
      </header>
      {pet && (
        <>
          <div>
            <img src={pet.imageUrl} width={100}></img>
            <div className="infobox">
              <h2>{pet.name}</h2>
              <p>{`${records.length} records`}</p>
            </div>
          </div>
          <section className="records">
            {records.map((record) => {
              return (
                <div key={record.id} className="record">
                  <h3>{record.filename}</h3>
                  <p>{record.data}</p>
                </div>
              )
            })}
          </section>
        </>
      )}
    </main>
  )
}

export default PetPage
