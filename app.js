if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js');
      console.log('ServiceWorker registered with scope:', registration.scope);

      const cacheStatusEl = document.getElementById('cache-status');
      if (cacheStatusEl) {
        cacheStatusEl.textContent = 'All documents saved for offline reading';
      }
    } catch (error) {
      console.error('ServiceWorker registration failed:', error);
      const cacheStatusEl = document.getElementById('cache-status');
      if (cacheStatusEl) {
        cacheStatusEl.textContent = 'Operating in online mode';
      }
    }
  });
}