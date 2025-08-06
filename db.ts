import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { SheetMusic, Playlist } from './types';

// Define the database schema
interface SheetMusicDB extends DBSchema {
  sheetMusic: {
    key: string;
    value: SheetMusic;
  };
  playlists: {
    key: string;
    value: Playlist;
  };
}

let dbPromise: Promise<IDBPDatabase<SheetMusicDB>>;

// Function to get the database instance, creating it if it doesn't exist
function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<SheetMusicDB>('sheet-music-db', 1, {
      upgrade(db) {
        // Create object stores for sheet music and playlists
        if (!db.objectStoreNames.contains('sheetMusic')) {
          db.createObjectStore('sheetMusic', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('playlists')) {
          db.createObjectStore('playlists', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

// --- Sheet Music Functions ---
export const saveSheetMusic = async (music: SheetMusic): Promise<void> => {
  const db = await getDb();
  await db.put('sheetMusic', music);
};

export const getAllSheetMusic = async (): Promise<SheetMusic[]> => {
  const db = await getDb();
  return db.getAll('sheetMusic');
};

export const deleteSheetMusic = async (id: string): Promise<void> => {
  const db = await getDb();
  await db.delete('sheetMusic', id);
};


// --- Playlist Functions ---
export const savePlaylist = async (playlist: Playlist): Promise<void> => {
  const db = await getDb();
  await db.put('playlists', playlist);
};

export const getAllPlaylists = async (): Promise<Playlist[]> => {
  const db = await getDb();
  return db.getAll('playlists');
};

export const deletePlaylist = async (id: string): Promise<void> => {
    const db = await getDb();
    await db.delete('playlists', id);
};
