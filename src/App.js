import React, { useRef, useState } from "react";

function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const [color, setColor] = useState(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageSrc(URL.createObjectURL(file));
      setColor(null); // reset culori când se încarcă alta imagine
    }
  };

  const handleMouseMove = (e) => {
    if (!canvasRef.current || !imgRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();

    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const rgb = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
    const hex = `#${[pixel[0], pixel[1], pixel[2]]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")}`;

    setColor({ rgb, hex, x, y });
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
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        🎨 Image Color Picker
      </h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="mb-4 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
      />

      {imageSrc && (
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-4">
          <img
            ref={imgRef}
            src={imageSrc}
            alt="uploaded"
            onLoad={drawImageOnCanvas}
            className="hidden"
          />
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            className="w-full border rounded-md cursor-crosshair"
          />

          {color && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
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
        </div>
      )}
    </div>
  );
}

export default App;
