const APP_VERSION = '1.15.0';
const VERSION_KEY = 'appVersion';

function logVersionCheck(storedVersion) {
    console.log('%c Version Check:', 'background: #333; color: #bada55', {
        currentVersion: APP_VERSION,
        storedVersion: storedVersion,
        timestamp: new Date().toISOString()
    });
}

async function clearBrowserCache() {
    if (!window.caches) {
        console.warn('%c Caches API non supportata dal browser', 'background: #333; color: #ff9966');
        return;
    }
    try {
        const cacheNames = await caches.keys();
        console.log('%c Cache trovate:', 'background: #333; color: #ff9966', cacheNames);
        
        const deletePromises = cacheNames.map(name => 
            caches.delete(name).then(() => {
                console.log(`Cache eliminata: ${name}`);
            })
        );

        await Promise.all(deletePromises);
        console.log('%c Pulizia cache completata', 'background: #333; color: #66ff99');
    } catch (error) {
        console.error('%c Errore durante la pulizia della cache:', 'background: #333; color: #ff0000', error);
    }
}

function logResourceLoading() {
    const resources = performance.getEntriesByType('resource');
    console.log('%c Risorse caricate:', 'background: #333; color: #66ff99', 
        resources.map(r => ({
            name: r.name,
            type: r.initiatorType,
            duration: `${r.duration.toFixed(2)}ms`,
            // Evita di fare richieste HEAD per risorse di terze parti
            headers: r.name.startsWith(window.location.origin) ? getResourceHeaders(r.name) : 'CORS restriction'
        }))
    );
}

async function getResourceHeaders(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return {
            'Cache-Control': response.headers.get('Cache-Control'),
            'Pragma': response.headers.get('Pragma'),
            'Expires': response.headers.get('Expires'),
            'X-Accel-Expires': response.headers.get('X-Accel-Expires')
        };
    } catch (error) {
        console.error('%c Errore durante il recupero delle intestazioni:', 'background: #333; color: #ff0000', error);
        return {};
    }
}

function forcePageReload() {
    const timestamp = new Date().getTime();
    const newUrl = `${window.location.pathname}?v=${APP_VERSION}&t=${timestamp}`;
    console.log('%c Forzando il ricaricamento della pagina con URL:', 'background: #333; color: #66ff99', newUrl);
    window.location.href = newUrl;
}

async function checkVersionAndRefresh() {
    console.log('%c Iniziando il controllo della versione', 'background: #333; color: #bada55');
    const storedVersion = localStorage.getItem(VERSION_KEY);
    const urlParams = new URLSearchParams(window.location.search);
    const urlVersion = urlParams.get('v');
    
    logVersionCheck(storedVersion);
    
    if (urlVersion === APP_VERSION) {
        console.log('%c Versione URL corrisponde alla versione corrente', 'background: #333; color: #66ff99');
        logResourceLoading();
        return;
    }
    
    if (!storedVersion || storedVersion !== APP_VERSION) {
        console.log('%c Versione non corrispondente - Iniziando il refresh', 'background: #333; color: #ff6666');
        localStorage.setItem(VERSION_KEY, APP_VERSION);
        await clearBrowserCache();
        forcePageReload();
    } else {
        console.log('%c Versione corrispondente - Nessun refresh necessario', 'background: #333; color: #66ff99');
        logResourceLoading();
    }
}

function addAggressiveNoCacheMeta() {
    console.log('%c Aggiungendo meta tag per disabilitare la cache', 'background: #333; color: #bada55');
    const metaTags = [
        ['Cache-Control', 'no-cache, no-store, must-revalidate, private, max-age=0'],
        ['Pragma', 'no-cache'],
        ['Expires', '-1'],
        ['X-Accel-Expires', '0']
    ];
    
    metaTags.forEach(([httpEquiv, content]) => {
        const meta = document.createElement('meta');
        meta.setAttribute('http-equiv', httpEquiv);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
        console.log(`%c Meta tag aggiunto: ${httpEquiv} = ${content}`, 'background: #333; color: #66ff99');
    });

    // Log all meta tags in the head to verify
    const metaElements = document.getElementsByTagName('meta');
    console.log('%c Tutti i meta tag nel documento:', 'background: #333; color: #66ff99', [...metaElements].map(meta => ({
        httpEquiv: meta.getAttribute('http-equiv'),
        content: meta.getAttribute('content')
    })));
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log('%c DOM completamente caricato', 'background: #333; color: #bada55');
    addAggressiveNoCacheMeta();
    await checkVersionAndRefresh();
    
    const versionElement = document.createElement('div');
    versionElement.className = 'version-display';
    versionElement.textContent = `v${APP_VERSION}`;
    document.body.appendChild(versionElement);
    console.log('%c Elemento versione aggiunto al DOM', 'background: #333; color: #66ff99');
});