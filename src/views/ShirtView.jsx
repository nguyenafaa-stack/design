import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import html2canvas from "html2canvas";

const ShirtView = () => {
  const [canvas, setCanvas] = useState(null);
  const [textInput, setTextInput] = useState("Your Design");

  useEffect(() => {
    // Khởi tạo Canvas vùng thiết kế
    const fabricCanvas = new fabric.Canvas("shirt-canvas", {
      width: 200,
      height: 280,
      backgroundColor: "transparent",
    });
    setCanvas(fabricCanvas);

    // Xử lý xóa đối tượng bằng phím Delete/Backspace
    const handleKeyDown = (e) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        const activeObject = fabricCanvas.getActiveObject();
        if (activeObject && !activeObject.isEditing) {
          fabricCanvas.remove(activeObject);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      fabricCanvas.dispose();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // 1. Thêm Văn bản
  const handleAddText = () => {
    if (canvas) {
      const text = new fabric.IText(textInput, {
        left: 50,
        top: 50,
        fontSize: 25,
        fill: "#000000",
      });
      canvas.add(text);
      canvas.setActiveObject(text);
    }
  };

  // 2. Xóa đối tượng đang được chọn
  const handleDelete = () => {
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        canvas.remove(activeObject);
      }
    }
  };

  // 3. Tải ảnh Xem trước (Chụp toàn bộ khung áo và thiết kế)
  const downloadFullPreview = async () => {
    const element = document.getElementById("full-shirt-preview");
    if (!element) return;

    // Bỏ chọn khung xanh trước khi chụp ảnh
    if (canvas) {
      canvas.discardActiveObject();
      canvas.requestRenderAll();
    }

    try {
      const capturedCanvas = await html2canvas(element, {
        useCORS: true,
        backgroundColor: "#ffffff",
        scale: 2, // Tăng chất lượng ảnh khi tải về
      });

      const dataURL = capturedCanvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `shirt-design-${Date.now()}.png`;
      link.click();
    } catch (err) {
      console.error("Lỗi khi tải ảnh:", err);
    }
  };

  // 4. Upload Logo
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (f) => {
      fabric.Image.fromURL(f.target.result, (img) => {
        img.scaleToWidth(100);
        canvas.add(img);
        canvas.setActiveObject(img);
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: "flex", gap: "40px", padding: "20px" }}>
      {/* CỘT ĐIỀU KHIỂN */}
      <div
        style={{
          width: "320px",
          background: "#1e293b",
          padding: "25px",
          borderRadius: "15px",
          color: "white",
        }}
      >
        <h3 style={{ color: "#3b82f6", marginBottom: "25px" }}>
          Shirt Designer
        </h3>

        {/* LOGO SECTION */}
        <div style={{ marginBottom: "25px" }}>
          <label
            style={{
              display: "block",
              fontSize: "12px",
              color: "#94a3b8",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            UPLOAD LOGO
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            style={{ width: "100%", fontSize: "13px" }}
          />
        </div>

        {/* TEXT SECTION */}
        <div style={{ marginBottom: "25px" }}>
          <label
            style={{
              display: "block",
              fontSize: "12px",
              color: "#94a3b8",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            VĂN BẢN
          </label>
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #334155",
              background: "#0f172a",
              color: "white",
              outline: "none",
            }}
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleAddText}
              style={{
                flex: 1,
                padding: "10px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Thêm
            </button>
            <button
              onClick={handleDelete}
              style={{
                flex: 1,
                padding: "10px",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Xóa chọn
            </button>
          </div>
        </div>

        <hr style={{ border: "0.5px solid #334155", margin: "20px 0" }} />

        {/* DOWNLOAD BUTTON */}
        <button
          onClick={downloadFullPreview}
          style={{
            width: "100%",
            padding: "15px",
            background: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          📥 TẢI ẢNH XEM TRƯỚC (.PNG)
        </button>
      </div>

      {/* KHU VỰC HIỂN THỊ ÁO */}
      <div
        id="full-shirt-preview"
        style={{
          position: "relative",
          width: "450px",
          height: "500px",
          background: "#ffffff",
          borderRadius: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
        }}
      >
        <div style={{ position: "relative", width: "400px", height: "450px" }}>
          {/* LỚP ÁO GỐC - Hiển thị nguyên bản shirt.jpg */}
          <img
            src="/shirt.jpg"
            alt="shirt mockup"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              pointerEvents: "none",
            }}
          />

          {/* VÙNG THIẾT KẾ CANVAS */}
          <div
            style={{
              position: "absolute",
              top: "100px",
              left: "100px",
              zIndex: 10,
              // Khung dashed nhẹ để người dùng biết vùng in
              border: "1px dashed rgba(0,0,0,0.1)",
            }}
          >
            <canvas id="shirt-canvas" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShirtView;
