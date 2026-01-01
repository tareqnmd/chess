/**
 * Stockfish Engine Wrapper
 * Uses stockfish.js web worker for chess AI
 */

// Use local stockfish.js from public folder
const STOCKFISH_PATH = '/stockfish.js';

export interface EngineMessage {
	uciMessage: string;
	bestMove?: string;
	ponder?: string;
	positionEvaluation?: string;
	possibleMate?: string;
	pv?: string;
	depth?: number;
}

export interface EngineOptions {
	depth?: number;
	movetime?: number;
}

class StockfishEngine {
	private worker: Worker | null = null;
	private isReady = false;
	private messageCallbacks: ((data: EngineMessage) => void)[] = [];
	private initPromise: Promise<void> | null = null;

	constructor() {
		this.initPromise = this.init();
	}

	private async init(): Promise<void> {
		return new Promise((resolve, reject) => {
			try {
				this.worker = new Worker(STOCKFISH_PATH);
				
				this.worker.onmessage = (e: MessageEvent<string>) => {
					const data = this.parseMessage(e.data);
					
					if (data.uciMessage === 'readyok') {
						this.isReady = true;
						resolve();
					}
					
					this.messageCallbacks.forEach(cb => cb(data));
				};

				this.worker.onerror = (e) => {
					console.error('Stockfish worker error:', e);
					reject(e);
				};

				// Initialize UCI protocol
				this.worker.postMessage('uci');
				this.worker.postMessage('isready');
			} catch (error) {
				reject(error);
			}
		});
	}

	private parseMessage(message: string): EngineMessage {
		return {
			uciMessage: message,
			bestMove: message.match(/bestmove\s+(\S+)/)?.[1],
			ponder: message.match(/ponder\s+(\S+)/)?.[1],
			positionEvaluation: message.match(/cp\s+(-?\d+)/)?.[1],
			possibleMate: message.match(/mate\s+(-?\d+)/)?.[1],
			pv: message.match(/ pv\s+(.*)/)?.[1],
			depth: Number(message.match(/ depth\s+(\d+)/)?.[1] ?? 0),
		};
	}

	onMessage(callback: (data: EngineMessage) => void): () => void {
		this.messageCallbacks.push(callback);
		return () => {
			this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
		};
	}

	async waitReady(): Promise<void> {
		if (this.isReady) return;
		await this.initPromise;
	}

	async findBestMove(fen: string, options: EngineOptions = {}): Promise<string | null> {
		await this.waitReady();
		
		if (!this.worker) return null;

		return new Promise((resolve) => {
			const { depth = 12, movetime } = options;

			const cleanup = this.onMessage((data) => {
				if (data.bestMove) {
					cleanup();
					resolve(data.bestMove);
				}
			});

			this.worker!.postMessage(`position fen ${fen}`);
			
			if (movetime) {
				this.worker!.postMessage(`go movetime ${movetime}`);
			} else {
				this.worker!.postMessage(`go depth ${Math.min(depth, 20)}`);
			}
		});
	}

	async evaluate(fen: string, depth = 12): Promise<EngineMessage | null> {
		await this.waitReady();
		
		if (!this.worker) return null;

		return new Promise((resolve) => {
			let lastEval: EngineMessage | null = null;

			const cleanup = this.onMessage((data) => {
				if (data.depth && data.depth > 0) {
					lastEval = data;
				}
				if (data.bestMove) {
					cleanup();
					resolve(lastEval);
				}
			});

			this.worker!.postMessage(`position fen ${fen}`);
			this.worker!.postMessage(`go depth ${Math.min(depth, 20)}`);
		});
	}

	stop(): void {
		this.worker?.postMessage('stop');
	}

	setSkillLevel(level: number): void {
		// Stockfish skill level 0-20
		this.worker?.postMessage(`setoption name Skill Level value ${Math.min(20, Math.max(0, level))}`);
	}

	terminate(): void {
		this.isReady = false;
		this.worker?.postMessage('quit');
		this.worker?.terminate();
		this.worker = null;
	}
}

// Singleton instance
let engineInstance: StockfishEngine | null = null;

export function getEngine(): StockfishEngine {
	if (!engineInstance) {
		engineInstance = new StockfishEngine();
	}
	return engineInstance;
}

export function terminateEngine(): void {
	if (engineInstance) {
		engineInstance.terminate();
		engineInstance = null;
	}
}

export default StockfishEngine;

