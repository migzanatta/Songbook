import React, { useState } from 'react';
import { HydratedPlaylist, SheetMusic } from '../types';
import { FolderIcon, MusicNoteIcon, PlusIcon, TrashIcon, ChevronDownIcon, XIcon } from './icons';

interface PlaylistViewProps {
  playlists: HydratedPlaylist[];
  onSelectFile: (file: SheetMusic) => void;
  onOpenDeviceFiles: () => void;
  onCreatePlaylist: (name: string) => void;
  onDeletePlaylist: (id: string) => void;
  onRemoveFromPlaylist: (playlistId: string, fileId: string) => void;
}

const PlaylistView: React.FC<PlaylistViewProps> = ({ 
  playlists, onSelectFile, onOpenDeviceFiles, 
  onCreatePlaylist, onDeletePlaylist, onRemoveFromPlaylist
}) => {
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [expandedPlaylists, setExpandedPlaylists] = useState<Set<string>>(new Set());

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      onCreatePlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
    }
  };

  const togglePlaylist = (id: string) => {
    setExpandedPlaylists(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="p-4 sm:p-6 text-gray-200 max-w-3xl mx-auto min-h-screen">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Sheet Music Reader</h1>
        <p className="text-lg text-gray-400">Organize your music, focus your practice.</p>
      </header>

      <div className="mb-8">
        <button
          onClick={onOpenDeviceFiles}
          className="w-full flex items-center justify-center p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all duration-200 ease-in-out shadow-lg text-lg font-semibold"
        >
          <MusicNoteIcon className="mr-3 w-7 h-7" />
          Open Sheet Music
        </button>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-4 mb-8">
        <h2 className="text-xl font-semibold mb-3 text-white">Create New Playlist</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="E.g., 'Classical Pieces'"
            className="flex-grow bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
          <button
            onClick={handleCreatePlaylist}
            className="p-2 bg-green-600 rounded-md hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!newPlaylistName.trim()}
          >
            <PlusIcon />
          </button>
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4 text-white flex items-center">
          <FolderIcon className="mr-3 w-7 h-7" /> Your Playlists
        </h2>
        {playlists.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No playlists yet. Create one above!</p>
        ) : (
          <div className="space-y-3">
            {playlists.map(playlist => (
              <div key={playlist.id} className="bg-gray-800 rounded-lg overflow-hidden transition-all">
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-700/50" onClick={() => togglePlaylist(playlist.id)}>
                  <div className="flex items-center">
                    <span className={`transition-transform duration-200 ${expandedPlaylists.has(playlist.id) ? 'rotate-180' : ''}`}>
                      <ChevronDownIcon className="w-5 h-5 mr-3 text-gray-400" />
                    </span>
                    <h3 className="font-semibold text-lg">{playlist.name}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded-full">{playlist.items.length}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeletePlaylist(playlist.id); }}
                      className="p-2 rounded-full hover:bg-red-500/20 text-gray-400 hover:text-red-400"
                    >
                      <TrashIcon className="w-5 h-5"/>
                    </button>
                  </div>
                </div>
                {expandedPlaylists.has(playlist.id) && (
                  <div className="border-t border-gray-700 p-2 sm:p-4">
                    {playlist.items.length > 0 ? (
                      <ul className="space-y-2">
                        {playlist.items.map(item => (
                          <li key={item.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-700/70">
                            <span className="truncate flex-1 mr-4">{item.name}</span>
                            <div className="flex items-center space-x-2 flex-shrink-0">
                              <button
                                onClick={() => onSelectFile(item)}
                                className="px-3 py-1 text-sm bg-blue-600 rounded-md hover:bg-blue-500 transition-colors"
                              >View</button>
                              <button
                                onClick={() => onRemoveFromPlaylist(playlist.id, item.id)}
                                className="p-1 rounded-full text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                              >
                                <XIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 text-center py-4">This playlist is empty.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistView;
