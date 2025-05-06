import type { UnsplashImage } from '../../../shared/api/electron';

export interface ImageState {
  images: UnsplashImage[];
  isLoading: boolean;
}

export interface ImageActions {
  fetchImages: (searchTerm: string) => Promise<void>;
  clearImages: () => void;
}

export class ImageModel {
  private state: ImageState = {
    images: [],
    isLoading: false
  };

  private setState(newState: Partial<ImageState>) {
    this.state = { ...this.state, ...newState };
  }

  getState(): ImageState {
    return this.state;
  }

  async fetchImages(searchTerm: string) {
    this.setState({ isLoading: true });
    try {
      const result = await window.electronAPI.fetchUnsplashImages(searchTerm);
      if (result.success) {
        this.setState({ images: result.images });
      }
    } catch (error) {
      console.error('이미지 검색 실패:', error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  clearImages() {
    this.setState({ images: [] });
  }
} 