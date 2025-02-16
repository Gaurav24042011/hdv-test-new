export const fetchImageAsFile = (url, id) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker('src/utility/imageWorker.js');

    worker.onmessage = (event) => {
      if (event.data.error) {
        reject(event.data.error);
      } else {
        resolve(event.data);
      }
      worker.terminate();
    };

    worker.postMessage({ url, id });
  });
};