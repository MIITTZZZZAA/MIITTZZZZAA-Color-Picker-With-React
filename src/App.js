import React, { useRef, useState } from "react";
import namer from "color-namer";

const colorList = [
  { name: "Black", r: 0, g: 0, b: 0 },
  { name: "White", r: 255, g: 255, b: 255 },
  { name: "Gray", r: 128, g: 128, b: 128 },
  { name: "Dark Gray", r: 64, g: 64, b: 64 },
  { name: "Light Gray", r: 211, g: 211, b: 211 },
  { name: "Gainsboro", r: 220, g: 220, b: 220 },
  { name: "Dim Gray", r: 105, g: 105, b: 105 },
  { name: "Slate Gray", r: 112, g: 128, b: 144 },

  { name: "Red", r: 255, g: 0, b: 0 },
  { name: "Dark Red", r: 139, g: 0, b: 0 },
  { name: "Firebrick", r: 178, g: 34, b: 34 },
  { name: "Crimson", r: 220, g: 20, b: 60 },
  { name: "Indian Red", r: 205, g: 92, b: 92 },
  { name: "Light Coral", r: 240, g: 128, b: 128 },

  { name: "Orange", r: 255, g: 165, b: 0 },
  { name: "Dark Orange", r: 255, g: 140, b: 0 },
  { name: "Coral", r: 255, g: 127, b: 80 },
  { name: "Tomato", r: 255, g: 99, b: 71 },
  { name: "Salmon", r: 250, g: 128, b: 114 },
  { name: "Light Salmon", r: 255, g: 160, b: 122 },

  { name: "Yellow", r: 255, g: 255, b: 0 },
  { name: "Gold", r: 255, g: 215, b: 0 },
  { name: "Khaki", r: 240, g: 230, b: 140 },
  { name: "Light Yellow", r: 255, g: 255, b: 224 },
  { name: "Lemon Chiffon", r: 255, g: 250, b: 205 },

  { name: "Green", r: 0, g: 128, b: 0 },
  { name: "Dark Green", r: 0, g: 100, b: 0 },
  { name: "Forest Green", r: 34, g: 139, b: 34 },
  { name: "Sea Green", r: 46, g: 139, b: 87 },
  { name: "Lime", r: 0, g: 255, b: 0 },
  { name: "Light Green", r: 144, g: 238, b: 144 },
  { name: "Pale Green", r: 152, g: 251, b: 152 },

  { name: "Cyan", r: 0, g: 255, b: 255 },
  { name: "Teal", r: 0, g: 128, b: 128 },
  { name: "Turquoise", r: 64, g: 224, b: 208 },
  { name: "Medium Turquoise", r: 72, g: 209, b: 204 },
  { name: "Dark Turquoise", r: 0, g: 206, b: 209 },

  { name: "Blue", r: 0, g: 0, b: 255 },
  { name: "Dark Blue", r: 0, g: 0, b: 139 },
  { name: "Navy", r: 0, g: 0, b: 128 },
  { name: "Royal Blue", r: 65, g: 105, b: 225 },
  { name: "Sky Blue", r: 135, g: 206, b: 235 },
  { name: "Light Blue", r: 173, g: 216, b: 230 },
  { name: "Dodger Blue", r: 30, g: 144, b: 255 },

  { name: "Purple", r: 128, g: 0, b: 128 },
  { name: "Dark Violet", r: 148, g: 0, b: 211 },
  { name: "Blue Violet", r: 138, g: 43, b: 226 },
  { name: "Violet", r: 238, g: 130, b: 238 },
  { name: "Orchid", r: 218, g: 112, b: 214 },
  { name: "Plum", r: 221, g: 160, b: 221 },
  { name: "Lavender", r: 230, g: 230, b: 250 },

  { name: "Pink", r: 255, g: 192, b: 203 },
  { name: "Light Pink", r: 255, g: 182, b: 193 },
  { name: "Hot Pink", r: 255, g: 105, b: 180 },
  { name: "Deep Pink", r: 255, g: 20, b: 147 },
  { name: "Pale Violet Red", r: 219, g: 112, b: 147 },

  { name: "Brown", r: 165, g: 42, b: 42 },
  { name: "Saddle Brown", r: 139, g: 69, b: 19 },
  { name: "Sienna", r: 160, g: 82, b: 45 },
  { name: "Peru", r: 205, g: 133, b: 63 },
  { name: "Chocolate", r: 210, g: 105, b: 30 },
  { name: "Tan", r: 210, g: 180, b: 140 },
  { name: "Burlywood", r: 222, g: 184, b: 135 },

  { name: "Ivory", r: 255, g: 255, b: 240 },
  { name: "Beige", r: 245, g: 245, b: 220 },
  { name: "Snow", r: 255, g: 250, b: 250 },
  { name: "Mint Cream", r: 245, g: 255, b: 250 },
  { name: "Floral White", r: 255, g: 250, b: 240 },
];

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
    const libName = namer(hex).ntc[0].name;

    setColor({ rgb, hex, x, y, name: getClosestColorName(hex), libName });

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

  function getClosestColorName(hex) {
    const r1 = parseInt(hex.substr(1, 2), 16);
    const g1 = parseInt(hex.substr(3, 2), 16);
    const b1 = parseInt(hex.substr(5, 2), 16);

    let closest = null;
    let minDistance = Infinity;

    for (const c of colorList) {
      const dr = c.r - r1;
      const dg = c.g - g1;
      const db = c.b - b1;
      const dist = dr * dr + dg * dg + db * db;

      if (dist < minDistance) {
        minDistance = dist;
        closest = c.name;
      }
    }

    return closest;
  }

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
                <div>
                  <p className="text-gray-700">
                    Color Aproximation 1:{" "}
                    <span className="font-semibold">{color.name}</span>
                  </p>
                  <p className="text-gray-700">
                    Color Aproximation 2:{" "}
                    <span className="font-semibold">{color.libName}</span>
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
