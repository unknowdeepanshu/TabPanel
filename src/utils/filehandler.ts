//web api indexdb api
let DB_NAME = "tabplan-db";
let STORE_NAME = "file_handler";
async function openDB(): Promise<IDBDatabase> {
  return new Promise<IDBDatabase>((resolve, rejects) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => rejects(request.error);
  });
}
async function saveHandle(key: string, handle: FileSystemHandle) {
  const db = await openDB();

  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(handle, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
async function getHandle<T extends FileSystemHandle>(
  key: string,
): Promise<T | undefined> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const request = tx.objectStore(STORE_NAME).get(key);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
//File handling api

export type FolderChange = {
  type: string;
  path: string;
  movedFrom?: string;
};

type FileSystemChangeRecordLike = {
  type: string;
  changedHandle?: { name: string } | null;
  relativePathComponents?: string[] | null;
  relativePathMovedFrom?: string[] | null;
};

type FileSystemObserverLike = {
  observe: (
    handle: FileSystemDirectoryHandle,
    options: { recursive: boolean },
  ) => Promise<void>;
  disconnect: () => void;
};

type FileSystemObserverConstructor = new (
  callback: (records: FileSystemChangeRecordLike[]) => void,
) => FileSystemObserverLike;

let folderObserver: FileSystemObserverLike | undefined;
const folderChangeListeners = new Set<(changes: FolderChange[]) => void>();

function subscribeToFolderChanges(
  listener: (changes: FolderChange[]) => void,
) {
  folderChangeListeners.add(listener);
  return () => {
    folderChangeListeners.delete(listener);
  };
}

async function selectBackupFolder() {
  const directoryHandle = await (
    window as unknown as Window & {
      showDirectoryPicker: (options: {
        mode: "readwrite";
      }) => Promise<FileSystemDirectoryHandle>;
    }
  ).showDirectoryPicker({
    mode: "readwrite",
  });

  await saveHandle("backup-folder", directoryHandle);

  const fileHandle = await directoryHandle.getFileHandle(
    "TablePlanerData.json",
    { create: true },
  );

  await saveHandle("backup-file", fileHandle);
  return directoryHandle.name;
}
async function UpdateFolder() {
  try {
    const fileHandle = await getHandle<FileSystemFileHandle>("backup-file");

    if (!fileHandle) {
      throw new Error("No backup file selected");
    }

    const permission = await (
      fileHandle as FileSystemFileHandle & {
        queryPermission: (options: {
          mode: "readwrite";
        }) => Promise<PermissionState>;
      }
    ).queryPermission({ mode: "readwrite" });

    if (permission !== "granted") {
      throw new Error("File permission needs to be granted again");
    }
    const writable = await fileHandle.createWritable();
    writable.write(
      JSON.stringify(
        {
          project: "TabPlaner",
          data: [],
          setting: [],
          createdAt: new Date().toISOString(),
        },
        null,
        2,
      ),
    );
    await writable.close();
  } catch (error) {
    console.error("got error in files handler", error);
  }
}

async function observeFolder(): Promise<boolean> {
  const directoryHandle =
    await getHandle<FileSystemDirectoryHandle>("backup-folder");

  if (!directoryHandle) {
    throw new Error("No backup folder selected");
  }

  const Observer = (
    window as Window & {
      FileSystemObserver?: FileSystemObserverConstructor;
    }
  ).FileSystemObserver;

  if (!Observer) {
    return false;
  }

  folderObserver?.disconnect();
  const observer = new Observer((records) => {
    const changes = records.map((record) => ({
      type: record.type,
      path:
        record.relativePathComponents?.join("\\") ??
        record.changedHandle?.name ??
        directoryHandle.name,
      movedFrom: record.relativePathMovedFrom?.join("\\") || undefined,
    }));
    for (const listener of folderChangeListeners) {
      listener(changes);
    }
  });

  await observer.observe(directoryHandle, {
    recursive: true,
  });
  folderObserver = observer;
  return true;
}

export {
  selectBackupFolder,
  UpdateFolder,
  observeFolder,
  subscribeToFolderChanges,
};
