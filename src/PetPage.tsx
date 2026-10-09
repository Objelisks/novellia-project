import { useCallback, useEffect, useRef, useState } from 'react'
import debounce from 'debounce'
import { useParams } from 'react-router'
import type { Pet, Record as RecordType } from './types/types'
import { Record } from './components/Record'
import { DataTracker } from './components/DataTracker'
import './App.css'

function PetPage() {
  let { petId } = useParams()
  const [pet, setPet] = useState<Pet>(null)
  const [editRecord, setEditRecord] = useState<RecordType>(null)
  const [records, setRecords] = useState<RecordType[]>([])
  const addDialogRef = useRef(null)
  const editDialogRef = useRef(null)

  const fetchPet = useCallback(async () => {
    const pet = await fetch(`http://localhost:3000/pets/${petId}`).then((res) =>
      res.json()
    )
    setPet(pet)
  }, [])

  const searchRecords = useCallback(
    debounce((searchTerm?: string) => {
      console.log('search', searchTerm)
      fetch(
        `http://localhost:3000/records?id=${petId}${searchTerm ? `&q=${searchTerm}` : ''}`
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
    addDialogRef.current.showModal()
  }, [])

  const handleAddSubmit = useCallback(
    async (formData: FormData) => {
      const newRecord = {
        filename: formData.get('filename').toString(),
        data: formData.get('data').toString(),
        petId: parseInt(petId),
      }

      const response: RecordType = await fetch(
        `http://localhost:3000/records`,
        {
          method: 'post',
          body: JSON.stringify(newRecord),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      ).then((res) => res.json())

      setRecords([...records, response])
      addDialogRef.current?.close()
    },
    [records]
  )

  const handleEditRecord = useCallback(async (record: RecordType) => {
    editDialogRef.current.showModal()
    setEditRecord(record)
    editDialogRef.current.querySelector('#edit-filename').value =
      record.filename
    editDialogRef.current.querySelector('#edit-data').value = record.data
  }, [])

  const handleEditSubmit = useCallback(
    async (formData: FormData) => {
      const response: RecordType = await fetch(
        `http://localhost:3000/records/${editRecord.id}`,
        {
          method: 'post',
          body: JSON.stringify({
            filename: formData.get('filename'),
            data: formData.get('data'),
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      ).then((res) => res.json())

      const newRecords = [...records]
      newRecords.splice(newRecords.indexOf(editRecord), 1, response)
      setRecords(newRecords)
      setEditRecord(null)
      editDialogRef.current?.close()
    },
    [records, editRecord]
  )

  const handleRemoveRecord = useCallback(
    async (record: RecordType) => {
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
    fetchPet()
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
          <dialog ref={addDialogRef} closedby="any">
            <h2>Add a record</h2>
            <form className="form" action={handleAddSubmit}>
              <label htmlFor="filename">filename</label>
              <input type="text" name="filename" id="filename" required />
              <label htmlFor="data">data</label>
              <input type="text" name="data" id="data" required />
              <input type="submit" />
            </form>
          </dialog>
          <dialog ref={editDialogRef} closedby="any">
            <h2>Edit a record</h2>
            <form className="form" action={handleEditSubmit}>
              <label htmlFor="edit-filename">filename</label>
              <input type="text" name="filename" id="edit-filename" required />
              <label htmlFor="edit-data">data</label>
              <input type="text" name="data" id="edit-data" required />
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
          <DataTracker />
          <section className="records">
            {records.map((record) => (
              <Record
                key={record.id}
                record={record}
                handleEditRecord={handleEditRecord}
                handleRemoveRecord={handleRemoveRecord}
              />
            ))}
          </section>
        </>
      )}
    </main>
  )
}

export default PetPage
