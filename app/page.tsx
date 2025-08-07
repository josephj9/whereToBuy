"use client";
import { useState, useRef } from "react";
import Webcam from "react-webcam";
import NavButton from '@/app/components/navButton';

const iconCamera = (
  <div className="flex items-center justify-center mb-4">
    <div className="rounded-full bg-[#23272f] p-6">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
        <path d="M7 7V6a2 2 0 012-2h6a2 2 0 012 2v1" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="3" y="7" width="18" height="14" rx="3" stroke="#a78bfa" strokeWidth="2"/>
        <circle cx="12" cy="14" r="3" stroke="#a78bfa" strokeWidth="2"/>
      </svg>
    </div>
  </div>
);

const iconUpload = (
  <div className="flex items-center justify-center mb-4">
    <div className="rounded-full bg-[#23272f] p-6">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
        <path d="M12 16V4M12 4l-4 4M12 4l4 4" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="4" y="16" width="16" height="4" rx="2" stroke="#4ade80" strokeWidth="2"/>
      </svg>
    </div>
  </div>
);

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const [description, setDescription] = useState<string | null>(null);
  const [descLoading, setDescLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const webcamRef = useRef<Webcam>(null);
  const productSectionRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target?.result as string);
    reader.readAsDataURL(file);
    setShowWebcam(false);
    setResult(null);
    setDescription(null);
    setTimeout(() => {
      productSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  const handleCapture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
      setShowWebcam(false);
      setResult(null);
      setDescription(null);
      setTimeout(() => {
        productSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  //PUT THIS PART INTO A DATABASE
  // Modified: Classify and get description together
  const handleSubmit = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null);
    setDescription(null);
    // First, classify image
    const res = await fetch("/api/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image }),
    });
    const resultData = await res.json();
    setResult(resultData);
    setLoading(false);

    // Then, get description automatically
    if (resultData?.display_name && resultData?.specific_category) {
      setDescLoading(true);
      const descRes = await fetch("/api/describe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: resultData.display_name,
          specific_category: resultData.specific_category,
        }),
      });
      const descData = await descRes.json();
      setDescription(descData.description);
      setDescLoading(false);
    }
  };

  const fetchProducts = async () => {
    const request = await fetch('api/products');  
    const data = await request.json();
    setProducts(data.data);
  }


  const handleClear = () => {
    setImage(null);
    setResult(null);
    setDescription(null);
    setShowWebcam(false);
  };

  return (
    <div className="min-h-screen bg-[#181a20] flex flex-col items-center py-10 px-2">
      {/* SHOW ALL PRODUCTS BUTTON */}
      <NavButton />
      {/* <div><button onClick={showProducts}></button></div> */}
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
        {/* Take a Photo Box */}
        <div className="bg-[#23272f] rounded-2xl shadow-lg p-8 flex-1 flex flex-col items-center border border-[#23272f]">
          {iconCamera}
          <h2 className="text-2xl font-bold mb-2 text-center text-[#a78bfa]">Take a Photo</h2>
          <p className="text-gray-400 mb-6 text-center">
            Use your camera to capture a product you want to find
          </p>
          {!showWebcam && (
            <button
              onClick={() => { handleClear(); setShowWebcam(true); }}
              className="w-full bg-[#181a20] hover:bg-[#312e81] text-gray-100 font-semibold py-3 rounded-lg transition mb-2"
            >
              Open Camera
            </button>
          )}
          {showWebcam && (
            <div className="flex flex-col items-center gap-3 w-full mb-2">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="rounded-lg border border-gray-600 bg-black"
                width={300}
                height={225}
                videoConstraints={{ facingMode: "environment" }}
              />
              <button
                onClick={handleCapture}
                className="w-full bg-[#a78bfa] hover:bg-[#c4b5fd] text-[#181a20] font-semibold py-2 rounded transition"
              >
                Capture Photo
              </button>
              <button
                onClick={() => setShowWebcam(false)}
                className="w-full bg-gray-700 hover:bg-gray-600 text-gray-100 font-semibold py-2 rounded transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Upload Photo Box */}
        <div className="bg-[#23272f] rounded-2xl shadow-lg p-8 flex-1 flex flex-col items-center border border-[#23272f]">
          {iconUpload}
          <h2 className="text-2xl font-bold mb-2 text-center text-[#4ade80]">Upload Photo</h2>
          <p className="text-gray-400 mb-6 text-center">
            Choose an existing photo from your device
          </p>
          <label className="w-full">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-full bg-[#181a20] border border-gray-600 text-gray-100 text-center font-semibold py-3 rounded-lg cursor-pointer hover:bg-gray-700 transition">
              Choose File
            </div>
          </label>
        </div>
      </div>
      {/* PRODUCT INFO SECTION */}
      <div ref={productSectionRef} className="w-full max-w-2xl mt-12">
        {(image || loading || result) && (
          <div className="bg-[#23272f] rounded-xl shadow-xl p-6 border border-gray-700 flex flex-col items-center">
            {image && (
              <img src={image} alt="Preview" className="max-h-48 rounded-lg mb-4 border border-gray-700" />
            )}
            {image && (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-[#a78bfa] hover:bg-[#c4b5fd] text-[#181a20] font-semibold py-2 px-4 rounded transition disabled:opacity-50 mb-2"
              >
                {loading ? "Classifying & getting description..." : "Classify Image"}
              </button>
            )}
            {result && (
              <div className="bg-[#181a20] rounded-lg p-4 w-full mt-2 border border-gray-700">
                <h2 className="text-lg font-semibold mb-2 text-[#a78bfa]">Classification Result</h2>
                <pre className="text-sm text-gray-300 overflow-x-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
                {descLoading && (
                  <div className="mt-4 text-gray-100 bg-gray-800 p-4 rounded">
                    Loading product description...
                  </div>
                )}
                {description && (
                  <div className="mt-4 text-gray-100 bg-gray-800 p-4 rounded">
                    <h3 className="font-bold mb-1">Product Description</h3>
                    <p>{description}</p>
                  </div>
                )}
              </div>
            )}
            {(image || result) && (
              <button
                onClick={handleClear}
                className="w-full mt-2 bg-gray-700 hover:bg-gray-600 text-gray-100 font-semibold py-2 px-4 rounded transition"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}