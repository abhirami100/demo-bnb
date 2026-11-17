import { GALLERY } from "./gallery.generated";
import type { CollectionId, GalleryItem } from "./types";

export interface Collection {
  id: CollectionId;
  name: string;
  /** Short label for chips. */
  short: string;
  /** One-line summary drawn only from published brand copy / product names. */
  summary: string;
  /** Gallery numbers used as cover imagery (picked from the genuine gallery). */
  covers: number[];
  tone: string;
}

/** The five collections on the current gallery page, in their original order. */
export const COLLECTIONS: Collection[] = [
  {
    id: "camlin",
    name: "Camlin",
    short: "Camlin",
    summary: "Colours, crayons, pastels, brushes and art essentials from the Camlin & Camel range.",
    covers: [14, 96, 159, 82, 126],
    tone: "#ffd84d",
  },
  {
    id: "flexoffice",
    name: "Flexoffice",
    short: "Flexoffice",
    summary: "Writing, marking and office supplies by Flexoffice, Colokit and Bizner.",
    covers: [2, 99, 74, 36, 134],
    tone: "#7fd3a4",
  },
  {
    id: "pelikan",
    name: "Pelikan",
    short: "Pelikan",
    summary: "Writing, painting, office and premium writing instruments from Pelikan.",
    covers: [17, 16, 52, 23, 46],
    tone: "#9fb4ff",
  },
  {
    id: "english-notebook",
    name: "English Notebook",
    short: "Notebooks",
    summary: "BnB English notebooks — classic covers and illustrated spiral editions.",
    covers: [27, 29, 30, 28, 1],
    tone: "#ff9a5c",
  },
  {
    id: "art-craft",
    name: "Art & Craft",
    short: "Art & Craft",
    summary: "Crepe and colour papers, drawing and colouring books, craft and party essentials.",
    covers: [5, 12, 43, 31, 21],
    tone: "#ff8fb1",
  },
];

export const COLLECTION_BY_ID = Object.fromEntries(COLLECTIONS.map((c) => [c.id, c])) as Record<CollectionId, Collection>;

export const itemsOf = (id: CollectionId) => GALLERY.filter((g) => g.collection === id);

export const findItem = (id: CollectionId, n: number): GalleryItem | undefined =>
  GALLERY.find((g) => g.collection === id && g.n === n);

export const countOf = (id: CollectionId) => itemsOf(id).length;

/** Curated mix for the home page featured rail. */
export const FEATURED: GalleryItem[] = (
  [
    ["pelikan", 17],
    ["camlin", 14],
    ["english-notebook", 29],
    ["flexoffice", 99],
    ["art-craft", 43],
    ["camlin", 96],
    ["pelikan", 16],
    ["flexoffice", 74],
    ["english-notebook", 27],
    ["camlin", 82],
    ["art-craft", 12],
    ["pelikan", 52],
  ] as [CollectionId, number][]
)
  .map(([c, n]) => findItem(c, n))
  .filter((x): x is GalleryItem => Boolean(x));

/** Human label for an item. Uses the genuine product name when the photo carries one. */
export const itemLabel = (item: GalleryItem) => item.title ?? `${COLLECTION_BY_ID[item.collection].name} — No. ${item.n}`;

export const imgSrc = (item: Pick<GalleryItem, "file">, w: 480 | 960 = 960) => `/gallery/w${w}/${item.file}.webp`;
export const imgSrcSet = (item: Pick<GalleryItem, "file" | "w">) =>
  item.w <= 480
    ? `/gallery/w480/${item.file}.webp ${item.w}w`
    : `/gallery/w480/${item.file}.webp 480w, /gallery/w960/${item.file}.webp ${Math.min(960, item.w)}w`;
