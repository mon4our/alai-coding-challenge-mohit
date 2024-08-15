import { useState } from "react";
import ShapeWithGeometryExample from "./TldrawComponent";

export default function App() {
  const [items, setItems] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [show, setShow] = useState(false);

  // Handler for input change
  // @ts-expect-error ignoring type error for e
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handler for button click
  const handleGenerateClick = () => {
    const numItems = parseInt(inputValue, 10);
    console.log(numItems);
    if (!isNaN(numItems) && numItems > 0) {
      setItems(numItems);
      setShow(true);
    } else {
      alert("Please enter a valid positive number");
    }
  };

  const buttonStyle = {
    padding: "15px 30px",
    fontSize: "18px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
  };

  const inputStyle = {
    padding: "15px",
    fontSize: "18px",
    width: "300px",
    borderRadius: "5px",
    border: "2px solid #ccc",
    marginRight: "10px",
  };

  return (
    <div>
      {!show ? (
        <div style={{ margin: "20vh", textAlign: "center" }}>
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter number of items"
            style={inputStyle}
          />
          <button onClick={handleGenerateClick} style={buttonStyle}>
            Generate
          </button>
        </div>
      ) : (
        <div>
          <div style={{ inset: 0 }}>
            <h1>Timeline:</h1>
            <ShapeWithGeometryExample parts={items} />
          </div>
          <div style={{ margin: "60vh 0 0 0" }}>
            <button
              onClick={() => {
                setShow(false);
              }}
              style={buttonStyle}
            >
              Generate Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
