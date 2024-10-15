// src/PdfHandler.js
import React, { useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

const PdfHandler = ({ file, onImageRender }) => {
  useEffect(() => {
    if (file) {
      const renderPDFAsImage = async () => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const arrayBuffer = e.target.result;
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          const page = await pdf.getPage(1); // Get the first page
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };

          await page.render(renderContext).promise;
          const dataUrl = canvas.toDataURL();
          onImageRender(dataUrl); // Pass the dataUrl back to App.js
        };
        reader.readAsArrayBuffer(file);
      };

      renderPDFAsImage();
    }
  }, [file, onImageRender]);

  return null; // No visible component, just a utility
};

export default PdfHandler;
