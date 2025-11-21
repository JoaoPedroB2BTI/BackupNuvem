const STORAGE_KEY = 'folders_data';

function generateId() {
  return crypto.randomUUID();
}

function getFolders() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveFolders(folders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(folders));
}

export const storage = {
  createFolder: (name) => {
    const folders = getFolders();
    const newFolder = {
      id: generateId(),
      name,
      created_at: new Date().toISOString(),
      files: [],
    };
    folders.push(newFolder);
    saveFolders(folders);
    return newFolder;
  },

  getFolders: () => {
    return getFolders().sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  renameFolder: (id, newName) => {
    const folders = getFolders();
    const folder = folders.find((f) => f.id === id);
    if (folder) {
      folder.name = newName;
      saveFolders(folders);
      return folder;
    }
    return null;
  },

  deleteFolder: (id) => {
    const folders = getFolders();
    const filtered = folders.filter((f) => f.id !== id);
    saveFolders(filtered);
  },

  addFile: (folderId, fileName, fileUrl) => {
    const folders = getFolders();
    const folder = folders.find((f) => f.id === folderId);
    if (folder) {
      const newFile = {
        id: generateId(),
        name: fileName,
        url: fileUrl,
        created_at: new Date().toISOString(),
      };
      folder.files.push(newFile);
      saveFolders(folders);
      return newFile;
    }
    return null;
  },

  deleteFile: (folderId, fileId) => {
    const folders = getFolders();
    const folder = folders.find((f) => f.id === folderId);
    if (folder) {
      folder.files = folder.files.filter((f) => f.id !== fileId);
      saveFolders(folders);
    }
  },
};
