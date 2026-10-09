export const Pet = ({ pet, handleRemovePet }) => (
  <div className="pet">
    {pet.imageUrl && <img src={pet.imageUrl}></img>}
    <div className="infobox">
      <h2>{pet.name}</h2>
    </div>
    <a href={`/pets/${pet.id}`}>
      <button className="button">view</button>
    </a>
    <button className="button" onClick={() => handleRemovePet(pet)}>
      remove
    </button>
  </div>
)
