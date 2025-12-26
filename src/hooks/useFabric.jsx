import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";

export const useFabric = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
    // Khởi tạo canvas
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 400,
      height: 400,
      preserveObjectStacking: true,
    });
    setCanvas(fabricCanvas);

    return () => fabricCanvas.dispose();
  }, []);

  const addText = (textValue) => {
    if (canvas) {
      const text = new fabric.IText(textValue, {
        left: 100,
        top: 100,
        fontFamily: "helvetica",
        fontSize: 25,
      });
      canvas.add(text);
      canvas.setActiveObject(text);
    }
  };

  return { canvasRef, canvas, addText };
};
