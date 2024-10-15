// src/App.js
// eslint-disable-next-line no-unused-vars
import React, { useState, useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { saveAs } from 'file-saver';
// eslint-disable-next-line no-unused-vars
//import PdfHandler from './PdfHandler';

function App() {
  const [image, setImage] = useState(null);
  const [cropper, setCropper] = useState();
  const [adjustments, setAdjustments] = useState({
    brightness: 100,
    contrast: 100,
  });
  const [editedImage, setEditedImage] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [showCropper, setShowCropper] = useState(false); // Added this state
  const fileInputRef = useRef();

  const handleImageUpload = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const file = files[0];
    if (file.type === 'application/pdf') {
      // Handle PDF
      setImage(null);
      setEditedImage(null);
      setShowComparison(false);
      // Render PDF to image
      // Implement callback in PdfHandler to setImage
      // Example:
      // <PdfHandler file={file} onImageRender={(dataUrl) => setImage(dataUrl)} />
    } else if (
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/jpg' ||
      file.type === 'image/pdf'
    ) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setShowCropper(true); // Show cropper when an image is uploaded
      };
      reader.readAsDataURL(file);
    } else {
      alert('Unsupported file type');
    }
  };

  const handleCrop = () => {
    if (cropper) {
      const croppedDataURL = cropper.getCroppedCanvas().toDataURL();
      setEditedImage(croppedDataURL);
      setShowComparison(true);
    }
  };

  const handleAdjust = (type, value) => {
    setAdjustments({ ...adjustments, [type]: value });
  };

  const applyAdjustments = () => {
    const img = new Image();
    img.src = editedImage;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;

      // Apply brightness and contrast
      ctx.filter = `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%)`;
      ctx.drawImage(img, 0, 0);

      setEditedImage(canvas.toDataURL());
    };
  };

  const handleEffect = (effect) => {
    const img = new Image();
    img.src = editedImage;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      if (effect === 'black&white') {
        ctx.filter = 'grayscale(100%)';
        ctx.drawImage(canvas, 0, 0);
      } else if (effect === 'fine-print') {
        ctx.filter = 'contrast(200%) brightness(50%)';
        ctx.drawImage(canvas, 0, 0);
      }

      setEditedImage(canvas.toDataURL());
    };
  };

  const downloadImage = () => {
    saveAs(editedImage, 'edited-image.png');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start">
      {/* Hero Section */}
      <section className="hero-section bg-cover bg-center h-screen flex items-center justify-center text-center">
        <div className="text-white max-w-2xl">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-white">Welcome to </span>
            <span className="text-green-700">Skannr</span>
          </h1>
          <h2 className="text-green-700 text-xl font-semibold mb-4">
            Drag & Drop your image here or click to upload below
          </h2>
          <button
            className="cta-btn bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition duration-300"
            onClick={() => fileInputRef.current.click()}
          >
            Upload Image
          </button>
        </div>
      </section>

      {/* Image Upload and Crop Tool */}
      {showCropper ? ( // Show cropper instead of upload interface
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-center">Skannr</h1>
            <Cropper
              style={{ height: 400, width: '100%' }}
              initialAspectRatio={0}
              src={image}
              viewMode={1}
              guides={true}
              background={false}
              responsive={true}
              autoCropArea={1}
              checkOrientation={false}
              onInitialized={(instance) => {
                setCropper(instance);
              }}
            />
            <div className="flex justify-center mt-4 space-x-4">
              <button
                onClick={handleCrop}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
              >
                Crop
              </button>
              <button
                onClick={() => {
                  setImage(null);
                  setShowCropper(false); // Hide cropper when uploading another image
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
              >
                Upload Another
              </button>
            </div>
          </div>
        </div>
      ) : (
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageUpload}
        />
      )}

      {/* Show Comparison Section */}
      {showComparison && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Adjust Brightness & Contrast</h2>
          <div className="flex flex-col space-y-4">
            <div>
              <label className="block text-gray-700">Brightness: {adjustments.brightness}%</label>
              <input
                type="range"
                min="0"
                max="200"
                value={adjustments.brightness}
                onChange={(e) => handleAdjust('brightness', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-gray-700">Contrast: {adjustments.contrast}%</label>
              <input
                type="range"
                min="0"
                max="200"
                value={adjustments.contrast}
                onChange={(e) => handleAdjust('contrast', e.target.value)}
                className="w-full"
              />
            </div>
            <button
              onClick={applyAdjustments}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
            >
              Apply Adjustments
            </button>
          </div>
        </div>
      )}

      {/* Edited Image Review Section */}
      {editedImage && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Review Changes</h2>
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex-1">
              <p className="text-center mb-2">Original</p>
              <img src={image} alt="Original" className="w-full h-auto border" />
            </div>
            <div className="flex-1">
              <p className="text-center mb-2">Edited</p>
              <img src={editedImage} alt="Edited" className="w-full h-auto border" />
            </div>
          </div>
          <div className="flex justify-center mt-4 space-x-4">
            <button
              onClick={() => setShowComparison(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
            >
              Use Original
            </button>
            <button
              onClick={() => setShowComparison(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Add Effects Section */}
      {editedImage && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Add Effects</h2>
          <div className="flex flex-wrap space-x-4">
            <button
              onClick={() => handleEffect('black&white')}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
            >
              Black & White
            </button>
            <button
              onClick={() => handleEffect('fine-print')}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Fine Print
            </button>
          </div>
        </div>
      )}

      {/* Download Button Section */}
      {editedImage && (
        <div className="mt-6 text-center">
          <button
            onClick={downloadImage}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg"
          >
            Download
          </button>
        </div>
      )}
    </div>
  );
}

export default App;





