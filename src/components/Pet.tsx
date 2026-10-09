export const Pet = ({ pet, handleRemovePet, handleEditPet }) => (
  <div className="pet">
    {pet.imageUrl && <img src={pet.imageUrl}></img>}
    <div className="infobox">
      <h2>{pet.name}</h2>
      <a href={`/pets/${pet.id}`}>go to pet</a>
    </div>
    <button className="button" onClick={() => handleEditPet(pet)}>
      edit
    </button>
    <button className="button" onClick={() => handleRemovePet(pet)}>
      remove
    </button>
  </div>
)
