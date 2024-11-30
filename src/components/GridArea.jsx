import React, { useState } from "react";

const GridArea = ({ data, removeTable }) => {
  const [cards, setCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [resizing, setResizing] = useState(false);
  const [resizingCardId, setResizingCardId] = useState(null);
  const [initialMouseX, setInitialMouseX] = useState(0);
  const [initialWidth, setInitialWidth] = useState(0);
  const [draggingCardId, setDraggingCardId] = useState(null);
  const [draggingOffsetX, setDraggingOffsetX] = useState(0);
  const [draggingOffsetY, setDraggingOffsetY] = useState(0);

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
          left: 0, // initial position
          top: 0, // initial position
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

  const startDrag = (event, cardId) => {
    event.preventDefault();
    setDraggingCardId(cardId);

    // Capture initial mouse position and offset relative to the card
    const card = cards.find((card) => card.id === cardId);
    setDraggingOffsetX(event.clientX - card.left);
    setDraggingOffsetY(event.clientY - card.top);
  };

  const stopDrag = (event) => {
    // Calculate the new position of the table on mouse release
    if (draggingCardId) {
      const newLeft = event.clientX - draggingOffsetX;
      const newTop = event.clientY - draggingOffsetY;

      // Update the position of the card
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === draggingCardId
            ? { ...card, left: newLeft, top: newTop }
            : card
        )
      );
    }

    setDraggingCardId(null);
  };

  React.useEffect(() => {
    if (resizing || draggingCardId) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", stopDrag);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDrag);
    };
  }, [resizing, draggingCardId]);

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
        position: "relative", // ensure proper stacking of draggable elements
        overflow: "auto",
        height: "100%",
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
          position: "relative",
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
              position: "absolute", // absolute positioning for drag movement
              left: `${card.left}px`,
              top: `${card.top}px`,
            }}
            onMouseDown={(e) => startDrag(e, card.id)} // Start dragging on mouse down
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
