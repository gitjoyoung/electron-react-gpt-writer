import type { UnsplashImage } from "../../../../shared/api/electron";

interface ImageGalleryProps {
  images: UnsplashImage[];
}

export const ImageGallery = ({ images }: ImageGalleryProps) => {
  if (images.length === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((image) => (
        <div key={image.id} className="relative group">
          <img
            src={image.urls.small}
            alt={image.alt_description || '관련 이미지'}
            className="w-full h-48 object-cover rounded"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            Photo by {image.user.name} on Unsplash
          </div>
        </div>
      ))}
    </div>
  );
}; 