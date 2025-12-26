import React, { useState, useEffect } from "react";
import { fabric } from "fabric";
import { useFabric } from "../hooks/useFabric";
import html2canvas from "html2canvas";

const CarVisorClipView = () => {
  const { canvasRef, canvas } = useFabric();
  const [textValue, setTextValue] = useState("");

  // 1. Tải ảnh cá nhân (Giữ nguyên - cho phép di chuyển)
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !canvas) return;

    const reader = new FileReader();
    reader.onload = (f) => {
      const data = f.target.result;
      fabric.Image.fromURL(data, (img) => {
        img.scaleToWidth(200);
        img.set({
          left: 100,
          top: 100,
          cornerStyle: "circle",
          cornerColor: "#3b82f6",
        });
        canvas.add(img);
        img.sendToBack();
        canvas.setActiveObject(img);
      });
    };
    reader.readAsDataURL(file);
  };

  // 2. SỬA ĐỔI: Hàm THÊM CHỮ (Thêm mới chứ không ghi đè)
  const addNewText = () => {
    if (!canvas || !textValue.trim()) return;

    const newText = new fabric.IText(textValue, {
      left: 200,
      top: 350 + canvas.getObjects("i-text").length * 20, // Tự động đẩy xuống dưới một chút nếu thêm nhiều dòng
      originX: "center",
      fontFamily: "Dancing Script, cursive",
      fontSize: 40,
      fill: "#333",
      // Ở đây tôi để selectable: true để bạn có thể sắp xếp lại các dòng chữ sau khi thêm
      selectable: true,
    });

    canvas.add(newText);
    canvas.setActiveObject(newText);
    canvas.renderAll();
    setTextValue(""); // Xóa trống ô nhập sau khi thêm
  };

  // 3. Thêm hàm xóa đối tượng đang chọn
  const deleteSelected = () => {
    const activeObjects = canvas.getActiveObjects();
    canvas.discardActiveObject();
    canvas.remove(...activeObjects);
  };

  const downloadDesign = async () => {
    // 1. Tìm vùng chứa toàn bộ cái kẹp (bao gồm cả mockup và canvas)
    // Bạn cần thêm id="export-area" vào thẻ div bọc ngoài cùng của mockup và canvas
    const element = document.getElementById("export-area");

    if (!element) return;

    // 2. Tạm thời ẩn khung viền chọn của Fabric
    canvas.discardActiveObject();
    canvas.requestRenderAll();

    // 3. Chụp ảnh vùng đó
    const capturedCanvas = await html2canvas(element, {
      useCORS: true, // Cho phép chụp ảnh từ nguồn khác
      scale: 2, // Tăng chất lượng ảnh lên 2 lần (sắc nét hơn)
      backgroundColor: null, // Giữ nền trong suốt nếu cần
    });

    // 4. Tải về
    const link = document.createElement("a");
    link.download = `thiet-ke-visor-${Date.now()}.png`;
    link.href = capturedCanvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "40px",
        padding: "40px",
        backgroundColor: "#0f172a",
        minHeight: "100vh",
        color: "white",
      }}
    >
      {/* SIDEBAR ĐIỀU KHIỂN */}
      <div
        style={{
          width: "320px",
          backgroundColor: "#1e293b",
          padding: "25px",
          borderRadius: "15px",
        }}
      >
        <h2 style={{ color: "#3b82f6", marginBottom: "5px" }}>
          Visor Clip Designer
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "30px" }}>
          Thiết kế đa nội dung
        </p>

        {/* Upload Ảnh */}
        <div style={{ marginBottom: "25px" }}>
          <label
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: "bold",
              color: "#94a3b8",
              marginBottom: "10px",
            }}
          >
            1. TẢI ẢNH CÁ NHÂN
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            style={{ fontSize: "13px" }}
          />
        </div>

        {/* Thêm Chữ */}
        <div style={{ marginBottom: "25px" }}>
          <label
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: "bold",
              color: "#94a3b8",
              marginBottom: "10px",
            }}
          >
            2. THÊM NỘI DUNG CHỮ
          </label>
          <input
            type="text"
            placeholder="Nhập chữ muốn thêm..."
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addNewText()} // Nhấn Enter để thêm nhanh
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "white",
              marginBottom: "10px",
            }}
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={addNewText}
              style={{
                flex: 2,
                padding: "12px",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Thêm chữ
            </button>
            <button
              onClick={deleteSelected}
              style={{
                flex: 1,
                padding: "12px",
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Xóa
            </button>
          </div>
        </div>
        <hr style={{ border: "0.5px solid #334155", margin: "20px 0" }} />

        <button
          onClick={downloadDesign}
          style={{
            width: "100%",
            padding: "15px",
            backgroundColor: "#10b981", // Màu xanh lá cây (success)
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <span>📥</span> TẢI THIẾT KẾ (.PNG)
        </button>
      </div>

      {/* KHU VỰC PREVIEW */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <div
          id="export-area"
          style={{
            position: "relative",
            width: "400px",
            height: "550px",
            backgroundColor: "white",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <img
            src="/visor_car.png"
            alt="Visor Clip Mockup"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              zIndex: 0,
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
            <canvas ref={canvasRef} width={400} height={550} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarVisorClipView;
