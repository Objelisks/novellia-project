import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import PetsPage from './PetsPage.tsx'
import PetPage from './PetPage.tsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PetsPage />} />
        <Route path="/pets/:petId" element={<PetPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
