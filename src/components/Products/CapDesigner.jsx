// src/components/Products/CapDesigner.jsx
import React, { useState } from "react";
import { useFabric } from "../../hooks/useFabric";

const CapDesigner = () => {
  const { canvasRef, addText } = useFabric();
  const [color, setColor] = useState("#ffffff");

  return (
    <div>
      <h2>Thiết kế Nón Custom</h2>
      <div style={{ position: "relative" }}>
        {/* Lớp Mockup của Nón */}
        <img
          src="/assets/cap-mockup.png"
          style={{
            position: "absolute",
            zIndex: 1,
            backgroundColor: color,
            width: 500,
          }}
          alt="Cap"
        />
        {/* Lớp vẽ */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <canvas ref={canvasRef} />
        </div>
      </div>

      <div className="controls">
        <input type="color" onChange={(e) => setColor(e.target.value)} />
        <button onClick={() => addText("New Text")}>Thêm chữ</button>
      </div>
    </div>
  );
};

export default CapDesigner;
