import type { GalleryImage, Media } from "./gallerys";
export interface Gallery {
  id: number;
  images: GalleryImage[];
  media: Media[];
}
