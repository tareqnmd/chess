export class IndexedDBStorage {
	private dbName: string;
	private storeName: string;
	private dbPromise: Promise<IDBDatabase>;

	constructor(dbName = 'ChessAppDB', storeName = 'appStore') {
		this.dbName = dbName;
		this.storeName = storeName;
		this.dbPromise = this.openDB();
	}

	private openDB(): Promise<IDBDatabase> {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(this.dbName, 1);
			request.onupgradeneeded = () => {
				const db = request.result;
				if (!db.objectStoreNames.contains(this.storeName)) {
					db.createObjectStore(this.storeName);
				}
			};
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	}

	async set(key: string, value: unknown): Promise<void> {
		const db = await this.dbPromise;
		return new Promise((resolve, reject) => {
			const tx = db.transaction(this.storeName, 'readwrite');
			const store = tx.objectStore(this.storeName);
			store.put(value, key);
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error);
		});
	}

	async get<T = unknown>(key: string): Promise<T | undefined> {
		const db = await this.dbPromise;
		return new Promise((resolve, reject) => {
			const tx = db.transaction(this.storeName, 'readonly');
			const store = tx.objectStore(this.storeName);
			const request = store.get(key);
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	}

	async delete(key: string): Promise<void> {
		const db = await this.dbPromise;
		return new Promise((resolve, reject) => {
			const tx = db.transaction(this.storeName, 'readwrite');
			const store = tx.objectStore(this.storeName);
			store.delete(key);
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error);
		});
	}

	async clear(): Promise<void> {
		const db = await this.dbPromise;
		return new Promise((resolve, reject) => {
			const tx = db.transaction(this.storeName, 'readwrite');
			const store = tx.objectStore(this.storeName);
			store.clear();
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error);
		});
	}

	async getAll<T = unknown>(): Promise<T[]> {
		const db = await this.dbPromise;
		return new Promise((resolve, reject) => {
			const tx = db.transaction(this.storeName, 'readonly');
			const store = tx.objectStore(this.storeName);
			const request = store.getAll();
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	}
}

// Usage example:
// const storage = new IndexedDBStorage();
// await storage.set('key', value);
// const value = await storage.get('key');
// await storage.delete('key');
// await storage.clear();
// const all = await storage.getAll();
