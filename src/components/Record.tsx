export const Record = ({ record, handleRemoveRecord, handleEditRecord }) => (
  <div className="record">
    <header>
      <h3>{record.filename}</h3>
      <button className="button" onClick={() => handleEditRecord(record)}>
        edit
      </button>
      <button className="button" onClick={() => handleRemoveRecord(record)}>
        remove
      </button>
    </header>
    <p>{record.data}</p>
  </div>
)
