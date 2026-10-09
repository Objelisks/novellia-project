import { useCallback, useEffect, useRef, useState } from 'react'
import type { Pet, Record } from './types/types.d.ts'
import debounce from 'debounce'
import './App.css'
import { useParams } from 'react-router'

function PetPage() {
  let { petId } = useParams()
  const [pet, setPet] = useState<Pet>(null)
  const [records, setRecords] = useState<Record[]>([])
  const dialogRef = useRef(null)

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

  const handleAddRecord = useCallback(() => {
    dialogRef.current.showModal()
  }, [])

  const handleAddSubmit = useCallback(
    async (formData: FormData) => {
      const newRecord = {
        filename: formData.get('filename').toString(),
        data: formData.get('data').toString(),
        petId: parseInt(petId),
      }

      const response: Record = await fetch(`http://localhost:3000/records`, {
        method: 'post',
        body: JSON.stringify(newRecord),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json())

      setRecords([...records, response])
      dialogRef.current?.close()
    },
    [records]
  )

  const handleRemoveRecord = useCallback(
    async (record: Record) => {
      await fetch(`http://localhost:3000/records/${record.id}`, {
        method: 'delete',
      })
      const newRecords = [...records]
      newRecords.splice(newRecords.indexOf(record), 1)
      setRecords(newRecords)
    },
    [records]
  )

  useEffect(() => {
    fetchData()
    searchRecords()
  }, [])

  return (
    <main>
      <header>
        <h1>Pet Page</h1>
        <a href="/">{'< back'}</a>
        <input
          type="search"
          placeholder="search for records"
          onChange={handleSearchChange}
        ></input>
        <button onClick={handleAddRecord}>add record</button>
      </header>
      {pet && (
        <>
          <dialog ref={dialogRef} closedby="any">
            <h2>Add a record</h2>
            <form className="form" action={handleAddSubmit}>
              <label htmlFor="filename">filename</label>
              <input type="text" name="filename" id="filename" required />
              <label htmlFor="data">data</label>
              <input type="text" name="data" id="data" required />
              <input type="submit" />
            </form>
          </dialog>
          <div>
            <img src={pet.imageUrl} width={100}></img>
            <div className="infobox">
              <h2>{pet.name}</h2>
              <p>species: {pet.species}</p>
              <p>gender: {pet.gender}</p>
              <p>{`${records.length} records`}</p>
            </div>
          </div>
          <section className="records">
            {records.map((record) => {
              return (
                <div key={record.id} className="record">
                  <header>
                    <h3>{record.filename}</h3>
                    <button
                      className="button"
                      onClick={() => handleRemoveRecord(record)}
                    >
                      remove
                    </button>
                  </header>
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
