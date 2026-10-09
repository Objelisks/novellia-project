import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import PetsPage from './Pets.tsx'
import PetPage from './Pet.tsx'

/*
todo:
- record upload
- pet create
- bonus feature
-  draw pet
-  private equity
-  

*/

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
