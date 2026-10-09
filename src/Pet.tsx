import { useCallback, useEffect, useRef, useState } from 'react'
import type { Pet, Record } from './types/types.d.ts'
import debounce from 'debounce'
import './App.css'
import { useParams } from 'react-router'
import * as Plot from '@observablehq/plot'

interface DataPoint {
  Date: Date
  Weight: number
  Symptoms?: string
}

function PetPage() {
  let { petId } = useParams()
  const [pet, setPet] = useState<Pet>(null)
  const [records, setRecords] = useState<Record[]>([])
  const dialogRef = useRef(null)
  const dataDialogRef = useRef(null)
  const trackerRef = useRef(null)
  const [data, setData] = useState<DataPoint[]>([
    { Date: new Date('2026-05-13'), Weight: 10 },
    { Date: new Date('2026-05-23'), Weight: 20 },
    { Date: new Date('2026-06-05'), Weight: 15, Symptoms: 'vom' },
  ])

  useEffect(() => {
    if (data === undefined || !trackerRef.current) return
    const plot = Plot.plot({
      height: 200,
      x: { grid: true },
      y: { grid: true },
      marks: [
        Plot.line(data, { x: 'Date', y: 'Weight' }),
        Plot.dot(data, { x: 'Date', y: 'Weight' }),
        Plot.tip(data, {
          x: 'Date',
          y: 'Weight',
          title: 'Symptoms',
          anchor: 'top',
        }),
      ],
    })
    trackerRef.current.append(plot)
    return () => plot.remove()
  }, [data, trackerRef.current])

  const handleAddDataPoint = useCallback(() => {
    dataDialogRef.current.showModal()
  }, [])

  const handleAddDataSubmit = useCallback(
    async (formData: FormData) => {
      setData((data) => [
        ...data,
        {
          Date: new Date(formData.get('date').toString()),
          Weight: parseInt(formData.get('weight').toString()),
          ...(formData.get('symptoms') && {
            Symptoms: formData.get('symptoms').toString(),
          }),
        },
      ])
      dataDialogRef.current?.close()
    },
    [data]
  )

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
          <section ref={trackerRef} className="tracker">
            <dialog ref={dataDialogRef} closedby="any">
              <h2>Add a data point</h2>
              <form className="form" action={handleAddDataSubmit}>
                <label htmlFor="data-date">day</label>
                <input type="date" name="date" id="data-date" required />
                <label htmlFor="data-weight">weight</label>
                <input type="text" name="weight" id="data-weight" required />
                <label htmlFor="data-symptoms">symptoms</label>
                <input type="text" name="symptoms" id="data-symptoms" />
                <input type="submit" />
              </form>
            </dialog>
            <button onClick={handleAddDataPoint}>add data</button>
          </section>
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
