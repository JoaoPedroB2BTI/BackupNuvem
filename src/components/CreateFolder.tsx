import { useState } from 'react';
import { FolderPlus } from 'lucide-react';
import { storage } from '../lib/storage';

export default function CreateFolder() {
  const [folderName, setFolderName] = useState('');
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    setLoading(true);
    try {
      const folder = storage.createFolder(folderName);
      setCreatedId(folder.id);
      setFolderName('');
    } catch (error) {
      console.error('Error creating folder:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-8 border border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <FolderPlus className="w-8 h-8 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">Create New Folder</h2>
        </div>

        <div className="mb-6">
          <label htmlFor="folderName" className="block text-sm font-medium text-gray-300 mb-2">
            Folder Name
          </label>
          <input
            id="folderName"
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter folder name..."
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !folderName.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {loading ? 'Creating...' : 'Create Folder'}
        </button>
      </form>

      {createdId && (
        <div className="mt-6 bg-gray-800 rounded-lg p-6 border border-blue-500/30">
          <h3 className="text-lg font-semibold text-white mb-2">Folder Created Successfully!</h3>
          <div className="bg-gray-900 rounded p-4 border border-gray-700">
            <p className="text-sm text-gray-400 mb-1">Folder ID:</p>
            <p className="text-blue-400 font-mono text-sm break-all">{createdId}</p>
          </div>
        </div>
      )}
    </div>
  );
}
