import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa'; // Assuming you're using Font Awesome for icons

const DocumentUpload = ({ para }) => {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(selectedImage);
  };

  return (
    <div>
      <div className="flex justify-center items-center h-screen">
        <div>
          {image ? (
            <img src={image} alt="Uploaded" className="max-w-full max-h-full" />
          ) : (
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-dashed border-gray-400 flex items-center justify-center">
                <FaPlus className="text-4xl md:text-6xl text-gray-600" />
              </div>
              <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          )}
        </div>
        upload {para}
      </div>
    </div>
  );
}

export default DocumentUpload;
