import React, { useState, useRef } from "react";

import { Stage, Layer, Image, Text, Group } from "react-konva";

import useImage from "use-image";

const MUG_MOCKUP_URL =
  "https://cms.gossby.com/resource/template/core/image/catalog/campaign/type/preview/mug/11oz/white/front.png";

const ASSET_DATA = {
  designs: [
    { id: "d1", url: "https://konvajs.org/assets/lion.png", label: "Lion" },

    { id: "d2", url: "https://konvajs.org/assets/monkey.png", label: "Monkey" },

    {
      id: "d3",

      url: "https://ik.imagekit.io/9um5tdigihm/8/storage/personalizedDesign/design/images/25.11.2025/618.5MZR06926792c1dcc0.preview.png",

      label: "Chicken",
    },

    {
      id: "d3",

      url: "https://cdn-icons-png.flaticon.com/512/2038/2038233.png",

      label: "Chicken",
    }, // Ví dụ hình gà
  ],
};

// Component xử lý load ảnh

const ImageLayer = ({ url, x, y, width, height, opacity = 1 }) => {
  const [image] = useImage(url, "Anonymous");

  return (
    <Image
      image={image}
      x={x}
      y={y}
      width={width}
      height={height}
      opacity={opacity}
    />
  );
};

function App() {
  const stageRef = useRef(null);

  const [selections, setSelections] = useState({
    design: ASSET_DATA.designs[2],

    userName: "Your Name",
  });

  const handleExport = () => {
    // Khi xuất file in, ta có thể ẩn lớp cái ly đi nếu chỉ muốn lấy file thiết kế

    const uri = stageRef.current.toDataURL({ pixelRatio: 3 });

    const link = document.createElement("a");

    link.download = `print-file-${Date.now()}.png`;

    link.href = uri;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  return (
    <div
      style={{
        display: "flex",

        backgroundColor: "#0f172a",

        minHeight: "100vh",

        padding: "40px",

        fontFamily: "sans-serif",

        color: "white",

        justifyContent: "center",

        gap: "40px",
      }}
    >
      {/* SIDEBAR - MUG DESIGNER */}

      <div
        style={{
          width: "320px",

          backgroundColor: "#1e293b",

          padding: "30px",

          borderRadius: "20px",

          boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
        }}
      >
        <h2 style={{ color: "#3b82f6", marginBottom: "5px" }}>Mug Designer</h2>

        <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "30px" }}>
          Customize your design
        </p>

        <div style={{ marginBottom: "25px" }}>
          <label
            style={{
              display: "block",

              fontSize: "12px",

              fontWeight: "bold",

              marginBottom: "8px",

              color: "#94a3b8",
            }}
          >
            DISPLAY NAME
          </label>

          <input
            type="text"
            value={selections.userName}
            onChange={(e) =>
              setSelections({ ...selections, userName: e.target.value })
            }
            style={{
              width: "100%",

              padding: "12px",

              backgroundColor: "#0f172a",

              border: "1px solid #334155",

              borderRadius: "8px",

              color: "white",

              outline: "none",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",

              fontSize: "12px",

              fontWeight: "bold",

              marginBottom: "10px",

              color: "#94a3b8",
            }}
          >
            CHOOSE DESIGN
          </label>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {ASSET_DATA.designs.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelections({ ...selections, design: item })}
                style={{
                  width: "60px",

                  height: "60px",

                  backgroundColor: "#334155",

                  borderRadius: "8px",

                  cursor: "pointer",

                  border:
                    selections.design.id === item.id
                      ? "2px solid #3b82f6"
                      : "2px solid transparent",

                  display: "flex",

                  alignItems: "center",

                  justifyContent: "center",

                  overflow: "hidden",

                  padding: "5px",
                }}
              >
                <img
                  src={item.url}
                  alt={item.label}
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleExport}
          style={{
            marginTop: "40px",

            width: "100%",

            backgroundColor: "#3b82f6",

            color: "white",

            fontWeight: "bold",

            border: "none",

            padding: "15px",

            borderRadius: "10px",

            cursor: "pointer",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            gap: "10px",
          }}
        >
          <span>⬇</span> Download Print File (300 DPI)
        </button>
      </div>

      {/* PREVIEW AREA */}

      <div style={{ flex: 1, maxWidth: "800px" }}>
        <div
          style={{
            display: "flex",

            justifyContent: "space-between",

            marginBottom: "15px",
          }}
        >
          <span style={{ fontWeight: "bold" }}>Design Preview</span>

          <span
            style={{
              backgroundColor: "#1e293b",

              padding: "4px 12px",

              borderRadius: "20px",

              fontSize: "12px",

              color: "#3b82f6",
            }}
          >
            Live Preview
          </span>
        </div>

        <div
          style={{
            backgroundColor: "white",

            borderRadius: "20px",

            display: "flex",

            justifyContent: "center",

            alignItems: "center",

            padding: "40px",

            height: "500px",
          }}
        >
          {/* KONVA STAGE */}

          <Stage width={500} height={500} ref={stageRef}>
            <Layer>
              {/* 1. Lớp ảnh cái ly làm nền */}

              <ImageLayer
                url={MUG_MOCKUP_URL}
                x={0}
                y={50}
                width={500}
                height={400}
              />

              {/* 2. Nhóm thiết kế nằm trên thân ly */}

              <Group x={200} y={175}>
                {/* Hình vẽ */}

                <ImageLayer
                  url={selections.design.url}
                  x={0}
                  y={0}
                  width={160}
                  height={160}
                />

                {/* Chữ phía dưới hình */}

                <Text
                  text={selections.userName}
                  x={-20}
                  y={180}
                  width={200}
                  align="center"
                  fontSize={22}
                  fontStyle="bold"
                  fill="#333"
                />

                {/* Text uốn cong hoặc tiêu đề phía trên nếu cần */}

                <Text
                  x={-20}
                  y={-40}
                  width={200}
                  align="center"
                  fontSize={26}
                  fontStyle="bold"
                  fill="#ff8a00"
                />
              </Group>
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
}

export default App;
