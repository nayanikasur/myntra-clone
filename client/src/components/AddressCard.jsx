export default function AddressCard({ address: a, selected, onSelect, onEdit, onRemove }) {
  return (
    <div className={`saved-address ${selected ? 'selected' : ''}`} onClick={onSelect}>
      {onSelect && <input type="radio" checked={!!selected} onChange={onSelect} aria-label={`Deliver to ${a.name}`} />}
      <div className="sa-body">
        <div className="sa-name">
          <strong>{a.name}</strong>
          <span className="sa-type">{a.type}</span>
          {a.isDefault && <span className="sa-default">DEFAULT</span>}
        </div>
        <p>
          {a.line1}
          {a.locality && `, ${a.locality}`}
          <br />
          {a.city}, {a.state} - {a.pincode}
        </p>
        <p>
          Mobile: <b>{a.mobile}</b>
        </p>
        {(onEdit || onRemove) && (
          <div className="sa-actions">
            {onRemove && (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
              >
                REMOVE
              </button>
            )}
            {onEdit && (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                EDIT
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
