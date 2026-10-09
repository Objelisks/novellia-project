import * as Plot from '@observablehq/plot'
import { useRef, useState, useEffect, useCallback } from 'react'

interface DataPoint {
  Date: Date
  Weight: number
  Symptoms?: string
}

export const DataTracker = () => {
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

  return (
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
  )
}
