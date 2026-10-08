import { useEffect, useState } from "react"

function App() {
  const [pets, setPets] = useState([])

  useEffect(() => {
    fetch('http://localhost:3000/pets')
      .then(res => res.json())
      .then((pets) => {
        setPets(pets)
      })

  }, [])

  return (
    <main>
      {pets.map(pet => {
        return <div key={pet.id}>{pet.name}</div>
      })}
    </main>
  )
}

export default App
