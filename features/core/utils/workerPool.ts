export class WorkerPool {
  private workers: Worker[] = [];
  private availableWorkers: Worker[] = [];
  private queue: Array<{ task: any; resolve: (result: any) => void }> = [];
  
 constructor(workerFactory: () => Worker, poolSize: number = navigator.hardwareConcurrency || 4) {
    for (let i = 0; i < poolSize; i++) {
      const worker = workerFactory(); // ✅ URL استاتیک در call site
      this.workers.push(worker);
      this.availableWorkers.push(worker);
    }
  }

  execute<T, R>(task: T): Promise<R> {
    return new Promise((resolve) => {
      if (this.availableWorkers.length > 0) {
        const worker = this.availableWorkers.pop()!;
        this.runTask(worker, task, resolve);
      } else {
        this.queue.push({ task, resolve });
      }
    });
  }

  private runTask(worker: Worker, task: any, resolve: (result: any) => void) {
    const handler = (e: MessageEvent) => {
      worker.removeEventListener('message', handler);
      this.availableWorkers.push(worker);
      resolve(e.data);

      if (this.queue.length > 0) {
        const next = this.queue.shift()!;
        this.runTask(worker, next.task, next.resolve);
      }
    };

    worker.addEventListener('message', handler);
    worker.postMessage(task);
  }

  terminate() {
    this.workers.forEach((w) => w.terminate());
    this.workers = [];
    this.availableWorkers = [];
    this.queue = [];
  }
}
