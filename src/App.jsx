import React, { useState } from "react";
import CarVisorClipView from "./views/CarVisorClipView";
import ShirtView from "./views/ShirtView";
import MugView from "./views/MugView";

function App() {
  const [currentView, setCurrentView] = useState("cap");

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#0f172a",
      }}
    >
      {/* Menu bên trái */}
      <div
        style={{
          width: "250px",
          borderRight: "1px solid #334155",
          padding: "20px",
          color: "white",
        }}
      >
        <h2 style={{ color: "#3b82f6" }}>Print on demand</h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button onClick={() => setCurrentView("cap")}>
            Thiết kế 1: Car Visor Clip
          </button>
          <button onClick={() => setCurrentView("shirt")}>
            Thiết kế 2: Shirt
          </button>
          <button onClick={() => setCurrentView("mug")}>Thiết kế 3: Mug</button>
        </nav>
      </div>

      {/* Vùng hiển thị nội dung thiết kế */}
      <div style={{ flex: 1, padding: "40px" }}>
        {currentView === "cap" && <CarVisorClipView />}
        {currentView === "shirt" && <ShirtView />}
        {currentView === "mug" && <MugView />}
      </div>
    </div>
  );
}

export default App;
