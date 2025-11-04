import { useState, useEffect } from 'react';
import { Folder, ChevronDown, ChevronRight, FileText, Download, Edit2, X, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface File {
  id: string;
  name: string;
  url: string;
}

interface FolderWithFiles {
  id: string;
  name: string;
  created_at: string;
  files: File[];
}

export default function FolderList() {
  const [folders, setFolders] = useState<FolderWithFiles[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const { data: foldersData, error: foldersError } = await supabase
        .from('folders')
        .select('*')
        .order('created_at', { ascending: false });

      if (foldersError) throw foldersError;

      const foldersWithFiles = await Promise.all(
        (foldersData || []).map(async (folder) => {
          const { data: filesData } = await supabase
            .from('files')
            .select('*')
            .eq('folder_id', folder.id)
            .order('created_at', { ascending: false });

          return {
            ...folder,
            files: filesData || [],
          };
        })
      );

      setFolders(foldersWithFiles);
    } catch (error) {
      console.error('Error fetching folders:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const handleDownload = (file: File) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const startRename = (folder: FolderWithFiles) => {
    setRenamingId(folder.id);
    setRenameValue(folder.name);
  };

  const cancelRename = () => {
    setRenamingId(null);
    setRenameValue('');
  };

  const saveRename = async (folderId: string) => {
    if (!renameValue.trim()) {
      cancelRename();
      return;
    }

    try {
      const { error } = await supabase
        .from('folders')
        .update({ name: renameValue })
        .eq('id', folderId);

      if (error) throw error;

      setFolders((prev) =>
        prev.map((folder) =>
          folder.id === folderId ? { ...folder, name: renameValue } : folder
        )
      );
      cancelRename();
    } catch (error) {
      console.error('Error renaming folder:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-400">Loading folders...</div>
      </div>
    );
  }

  if (folders.length === 0) {
    return (
      <div className="text-center py-12">
        <Folder className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">No folders created yet</p>
        <p className="text-gray-500 text-sm mt-2">Create a folder in the first tab to get started</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <Folder className="w-8 h-8 text-blue-400" />
        All Folders
      </h2>

      <div className="space-y-3">
        {folders.map((folder) => {
          const isExpanded = expandedFolders.has(folder.id);
          const isRenaming = renamingId === folder.id;

          return (
            <div key={folder.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <div className="px-6 py-4 flex items-center gap-3 border-b border-gray-700">
                <button
                  onClick={() => toggleFolder(folder.id)}
                  className="flex items-center gap-3 flex-1 hover:opacity-80 transition-opacity text-left"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                  <Folder className="w-6 h-6 text-blue-400 flex-shrink-0" />
                  {isRenaming ? (
                    <input
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      className="flex-1 bg-gray-900 border border-blue-500 rounded px-3 py-1 text-white text-sm focus:outline-none"
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                    />
                  ) : (
                    <div className="flex-1">
                      <span className="text-white font-medium block">{folder.name}</span>
                      <span className="text-xs text-gray-500 mt-1 block">{folder.id}</span>
                    </div>
                  )}
                </button>
                <span className="text-sm text-gray-500 flex-shrink-0">
                  {folder.files.length} {folder.files.length === 1 ? 'file' : 'files'}
                </span>
                {isRenaming ? (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => saveRename(folder.id)}
                      className="p-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={cancelRename}
                      className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startRename(folder)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex-shrink-0"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {isExpanded && (
                <div className="border-t border-gray-700 bg-gray-900">
                  {folder.files.length === 0 ? (
                    <div className="px-6 py-8 text-center text-gray-500">
                      No files in this folder
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-800">
                      {folder.files.map((file) => (
                        <div
                          key={file.id}
                          className="px-6 py-3 flex items-center gap-3 hover:bg-gray-800 transition-colors group"
                        >
                          <FileText className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          <span className="text-gray-300 flex-1">{file.name}</span>
                          <button
                            onClick={() => handleDownload(file)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
