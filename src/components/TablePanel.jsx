const TablePanel = ({ data, addToGrid }) => {
  const handleDragStart = (event, tableId) => {
    event.dataTransfer.setData("tableId", tableId);
  };

  return (
    <div className="left-pane">
      <h2>Table List</h2>
      <ul>
        {data.map((table) => (
          <li
            key={table.id}
            draggable
            onDragStart={(e) => handleDragStart(e, table.id)}
          >
            {table.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TablePanel;
