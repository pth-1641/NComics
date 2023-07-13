declare global {
  interface Window {
    db: IDBDatabase;
  }
}

type Comic = {
  id: string;
  title: string;
  thumbnail: string;
  authors: string | string[];
  status: string;
  reading_at: number;
  is_adult: boolean;
};

export const initLocalDb = () => {
  const indexedDB = window.indexedDB;

  if (!indexedDB) return;

  const localDb = indexedDB.open('history', 1);

  localDb.onupgradeneeded = () => {
    const db = localDb.result;
    const store = db.createObjectStore('history', {
      keyPath: 'id',
      autoIncrement: false,
    });
    store.createIndex('reading_at', 'reading_at', { unique: true });
  };

  localDb.onsuccess = (e: any) => {
    window.db = e.target.result;
  };

  localDb.onerror = () => {
    console.error(localDb.error);
  };
};

export const historyAddComic = (data: Comic) => {
  const db = window.db;
  const trans = db.transaction('history', 'readwrite');
  const store = trans.objectStore('history');
  store.put(data);
};
