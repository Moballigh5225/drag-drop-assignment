import React, { useState } from "react";
import GridArea from "./components/GridArea";
import TablePanel from "./components/TablePanel";
import "./index.css";
import { tables as initialTables } from "./utils/tableData";

function App() {
  const [tables, setTables] = useState(initialTables);

  const removeTableFromList = (tableId) => {
    // Remove the dropped table from the tables list
    setTables((prevTables) =>
      prevTables.filter((table) => table.id !== tableId)
    );
  };

  return (
    <div className="container">
      <TablePanel data={tables} removeTable={removeTableFromList} />
      <GridArea data={tables} />
    </div>
  );
}

export default App;
