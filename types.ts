export interface SheetMusic {
  id: string;
  name: string;
  pages: string[]; // Array of image DataURLs representing PDF pages
}

export interface Playlist {
  id:string;
  name: string;
  itemIds: string[]; // Array of SheetMusic IDs
}

export interface HydratedPlaylist extends Omit<Playlist, 'itemIds'> {
  id: string;
  name: string;
  items: SheetMusic[];
}
