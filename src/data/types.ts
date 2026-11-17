export type CollectionId = "camlin" | "flexoffice" | "pelikan" | "english-notebook" | "art-craft";

export interface GalleryItem {
  id: string;
  collection: CollectionId;
  /** Index used on the original site (e.g. "Camlin 12"). */
  n: number;
  /** Base filename in /public/gallery (without extension). */
  file: string;
  w: number;
  h: number;
  /** Dominant colour, used as a loading placeholder. */
  color: string;
  /** Only present where the genuine product name is printed on the photo. */
  title?: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  /** Product cut-out composition from the original brands page. */
  visual: string;
  description: string;
  /** Product line list where the original site provides one. */
  lines?: string[];
  /** Linked gallery collection, if any. */
  collection?: CollectionId;
}
