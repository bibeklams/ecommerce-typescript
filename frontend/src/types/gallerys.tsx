export interface GalleryImage {
  id: number;
  url: string;
}

export type MediaType = "VIDEO" | "PDF";

export interface Media {
  id: number;
  url: string;
  type: MediaType;
}
