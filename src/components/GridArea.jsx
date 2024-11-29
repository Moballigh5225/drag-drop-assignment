import React, { useState } from "react";

const GridArea = ({ data, removeTable }) => {
  const [cards, setCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [resizing, setResizing] = useState(false);
  const [resizingCardId, setResizingCardId] = useState(null);
  const [initialMouseX, setInitialMouseX] = useState(0);
  const [initialWidth, setInitialWidth] = useState(0);

  const handleDrop = (event) => {
    event.preventDefault();
    const tableId = event.dataTransfer.getData("tableId");

    const table = data.find((t) => t.id === tableId);

    const existingCard = cards.find((card) => card.id === tableId);

    if (existingCard) {
      setSelectedCardId(tableId);
    } else {
      setCards((prevCards) => [
        ...prevCards,
        {
          id: table.id,
          name: table.name,
          columns: table.columns,
          width: 200, // initial width
        },
      ]);

      removeTable(tableId);

      setSelectedCardId(tableId);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // Allows drop
  };

  const startResize = (event, cardId) => {
    setResizing(true);
    setResizingCardId(cardId);
    setInitialMouseX(event.clientX);
    const card = cards.find((card) => card.id === cardId);
    setInitialWidth(card.width);
  };

  const stopResize = () => {
    setResizing(false);
    setResizingCardId(null);
  };

  const handleMouseMove = (event) => {
    if (resizing) {
      const deltaX = event.clientX - initialMouseX;
      const newWidth = initialWidth + deltaX;

      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === resizingCardId ? { ...card, width: newWidth } : card
        )
      );
    }
  };

  React.useEffect(() => {
    if (resizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", stopResize);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopResize);
    };
  }, [resizing]);

  return (
    <div
      className="right-pane"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{
        border: "2px dashed #007bff",
        borderRadius: "8px",
        padding: "16px",
        textAlign: "center",
      }}
    >
      <h2>Grid Area</h2>
      <div>Drop Zone</div>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className={card.id === selectedCardId ? "selected-card" : ""}
            style={{
              width: `${card.width}px`,
              border: "1px solid #ddd",
              padding: "16px",
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              cursor: "pointer",
              transition: "all 0.3s ease",
              position: "relative",
            }}
          >
            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                marginBottom: "10px",
                color: "#333",
              }}
            >
              {card.name}
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: "0",
                margin: "0",
                color: "#555",
              }}
            >
              {card.columns.map((column) => (
                <li
                  key={column.column_id}
                  style={{
                    marginBottom: "8px",
                    padding: "6px 10px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "4px",
                    fontSize: "0.9rem",
                  }}
                >
                  {column.name} ({column.column_data_type})
                </li>
              ))}
            </ul>
            {/* Resizable handle */}
            <div
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: "#007bff",
                position: "absolute",
                bottom: "5px",
                right: "5px",
                cursor: "ew-resize",
              }}
              onMouseDown={(e) => startResize(e, card.id)}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridArea;
