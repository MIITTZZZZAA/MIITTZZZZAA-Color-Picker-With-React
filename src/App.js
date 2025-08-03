import React, { useRef, useState } from "react";

function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const [color, setColor] = useState(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const zoomCanvasRef = useRef(null);
  const [mode, setMode] = useState("wrap");

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageSrc(URL.createObjectURL(file));
      setColor(null);
    }
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const rgb = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
    const hex = `#${[pixel[0], pixel[1], pixel[2]]
      .map((c) => c.toString(16).padStart(2, "0"))
      .join("")}`;
    setColor({ rgb, hex, x, y });

    const zoomCanvas = zoomCanvasRef.current;
    const zoomCtx = zoomCanvas.getContext("2d");
    const zoomFactor = 5;
    const zoomArea = 6;
    const zoomSize = zoomArea * 2;

    try {
      const imageData = ctx.getImageData(
        x - zoomArea,
        y - zoomArea,
        zoomSize,
        zoomSize
      );

      zoomCanvas.width = zoomSize * zoomFactor;
      zoomCanvas.height = zoomSize * zoomFactor;

      zoomCtx.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);
      zoomCtx.imageSmoothingEnabled = false;

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = zoomSize;
      tempCanvas.height = zoomSize;
      const tempCtx = tempCanvas.getContext("2d");
      tempCtx.putImageData(imageData, 0, 0);

      zoomCtx.drawImage(
        tempCanvas,
        0,
        0,
        zoomSize,
        zoomSize,
        0,
        0,
        zoomSize * zoomFactor,
        zoomSize * zoomFactor
      );

      const center = zoomCanvas.width / 2;
      const crossSize = 20;

      zoomCtx.beginPath();
      if (mode !== "overlay") {
        zoomCtx.strokeStyle = "red";
        zoomCtx.lineWidth = 2;
        zoomCtx.moveTo(center - crossSize, center);
        zoomCtx.lineTo(center + crossSize, center);
        zoomCtx.moveTo(center, center - crossSize);
        zoomCtx.lineTo(center, center + crossSize);
      }
      zoomCtx.stroke();

      if (mode === "overlay") {
        const containerRect = canvas.getBoundingClientRect();
        const relX = e.clientX - containerRect.left;
        const relY = e.clientY - containerRect.top;

        zoomCanvas.style.left = `${relX}px`;
        zoomCanvas.style.top = `${relY}px`;
        zoomCanvas.style.transform = "translate(-50%, -50%)";
      } else {
        zoomCanvas.style.left = `0px`;
        zoomCanvas.style.top = `0px`;
        zoomCanvas.style.transform = "translate(-125%, -102%)";
      }
    } catch (err) {
      console.error("Zoom rendering error:", err);
    }
  };

  const drawImageOnCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = imgRef.current;
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-1 flex flex-col items-center">
        <div className="flex flex-col items-center justify-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-1">
            🎨 Image Color Picker
          </h1>

          <div className="flex gap-4 text-sm text-gray-700">
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={mode === "wrap"}
                onChange={() => setMode("wrap")}
              />
              Wrap mode
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={mode === "overlay"}
                onChange={() => setMode("overlay")}
              />
              Overlay mode
            </label>
          </div>
        </div>

        {imageSrc && (
          <div className="w-full bg-white rounded-lg shadow-md p-4 mx-auto max-w-[700px]">
            {color && (
              <div className="mb-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-gray-700">
                    Coordonate:{" "}
                    <span className="font-semibold">
                      ({color.x}, {color.y})
                    </span>
                  </p>
                  <p className="text-gray-700">
                    RGB: <span className="font-semibold">{color.rgb}</span>
                  </p>
                  <p className="text-gray-700">
                    HEX: <span className="font-semibold">{color.hex}</span>
                  </p>
                </div>
                <div
                  className="w-20 h-20 rounded border shadow-inner"
                  style={{ backgroundColor: color.hex }}
                />
              </div>
            )}
            <img
              ref={imgRef}
              src={imageSrc}
              alt="uploaded"
              onLoad={drawImageOnCanvas}
              className="hidden"
            />
            <div className="relative flex justify-center items-center">
              <canvas
                ref={canvasRef}
                onMouseMove={handleMouseMove}
                className="mx-auto max-w-full h-auto border rounded-md cursor-crosshair"
              />
              <div className="flex flex-col items-center">
                <canvas
                  ref={zoomCanvasRef}
                  className="pointer-events-none absolute border-2 border-blue-500 rounded"
                  style={{
                    width: "100px",
                    height: "100px",
                    top: 0,
                    left: 0,
                    transform: "translate(-50%, -50%)",
                    imageRendering: "pixelated",
                    display: color ? "block" : "none",
                    cursor: "crosshair",
                    pointerEvents: "none",
                    border: "2px solid #3b82f6",
                    borderRadius: "0.375rem",
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
