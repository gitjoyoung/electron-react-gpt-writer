import type { UnsplashImage } from "../../../../shared/api/electron";
import { ImageGallery } from "./ImageGallery";

interface ChatResponseProps {
  response: string;
  isLoadingImages: boolean;
  images: UnsplashImage[];
}

export const ChatResponse = ({
  response,
  isLoadingImages,
  images
}: ChatResponseProps) => {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-200 rounded">
        <pre className="whitespace-pre-wrap break-words text-sm text-gray-800">
          {response}
        </pre>
      </div>
      
      {isLoadingImages ? (
        <div className="text-center py-4">
          <p className="text-gray-500">이미지 로딩 중...</p>
        </div>
      ) : (
        <ImageGallery    images={images} />
      )}
    </div>
  );
}; 