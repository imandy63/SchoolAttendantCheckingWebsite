import React, { useState } from "react";

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
  imageUrl?: string | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  imageUrl,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const addedFile = e.target.files[0];
      const previewUrl = URL.createObjectURL(addedFile);
      setImagePreview(previewUrl);
      onImageSelect(addedFile);
    }
  };

  return (
    <div className="relative w-1/2 h-64 border-2 border-dashed border-gray-400 rounded-lg overflow-hidden">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
      <div
        className="w-full h-full bg-cover bg-center transition-opacity duration-300"
        style={{
          backgroundImage: `url(${imagePreview || imageUrl})`,
          opacity: imagePreview || imageUrl ? 1 : 0.5,
        }}
      >
        {!imagePreview && !imageUrl && (
          <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 text-white text-xl font-semibold">
            Add/Change Image
          </div>
        )}
      </div>

      {/* hidden file input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 opacity-0 cursor-pointer z-10"
      />
    </div>
  );
};

export default ImageUpload;
