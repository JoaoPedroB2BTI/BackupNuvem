import { useState } from 'react';
import { FolderPlus, FolderOpen } from 'lucide-react';
import CreateFolder from './components/CreateFolder';
import FolderList from './components/FolderList';

type Tab = 'create' | 'view';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('create');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Folder Manager</h1>
          <p className="text-gray-400">Create and manage your folders and files</p>
        </header>

        <div className="mb-8 flex gap-2 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'create'
                ? 'text-blue-400 border-blue-400'
                : 'text-gray-400 border-transparent hover:text-gray-300'
            }`}
          >
            <FolderPlus className="w-5 h-5" />
            Create Folder
          </button>
          <button
            onClick={() => setActiveTab('view')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'view'
                ? 'text-blue-400 border-blue-400'
                : 'text-gray-400 border-transparent hover:text-gray-300'
            }`}
          >
            <FolderOpen className="w-5 h-5" />
            View Folders
          </button>
        </div>

        <main className="pb-12">
          {activeTab === 'create' ? <CreateFolder /> : <FolderList />}
        </main>
      </div>
    </div>
  );
}

export default App;
