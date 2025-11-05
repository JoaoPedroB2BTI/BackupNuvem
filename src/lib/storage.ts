interface File {
  id: string;
  name: string;
  url: string;
  created_at: string;
}

interface Folder {
  id: string;
  name: string;
  created_at: string;
  files: File[];
}

const STORAGE_KEY = 'folders_data';

function generateId() {
  return crypto.randomUUID();
}

function getFolders(): Folder[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveFolders(folders: Folder[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(folders));
}

export const storage = {
  createFolder: (name: string) => {
    const folders = getFolders();
    const newFolder: Folder = {
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

  renameFolder: (id: string, newName: string) => {
    const folders = getFolders();
    const folder = folders.find((f) => f.id === id);
    if (folder) {
      folder.name = newName;
      saveFolders(folders);
      return folder;
    }
    return null;
  },

  deleteFolder: (id: string) => {
    const folders = getFolders();
    const filtered = folders.filter((f) => f.id !== id);
    saveFolders(filtered);
  },

  addFile: (folderId: string, fileName: string, fileUrl: string) => {
    const folders = getFolders();
    const folder = folders.find((f) => f.id === folderId);
    if (folder) {
      const newFile: File = {
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

  deleteFile: (folderId: string, fileId: string) => {
    const folders = getFolders();
    const folder = folders.find((f) => f.id === folderId);
    if (folder) {
      folder.files = folder.files.filter((f) => f.id !== fileId);
      saveFolders(folders);
    }
  },
};
