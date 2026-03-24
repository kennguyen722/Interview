'use strict';

function createTypeaheadController(fetcher, waitMs = 250) {
  let timer = null;
  let activeRequestId = 0;
  let latestHandledId = 0;
  let abortController = null;
  let latestResult = null;

  async function search(query) {
    clearTimeout(timer);

    return new Promise((resolve, reject) => {
      timer = setTimeout(async () => {
        const requestId = ++activeRequestId;

        if (abortController) {
          abortController.abort();
        }
        abortController = new AbortController();

        try {
          const result = await fetcher(query, { signal: abortController.signal });
          if (requestId < latestHandledId) {
            resolve({ ignored: true, result: latestResult });
            return;
          }
          latestHandledId = requestId;
          latestResult = result;
          resolve({ ignored: false, result });
        } catch (error) {
          if (error?.name === 'AbortError') {
            resolve({ ignored: true, result: latestResult });
            return;
          }
          reject(error);
        }
      }, waitMs);
    });
  }

  return {
    search,
    getLatestResult() {
      return latestResult;
    }
  };
}

module.exports = {
  createTypeaheadController
};

if (require.main === module) {
  const fakeFetcher = async (query) => ({ query, items: [query + '_1'] });
  const controller = createTypeaheadController(fakeFetcher, 10);
  controller.search('ke').then(console.log);
}
