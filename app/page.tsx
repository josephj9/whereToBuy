"use client";
import { useState, useRef } from "react";
import Webcam from "react-webcam";
import NavButton from '@/app/components/navButton';
import SearchButton from '@/app/components/searchButton';

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

  const handleSubmit = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null);
    setDescription(null);
    // First, classify image
    const res = await fetch("/api/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image })
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
        })
      });
      const descData = await descRes.json();
      setDescription(descData.description);
      setDescLoading(false);
    }
  };



  const handleClear = () => {
    setImage(null);
    setResult(null);
    setDescription(null);
    setShowWebcam(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header with Navigation */}
      <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <NavButton />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-green-400 bg-clip-text text-transparent mb-4">
            Where To Buy?
          </h1>
          <p className="text-slate-400 text-lg">
            Capture or upload a photo to identify and learn about any product  
          </p>
        </div>

        {/* Action Cards */}
        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl mb-12">
          {/* Take a Photo Card */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-3xl shadow-2xl p-8 flex-1 flex flex-col items-center border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300 hover:shadow-purple-500/10 hover:shadow-2xl">
            {iconCamera}
            <h2 className="text-3xl font-bold mb-3 text-center bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
              Take a Photo
            </h2>
            <p className="text-slate-400 mb-8 text-center leading-relaxed">
              Use your camera to capture a product you want to identify
            </p>
            
            {!showWebcam && (
              <button
                onClick={() => { handleClear(); setShowWebcam(true); }}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Open Camera
                </span>
              </button>
            )}
            
            {showWebcam && (
              <div className="flex flex-col items-center gap-4 w-full">
                <div className="relative rounded-2xl overflow-hidden border-2 border-slate-600 shadow-xl">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="bg-black"
                    width={320}
                    height={240}
                    videoConstraints={{ facingMode: "environment" }}
                  />
                </div>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={handleCapture}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold py-3 rounded-xl transition-all duration-300"
                  >
                    Capture
                  </button>
                  <button
                    onClick={() => setShowWebcam(false)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold py-3 rounded-xl transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Upload Photo Card */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-3xl shadow-2xl p-8 flex-1 flex flex-col items-center border border-slate-700/50 hover:border-green-500/30 transition-all duration-300 hover:shadow-green-500/10 hover:shadow-2xl">
            {iconUpload}
            <h2 className="text-3xl font-bold mb-3 text-center bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
              Upload Photo
            </h2>
            <p className="text-slate-400 mb-8 text-center leading-relaxed">
              Choose an existing photo from your device
            </p>
            
            <label className="w-full cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white text-center font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-green-500/25">
                <span className="flex items-center justify-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Choose File
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Product Info Section */}
        <div ref={productSectionRef} className="w-full max-w-4xl">
          {(image || loading || result) && (
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-slate-700/50 animate-in slide-in-from-bottom-4 duration-500">
              {image && (
                <div className="flex flex-col items-center mb-6">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-slate-600 shadow-xl mb-6">
                    <img 
                      src={image || "/placeholder.svg"} 
                      alt="Preview" 
                      className="max-h-64 w-auto object-contain bg-slate-900" 
                    />
                  </div>
                  
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full max-w-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 hover:shadow-lg hover:shadow-blue-500/25 disabled:shadow-none disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Analyzing Image...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Classify Image
                      </span>
                    )}
                  </button>
                </div>
              )}

              {result && (
                <div className="space-y-6">
                  <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-700/50">
                    <h3 className="text-xl font-semibold mb-4 text-purple-400 flex items-center gap-2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M9 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2h-4m-4 0V9a2 2 0 114 0v2m-4 0a2 2 0 104 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Classification Result
                    </h3>
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-600/50">
                      <pre className="text-sm text-slate-300 overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                  </div>

                  {descLoading && (
                    <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-700/50">
                      <div className="flex items-center gap-3 text-slate-300">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Loading product description...
                      </div>
                    </div>
                  )}

                  {description && (
                    <div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 rounded-2xl p-6 border border-green-500/30">
                      <h3 className="text-xl font-semibold mb-4 text-green-400 flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        Product Description
                      </h3>
                      <p className="text-slate-200 leading-relaxed">{description}</p>
                    </div>
                  )}
                </div>
              )}

              {(image || result) && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleClear}
                    className="bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Clear All
                    </span>
                  </button>
                  <SearchButton displayName={result?.display_name} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

}