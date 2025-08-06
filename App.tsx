
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { SheetMusic, Playlist, HydratedPlaylist } from './types';
import Viewer from './components/Viewer';
import PlaylistView from './components/PlaylistView';
import Modal from './components/Modal';
import * as pdfjsLib from 'pdfjs-dist';
import * as db from './db';

// Set the worker source for pdf.js. This is crucial for it to work in a modular setup.
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`;

const App: React.FC = () => {
  const [view, setView] = useState<'playlists' | 'viewer'>('playlists');
  const [currentFile, setCurrentFile] = useState<SheetMusic | null>(null);
  const [allMusic, setAllMusic] = useState<SheetMusic[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Loading your music library...');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load all data from IndexedDB on initial component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [music, pls] = await Promise.all([
          db.getAllSheetMusic(),
          db.getAllPlaylists()
        ]);
        setAllMusic(music);
        setPlaylists(pls);
      } catch (error) {
        console.error("Failed to load data from IndexedDB:", error);
        alert("Could not load your music library. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset input immediately
    }

    if (!file) return;

    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      alert("Please select a valid PDF file.");
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Loading PDF...');

    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const numPages = pdf.numPages;
        const pages: string[] = [];
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) {
            throw new Error('Could not get canvas context');
        }

        for (let i = 1; i <= numPages; i++) {
            setLoadingMessage(`Rendering page ${i} of ${numPages}...`);
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 2.0 }); // High-res rendering
            
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: context,
                viewport: viewport,
                canvas: canvas,
            };
            await page.render(renderContext).promise;
            pages.push(canvas.toDataURL('image/png')); // Use PNG for better quality
        }
        
        canvas.remove();

        const newFile: SheetMusic = {
            id: `file-${Date.now()}-${Math.random()}`,
            name: file.name.replace(/\.pdf$/i, ''),
            pages: pages
        };
        
        await db.saveSheetMusic(newFile);
        setAllMusic(prev => [...prev, newFile]);
        setCurrentFile(newFile);
        setView('viewer');
    } catch (error) {
        console.error("Error processing PDF:", error);
        alert(`Failed to process PDF. It might be corrupted or invalid. Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
        setIsLoading(false);
    }
  };


  const handleOpenDeviceFiles = () => {
    fileInputRef.current?.click();
  };

  const handleCreatePlaylist = async (name: string) => {
    const newPlaylist: Playlist = {
      id: `pl-${Date.now()}`,
      name: name,
      itemIds: [],
    };
    await db.savePlaylist(newPlaylist);
    setPlaylists(prev => [...prev, newPlaylist]);
  };

  const handleDeletePlaylist = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this playlist? This will not delete the sheet music itself.")) {
      await db.deletePlaylist(id);
      setPlaylists(prev => prev.filter(pl => pl.id !== id));
    }
  };

  const handleAddToPlaylist = async (playlistId: string) => {
    if (!currentFile) return;

    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;

    if (playlist.itemIds.includes(currentFile.id)) {
        alert(`'${currentFile.name}' is already in this playlist.`);
        return;
    }

    const updatedPlaylist = { ...playlist, itemIds: [...playlist.itemIds, currentFile.id] };
    
    await db.savePlaylist(updatedPlaylist);
    setPlaylists(prev => prev.map(pl => pl.id === playlistId ? updatedPlaylist : pl));
    setIsModalOpen(false);
    alert(`Added '${currentFile.name}' to '${playlist.name}'.`);
  };

  const handleRemoveFromPlaylist = async (playlistId: string, fileId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;

    const updatedPlaylist = { ...playlist, itemIds: playlist.itemIds.filter(id => id !== fileId) };
    
    await db.savePlaylist(updatedPlaylist);
    setPlaylists(prev => prev.map(pl => pl.id === playlistId ? updatedPlaylist : pl));
  };

  const handleSelectFileFromPlaylist = (file: SheetMusic) => {
    setCurrentFile(file);
    setView('viewer');
  };
  
  const handleCloseViewer = () => {
    setView('playlists');
    setCurrentFile(null);
    if(document.fullscreenElement) {
        document.exitFullscreen();
    }
  };

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const hydratedPlaylists = useMemo((): HydratedPlaylist[] => {
      const musicMap = new Map(allMusic.map(m => [m.id, m]));
      return playlists.map(pl => ({
          id: pl.id,
          name: pl.name,
          items: pl.itemIds.map(id => musicMap.get(id)).filter((item): item is SheetMusic => !!item)
      }));
  }, [playlists, allMusic]);

  const PlaylistSelectionModal = () => (
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add to Playlist">
      {playlists.length > 0 ? (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {playlists.map(pl => (
            <button
              key={pl.id}
              onClick={() => handleAddToPlaylist(pl.id)}
              className="w-full text-left p-3 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
            >
              {pl.name}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No playlists available. Please create one first.</p>
      )}
    </Modal>
  );

  return (
    <div className="h-screen w-screen bg-gray-900 text-white">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-[100] flex flex-col justify-center items-center">
            <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
            <p className="mt-4 text-lg text-white">{loadingMessage}</p>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept="application/pdf,.pdf"
      />
      
      {view === 'playlists' && (
        <PlaylistView
          playlists={hydratedPlaylists}
          onSelectFile={handleSelectFileFromPlaylist}
          onOpenDeviceFiles={handleOpenDeviceFiles}
          onCreatePlaylist={handleCreatePlaylist}
          onDeletePlaylist={handleDeletePlaylist}
          onRemoveFromPlaylist={handleRemoveFromPlaylist}
        />
      )}
      
      {view === 'viewer' && currentFile && (
        <Viewer
          file={currentFile}
          onClose={handleCloseViewer}
          onAddToPlaylist={() => setIsModalOpen(true)}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
        />
      )}

      {currentFile && <PlaylistSelectionModal />}
    </div>
  );
};

export default App;
