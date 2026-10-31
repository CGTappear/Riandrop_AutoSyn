/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 356
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WI: () => (/* binding */ unregisterBookmarkListeners),
/* harmony export */   isSyncInProgress: () => (/* binding */ isSyncInProgress),
/* harmony export */   sV: () => (/* binding */ setSyncing),
/* harmony export */   tW: () => (/* binding */ registerBookmarkListeners)
/* harmony export */ });
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(815);
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(105);
/* harmony import */ var _utils_logger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(628);
/* harmony import */ var _utils_hash__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(760);
/* harmony import */ var _utils_bookmarkNode__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(168);
// Firefox Bookmark Event Listeners





// Track operations to avoid duplicates during sync
// Uses a depth counter instead of boolean to handle concurrent syncs correctly:
// if two sync processes run in parallel, the first to finish won't prematurely
// reset the flag while the second is still running.
let syncDepth = 0;
function setSyncing(value) {
    if (value) {
        syncDepth++;
    }
    else {
        syncDepth = Math.max(0, syncDepth - 1);
    }
}
function isSyncInProgress() {
    return syncDepth > 0;
}
// ==================== Debounced reconcile trigger (task 014) ====================
// One debounced trigger for every relevant bookmark event. The event itself
// carries no payload anymore — reconcile re-derives everything from the
// three-way diff. Trailing debounce: a burst (import, drag of many) collapses
// into one pass. If the MV3 SW dies before the timer fires, the periodic alarm
// reconcile catches up (same guarantee the old queue had).
const RECONCILE_DEBOUNCE_MS = 800;
let reconcileTimer = null;
function scheduleReconcile() {
    if (reconcileTimer)
        clearTimeout(reconcileTimer);
    reconcileTimer = setTimeout(() => {
        reconcileTimer = null;
        // Dynamic import breaks the module cycle (syncManager imports setSyncing).
        void Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 554))
            .then((m) => m.reconcileAllMappings())
            .catch((error) => _utils_logger__WEBPACK_IMPORTED_MODULE_2__/* .logger */ .v.error('Debounced reconcile failed', error));
    }, RECONCILE_DEBOUNCE_MS);
}
// Shared cheap gate for every handler: never react to our own sync writes, and
// only when connected + auto-sync on.
async function syncActive() {
    if (isSyncInProgress())
        return false;
    const [authenticated, settings] = await Promise.all([
        (0,_storage__WEBPACK_IMPORTED_MODULE_1__/* .isAuthenticated */ .wR)(),
        (0,_storage__WEBPACK_IMPORTED_MODULE_1__/* .getSettings */ .mt)(),
    ]);
    return authenticated && settings.enabled;
}
// ==================== User modification times ====================
// Chrome bookmark nodes carry no "last modified" time, so the "newest wins"
// conflict strategy needs us to remember when the USER touched a node. Only
// user edits are recorded (our own sync writes run inside setSyncing and are
// skipped). Deletions are stored as `del:<id>`. Writes are serialised through
// a promise chain so a burst of events never loses an update.
const BROWSER_MTIMES_KEY = 'browser_mtimes';
const MTIME_TTL_MS = 180 * 24 * 60 * 60 * 1000;
let mtimeChain = Promise.resolve();
function markBrowserModified(id, deleted = false) {
    if (isSyncInProgress() || !id)
        return;
    const now = Date.now();
    mtimeChain = mtimeChain.then(async () => {
        const result = await webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().storage.local.get(BROWSER_MTIMES_KEY);
        const times = result[BROWSER_MTIMES_KEY] || {};
        times[deleted ? `del:${id}` : id] = now;
        for (const key of Object.keys(times)) {
            if (now - times[key] > MTIME_TTL_MS)
                delete times[key];
        }
        await webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().storage.local.set({ [BROWSER_MTIMES_KEY]: times });
    }).catch((error) => _utils_logger__WEBPACK_IMPORTED_MODULE_2__/* .logger */ .v.warn('Failed to record bookmark modification time', error));
}
// ==================== Event Listeners ====================
async function handleBookmarkCreated(id, bookmark) {
    markBrowserModified(id);
    if (isSyncInProgress())
        return;
    if (!(0,_utils_bookmarkNode__WEBPACK_IMPORTED_MODULE_4__/* .isBookmarkNode */ .d)(bookmark))
        return;
    if (!(0,_utils_hash__WEBPACK_IMPORTED_MODULE_3__/* .isValidSyncUrl */ .zU)(bookmark.url))
        return;
    if (!(await syncActive()))
        return;
    const parentId = bookmark.parentId;
    if (!parentId)
        return;
    if (!(await hasSyncedAncestor(parentId))) {
        _utils_logger__WEBPACK_IMPORTED_MODULE_2__/* .logger */ .v.debug('Created bookmark has no synced ancestor, ignoring');
        return;
    }
    _utils_logger__WEBPACK_IMPORTED_MODULE_2__/* .logger */ .v.info(`Bookmark created in synced tree: ${bookmark.title}`);
    scheduleReconcile();
}
async function handleBookmarkRemoved(id, _removeInfo) {
    markBrowserModified(id, true);
    if (!(await syncActive()))
        return;
    // Relevant if a linked bookmark, or a mapped folder itself, was removed.
    const link = await (0,_storage__WEBPACK_IMPORTED_MODULE_1__/* .findBookmarkLink */ .cM)(id);
    const mapping = link ? null : await (0,_storage__WEBPACK_IMPORTED_MODULE_1__/* .findMappingByFirefoxId */ .rW)(id);
    if (!link && !mapping) {
        _utils_logger__WEBPACK_IMPORTED_MODULE_2__/* .logger */ .v.debug('Removed node is neither linked nor a mapped folder, ignoring');
        return;
    }
    _utils_logger__WEBPACK_IMPORTED_MODULE_2__/* .logger */ .v.info(`Removal in synced scope: ${link?.title ?? mapping?.folderName}`);
    scheduleReconcile();
}
async function handleBookmarkChanged(id, changeInfo) {
    markBrowserModified(id);
    if (!(await syncActive()))
        return;
    const link = await (0,_storage__WEBPACK_IMPORTED_MODULE_1__/* .findBookmarkLink */ .cM)(id);
    if (link) {
        // Skip a no-op change (content hash unchanged) — avoids a pointless pass.
        const newTitle = changeInfo.title || link.title;
        const newUrl = changeInfo.url || link.url;
        if ((0,_utils_hash__WEBPACK_IMPORTED_MODULE_3__/* .computeBookmarkHash */ .q$)(newUrl, newTitle) === link.contentHash) {
            _utils_logger__WEBPACK_IMPORTED_MODULE_2__/* .logger */ .v.debug('Content hash unchanged, ignoring change event');
            return;
        }
        _utils_logger__WEBPACK_IMPORTED_MODULE_2__/* .logger */ .v.info(`Bookmark changed: ${newTitle}`);
        scheduleReconcile();
        return;
    }
    // A mapped folder rename (onChanged fires with the new title). Reconcile's
    // three-way rename handles it; the periodic pass also detects renames, so
    // this is a best-effort fast path.
    if (await (0,_storage__WEBPACK_IMPORTED_MODULE_1__/* .findMappingByFirefoxId */ .rW)(id)) {
        _utils_logger__WEBPACK_IMPORTED_MODULE_2__/* .logger */ .v.info('Mapped folder renamed');
        scheduleReconcile();
    }
}
// Walk up the browser folder tree from `folderId`, returning true as soon as an
// ancestor (or the folder itself) is a mapped, synced folder. Used to tell an
// intra-tree move/create inside a not-yet-mapped subfolder from a genuine one
// outside every synced tree. Capped by MAX_ANCESTOR_WALK against a pathological
// tree.
//
// The cap is intentionally independent of (and looser than) syncManager's
// MAX_SYNC_DEPTH — importing that constant here would create a module cycle
// (syncManager already imports setSyncing from this file). A subfolder deeper
// than MAX_SYNC_DEPTH is never mapped by reconcile anyway, so deferring its
// handling only means the raindrop lingers in the old collection (data
// preserved) rather than being deleted+recreated with a new _id — the safer
// failure for a depth no realistic tree reaches.
const MAX_ANCESTOR_WALK = 50;
async function hasSyncedAncestor(folderId) {
    let currentId = folderId;
    for (let i = 0; i < MAX_ANCESTOR_WALK && currentId; i++) {
        if (await (0,_storage__WEBPACK_IMPORTED_MODULE_1__/* .findMappingByFirefoxId */ .rW)(currentId)) {
            return true;
        }
        try {
            const [node] = await webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().bookmarks.get(currentId);
            currentId = node?.parentId;
        }
        catch {
            // Can't verify ancestry → fail closed: assume in-tree and reconcile. A
            // missed sync is recoverable on a later pass; a wrong skip could drop a
            // move that should have propagated.
            return true;
        }
    }
    return false;
}
async function handleBookmarkMoved(id, moveInfo) {
    markBrowserModified(id);
    if (!(await syncActive()))
        return;
    // Relevant if the bookmark is already linked, or either end of the move is
    // within a synced tree. Reconcile re-derives the actual push/pull/move/delete
    // (including "moved out of scope → delete the raindrop") from the diff — the
    // event only decides whether a pass is worth running.
    const link = await (0,_storage__WEBPACK_IMPORTED_MODULE_1__/* .findBookmarkLink */ .cM)(id);
    if (link) {
        scheduleReconcile();
        return;
    }
    if ((await hasSyncedAncestor(moveInfo.oldParentId)) ||
        (await hasSyncedAncestor(moveInfo.parentId))) {
        scheduleReconcile();
        return;
    }
    _utils_logger__WEBPACK_IMPORTED_MODULE_2__/* .logger */ .v.debug('Move touches no synced tree, ignoring');
}
// ==================== Listener Management ====================
let listenersRegistered = false;
function registerBookmarkListeners() {
    if (listenersRegistered) {
        _utils_logger__WEBPACK_IMPORTED_MODULE_2__/* .logger */ .v.debug('Bookmark listeners already registered');
        return;
    }
    webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().bookmarks.onCreated.addListener(handleBookmarkCreated);
    webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().bookmarks.onRemoved.addListener(handleBookmarkRemoved);
    webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().bookmarks.onChanged.addListener(handleBookmarkChanged);
    webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().bookmarks.onMoved.addListener(handleBookmarkMoved);
    listenersRegistered = true;
    _utils_logger__WEBPACK_IMPORTED_MODULE_2__/* .logger */ .v.info('Bookmark listeners registered');
}
function unregisterBookmarkListeners() {
    if (!listenersRegistered) {
        return;
    }
    webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().bookmarks.onCreated.removeListener(handleBookmarkCreated);
    webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().bookmarks.onRemoved.removeListener(handleBookmarkRemoved);
    webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().bookmarks.onChanged.removeListener(handleBookmarkChanged);
    webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().bookmarks.onMoved.removeListener(handleBookmarkMoved);
    // Cancel any armed reconcile. Every teardown path (disable auto-sync,
    // disconnect/blank-slate, last mapping removed) calls this, so a pending
    // timer must not fire afterwards: reconcileAllMappings has no enabled gate,
    // so a late pass would push/pull after the user disabled sync (task 007) or
    // write into freshly-wiped storage after disconnect (task 011).
    if (reconcileTimer) {
        clearTimeout(reconcileTimer);
        reconcileTimer = null;
    }
    listenersRegistered = false;
    _utils_logger__WEBPACK_IMPORTED_MODULE_2__/* .logger */ .v.info('Bookmark listeners unregistered');
}


/***/ },

/***/ 908
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Dd: () => (/* binding */ deleteRaindrop),
/* harmony export */   FL: () => (/* binding */ updateRaindrop),
/* harmony export */   F_: () => (/* binding */ getAllRaindropsInCollection),
/* harmony export */   Gi: () => (/* binding */ getRootCollections),
/* harmony export */   HW: () => (/* binding */ getCurrentUser),
/* harmony export */   IX: () => (/* binding */ updateCollection),
/* harmony export */   Id: () => (/* binding */ getChildCollections),
/* harmony export */   LE: () => (/* binding */ createRaindrops),
/* harmony export */   eI: () => (/* binding */ createRaindrop),
/* harmony export */   No: () => (/* binding */ createCollection),
/* harmony export */   R9: () => (/* binding */ getAllCollections),
/* harmony export */   X_: () => (/* binding */ getCollection),
/* harmony export */   o4: () => (/* binding */ deleteCollection),
/* harmony export */   ri: () => (/* binding */ logout),
/* harmony export */   Cv: () => (/* binding */ searchCollectionCovers)
/* harmony export */ });
/* unused harmony exports getRaindrops, getRaindrop */
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(105);
/* harmony import */ var _utils_logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(628);
// Raindrop.io API Client


const API_BASE_URL = 'https://api.raindrop.io/rest/v1';
// Rate limiting: 120 requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 120;
const RETRY_DELAY_BASE = 1000; // 1 second
const MAX_RETRIES = 3;
class RateLimiter {
    constructor() {
        this.requests = [];
    }
    async wait() {
        const now = Date.now();
        // Remove requests older than the window
        this.requests = this.requests.filter((time) => now - time < RATE_LIMIT_WINDOW);
        if (this.requests.length >= MAX_REQUESTS_PER_WINDOW) {
            // Calculate wait time
            const oldestRequest = this.requests[0];
            const waitTime = RATE_LIMIT_WINDOW - (now - oldestRequest) + 100;
            _utils_logger__WEBPACK_IMPORTED_MODULE_1__/* .logger */ .v.debug(`Rate limit reached, waiting ${waitTime}ms`);
            await new Promise((resolve) => setTimeout(resolve, waitTime));
        }
        this.requests.push(Date.now());
    }
}
const rateLimiter = new RateLimiter();
async function getAccessToken() {
    const token = await (0,_storage__WEBPACK_IMPORTED_MODULE_0__/* .getApiToken */ ._$)();
    if (!token) {
        throw new Error('Not authenticated. Please add your Test Token in Settings.');
    }
    return token;
}
async function apiRequest(method, endpoint, data, retryCount = 0) {
    await rateLimiter.wait();
    const accessToken = await getAccessToken();
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
    };
    const options = {
        method,
        headers,
    };
    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }
    const url = `${API_BASE_URL}${endpoint}`;
    _utils_logger__WEBPACK_IMPORTED_MODULE_1__/* .logger */ .v.debug(`API Request: ${method} ${endpoint}`, data);
    try {
        const response = await fetch(url, options);
        if (response.status === 429) {
            if (retryCount >= MAX_RETRIES) {
                throw new Error(`Rate limited after ${MAX_RETRIES} retries: ${method} ${endpoint}`);
            }
            const retryAfter = parseInt(response.headers.get('Retry-After') || '60');
            const waitTime = Math.min(retryAfter * 1000, 120000);
            _utils_logger__WEBPACK_IMPORTED_MODULE_1__/* .logger */ .v.warn(`Rate limited, waiting ${waitTime}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
            await new Promise((resolve) => setTimeout(resolve, waitTime));
            return apiRequest(method, endpoint, data, retryCount + 1);
        }
        if (!response.ok) {
            const error = new Error(`API request failed: ${response.status} ${response.statusText}`);
            error.status = response.status;
            error.response = response;
            // 401 Unauthorized - token is invalid
            if (response.status === 401) {
                _utils_logger__WEBPACK_IMPORTED_MODULE_1__/* .logger */ .v.warn('Token is invalid, clearing...');
                await (0,_storage__WEBPACK_IMPORTED_MODULE_0__/* .clearApiToken */ .hB)();
                throw new Error('Token invalid. Please check your Test Token in Settings.');
            }
            // Retry on server errors
            if (response.status >= 500 && retryCount < MAX_RETRIES) {
                const delay = RETRY_DELAY_BASE * Math.pow(2, retryCount);
                _utils_logger__WEBPACK_IMPORTED_MODULE_1__/* .logger */ .v.warn(`Server error, retrying in ${delay}ms`);
                await new Promise((resolve) => setTimeout(resolve, delay));
                return apiRequest(method, endpoint, data, retryCount + 1);
            }
            throw error;
        }
        const result = await response.json();
        _utils_logger__WEBPACK_IMPORTED_MODULE_1__/* .logger */ .v.debug(`API Response: ${method} ${endpoint}`, result);
        return result;
    }
    catch (error) {
        // Network error, retry
        if (retryCount < MAX_RETRIES &&
            error instanceof TypeError &&
            error.message.includes('fetch')) {
            const delay = RETRY_DELAY_BASE * Math.pow(2, retryCount);
            _utils_logger__WEBPACK_IMPORTED_MODULE_1__/* .logger */ .v.warn(`Network error, retrying in ${delay}ms`, error);
            await new Promise((resolve) => setTimeout(resolve, delay));
            return apiRequest(method, endpoint, data, retryCount + 1);
        }
        _utils_logger__WEBPACK_IMPORTED_MODULE_1__/* .logger */ .v.error(`API request failed: ${method} ${endpoint}`, error);
        throw error;
    }
}
// ==================== Collections API ====================
async function getRootCollections() {
    const response = await apiRequest('GET', '/collections');
    if (!response.result) {
        throw new Error('Failed to get root collections');
    }
    return response.items;
}
async function getChildCollections() {
    const response = await apiRequest('GET', '/collections/childrens');
    if (!response.result) {
        throw new Error('Failed to get child collections');
    }
    return response.items;
}
async function getAllCollections() {
    // Do NOT swallow a childrens failure: callers (reconcileFolderTree) treat
    // absence from this list as "collection deleted" and resurrect — a partial
    // list would mass-create duplicate collections. An account with zero child
    // collections still returns result:true with an empty items array.
    const [root, children] = await Promise.all([
        getRootCollections(),
        getChildCollections(),
    ]);
    // Deduplicate by _id
    const seen = new Set();
    const all = [];
    for (const collection of [...root, ...children]) {
        if (!seen.has(collection._id)) {
            seen.add(collection._id);
            all.push(collection);
        }
    }
    return all;
}
async function getCollection(id) {
    const response = await apiRequest('GET', `/collection/${id}`);
    if (!response.result || !response.item) {
        throw new Error(`Failed to get collection ${id}`);
    }
    return response.item;
}
async function createCollection(data) {
    const response = await apiRequest('POST', '/collection', data);
    if (!response.result || !response.item) {
        throw new Error('Failed to create collection');
    }
    return response.item;
}
async function updateCollection(id, data) {
    const response = await apiRequest('PUT', `/collection/${id}`, data);
    if (!response.result || !response.item) {
        throw new Error(`Failed to update collection ${id}`);
    }
    return response.item;
}
async function deleteCollection(id) {
    const response = await apiRequest('DELETE', `/collection/${id}`);
    if (!response.result) {
        throw new Error(`Failed to delete collection ${id}`);
    }
}
// Icon search used by "auto-match collection icons". Returns a flat list of
// candidate PNG urls (first provider first). Empty when nothing matched.
async function searchCollectionCovers(text) {
    const query = encodeURIComponent(String(text || '').trim());
    if (!query)
        return [];
    const response = await apiRequest('GET', `/collections/covers/${query}`);
    const urls = [];
    for (const provider of response.items || []) {
        for (const icon of provider.icons || []) {
            if (icon.png)
                urls.push(icon.png);
        }
    }
    return urls;
}
// ==================== Raindrops API ====================
async function getRaindrops(collectionId, page = 0, perPage = 50) {
    const response = await apiRequest('GET', `/raindrops/${collectionId}?page=${page}&perpage=${perPage}`);
    if (!response.result) {
        throw new Error(`Failed to get raindrops for collection ${collectionId}`);
    }
    return response.items;
}
async function getAllRaindropsInCollection(collectionId) {
    const allRaindrops = [];
    let page = 0;
    const perPage = 50;
    while (true) {
        const raindrops = await getRaindrops(collectionId, page, perPage);
        allRaindrops.push(...raindrops);
        if (raindrops.length < perPage) {
            break;
        }
        page++;
    }
    return allRaindrops;
}
async function getRaindrop(id) {
    const response = await apiRequest('GET', `/raindrop/${id}`);
    if (!response.result || !response.item) {
        throw new Error(`Failed to get raindrop ${id}`);
    }
    return response.item;
}
async function createRaindrop(data) {
    const response = await apiRequest('POST', '/raindrop', data);
    if (!response.result || !response.item) {
        throw new Error('Failed to create raindrop');
    }
    return response.item;
}
async function createRaindrops(items) {
    if (items.length === 0)
        return [];
    // Raindrop API allows max 100 items per bulk request
    const CHUNK_SIZE = 100;
    const results = [];
    for (let i = 0; i < items.length; i += CHUNK_SIZE) {
        const chunk = items.slice(i, i + CHUNK_SIZE);
        const response = await apiRequest('POST', '/raindrops', { items: chunk });
        if (response.result && response.items) {
            results.push(...response.items);
        }
        else {
            _utils_logger__WEBPACK_IMPORTED_MODULE_1__/* .logger */ .v.error('Bulk create partially failed', response);
        }
    }
    return results;
}
async function updateRaindrop(id, data) {
    const response = await apiRequest('PUT', `/raindrop/${id}`, data);
    if (!response.result || !response.item) {
        throw new Error(`Failed to update raindrop ${id}`);
    }
    return response.item;
}
async function deleteRaindrop(id) {
    const response = await apiRequest('DELETE', `/raindrop/${id}`);
    if (!response.result) {
        throw new Error(`Failed to delete raindrop ${id}`);
    }
}
async function getCurrentUser() {
    const response = await apiRequest('GET', '/user');
    if (!response.result || !response.user) {
        throw new Error('Failed to get current user');
    }
    return response.user;
}
// ==================== Auth ====================
async function logout() {
    await (0,_storage__WEBPACK_IMPORTED_MODULE_0__/* .clearApiToken */ .hB)();
    _utils_logger__WEBPACK_IMPORTED_MODULE_1__/* .logger */ .v.info('Logged out from Raindrop.io');
}


/***/ },

/***/ 105
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  sB: () => (/* binding */ addBookmarkLink),
  addFolderMapping: () => (/* binding */ addFolderMapping),
  hB: () => (/* binding */ clearApiToken),
  disableAutoSyncIfNoMappings: () => (/* binding */ disableAutoSyncIfNoMappings),
  exportData: () => (/* binding */ exportData),
  cM: () => (/* binding */ findBookmarkLink),
  rW: () => (/* binding */ findMappingByFirefoxId),
  _$: () => (/* binding */ getApiToken),
  w5: () => (/* binding */ getBookmarkLinks),
  getFolderMappings: () => (/* binding */ getFolderMappings),
  mt: () => (/* binding */ getSettings),
  getSyncErrors: () => (/* binding */ getSyncErrors),
  getSyncStats: () => (/* binding */ getSyncStats),
  wR: () => (/* binding */ isAuthenticated),
  jH: () => (/* binding */ removeBookmarkLink),
  removeFolderMapping: () => (/* binding */ removeFolderMapping),
  G2: () => (/* binding */ resetLocalState),
  D$: () => (/* binding */ saveApiToken),
  V_: () => (/* binding */ saveBookmarkLinks),
  R9: () => (/* binding */ setSyncErrors),
  Ok: () => (/* binding */ updateBookmarkLink),
  uz: () => (/* binding */ updateFolderMapping),
  updateSettings: () => (/* binding */ updateSettings),
  ml: () => (/* binding */ updateSyncStats)
});

// UNUSED EXPORTS: clearAllData, findBookmarkLinkByUrl, findMappingByRaindropId, getBookmarkLinksForMapping, importData, removeBookmarkLinksForMapping, saveFolderMappings, saveSettings

// EXTERNAL MODULE: ./node_modules/webextension-polyfill/dist/browser-polyfill.js
var browser_polyfill = __webpack_require__(815);
var browser_polyfill_default = /*#__PURE__*/__webpack_require__.n(browser_polyfill);
;// ./src/types/storage.ts
// Storage Types for the extension
// Storage keys
const STORAGE_KEYS = {
    API_TOKEN: 'api_token',
    SYNC_SETTINGS: 'sync_settings',
    FOLDER_MAPPINGS: 'folder_mappings',
    BOOKMARK_LINKS: 'bookmark_links',
    SYNC_STATS: 'sync_stats',
    SYNC_ERRORS: 'sync_errors',
};
// Default values
const DEFAULT_SYNC_SETTINGS = {
    enabled: false,
    syncInterval: 5,
    lastFullSync: 0,
    debugMode: false,
    // The authoritative side is consulted only when both sides disagree.
    // Keeping Raindrop as the default preserves the behavior of earlier builds.
    authority: 'raindrop',
};
const DEFAULT_SYNC_STATS = {
    totalSynced: 0,
    lastSyncTime: 0,
    lastSyncStatus: 'never',
};

// EXTERNAL MODULE: ./src/utils/logger.ts
var logger = __webpack_require__(628);
;// ./src/background/storage.ts
/* unused harmony import specifier */ var browser;
/* unused harmony import specifier */ var storage_logger;
// Storage Manager for the extension



// ==================== Storage Lock (Task Queue) ====================
/**
 * Simple task queue to ensure atomic storage operations
 */
class StorageLock {
    constructor() {
        this.queue = Promise.resolve();
    }
    async run(task) {
        const result = this.queue.then(task);
        this.queue = result.catch(() => { });
        return result;
    }
}
const storageLock = new StorageLock();
// ==================== API Token ====================
async function saveApiToken(token) {
    try {
        const data = { testToken: token };
        await browser_polyfill_default().storage.local.set({
            [STORAGE_KEYS.API_TOKEN]: data,
        });
        logger/* logger */.v.debug('API token saved successfully');
    }
    catch (error) {
        logger/* logger */.v.error('Failed to save API token', error);
        throw error;
    }
}
async function getApiToken() {
    try {
        const result = await browser_polyfill_default().storage.local.get(STORAGE_KEYS.API_TOKEN);
        const data = result[STORAGE_KEYS.API_TOKEN];
        return data?.testToken || null;
    }
    catch (error) {
        logger/* logger */.v.error('Failed to get API token', error);
        return null;
    }
}
/**
 * Disconnect = blank slate. Wipes ALL extension-owned local storage — token,
 * mappings, bookmark links, settings, queue, stats, and the transient queue
 * lock — so a disconnect is a full teardown of the extension's state (task
 * 011). The user's real data is untouched: browser bookmark folders and
 * Raindrop collections live outside `storage.local` and are the user's
 * responsibility, consistent with the "remove mapping ≠ delete data" model.
 *
 * Callers must quiesce background writers first (stop the queue processor,
 * unregister listeners, clear alarms) — that is what actually prevents a key
 * being resurrected after the clear, since most mutators write storage.local
 * directly rather than through this lock. The storageLock.run wrapper only
 * orders this against the link/queue mutators that do use it.
 */
async function resetLocalState() {
    await storageLock.run(async () => {
        await browser_polyfill_default().storage.local.clear();
        logger/* logger */.v.info('Extension local state reset (disconnect)');
    });
}
async function clearApiToken() {
    try {
        await browser_polyfill_default().storage.local.remove(STORAGE_KEYS.API_TOKEN);
        logger/* logger */.v.debug('API token cleared successfully');
    }
    catch (error) {
        logger/* logger */.v.error('Failed to clear API token', error);
        throw error;
    }
}
async function isAuthenticated() {
    const token = await getApiToken();
    return !!token;
}
// ==================== Sync Settings ====================
async function saveSettings(settings) {
    try {
        await browser_polyfill_default().storage.local.set({
            [STORAGE_KEYS.SYNC_SETTINGS]: settings,
        });
        logger/* logger */.v.debug('Settings saved successfully');
    }
    catch (error) {
        logger/* logger */.v.error('Failed to save settings', error);
        throw error;
    }
}
async function getSettings() {
    try {
        const result = await browser_polyfill_default().storage.local.get(STORAGE_KEYS.SYNC_SETTINGS);
        return result[STORAGE_KEYS.SYNC_SETTINGS] || DEFAULT_SYNC_SETTINGS;
    }
    catch (error) {
        logger/* logger */.v.error('Failed to get settings', error);
        return { ...DEFAULT_SYNC_SETTINGS };
    }
}
async function updateSettings(updates) {
    const current = await getSettings();
    const updated = { ...current, ...updates };
    await saveSettings(updated);
    return updated;
}
// ==================== Folder Mappings ====================
async function saveFolderMappings(mappings) {
    try {
        await browser_polyfill_default().storage.local.set({
            [STORAGE_KEYS.FOLDER_MAPPINGS]: mappings,
        });
        logger/* logger */.v.debug('Folder mappings saved', { count: mappings.length });
    }
    catch (error) {
        logger/* logger */.v.error('Failed to save folder mappings', error);
        throw error;
    }
}
async function getFolderMappings() {
    try {
        const result = await browser_polyfill_default().storage.local.get(STORAGE_KEYS.FOLDER_MAPPINGS);
        return result[STORAGE_KEYS.FOLDER_MAPPINGS] || [];
    }
    catch (error) {
        logger/* logger */.v.error('Failed to get folder mappings', error);
        return [];
    }
}
/**
 * With no folder mappings there is nothing to sync, so auto-sync must not stay
 * on (task 012 — "no mapping, no sync"). Called after a mapping is removed:
 * when the last one is gone, force `enabled` off. Returns true only when it
 * actually flipped enabled from on to off, so the caller can tear down the
 * auto-sync services. No-op when a mapping still exists or sync is already off.
 */
async function disableAutoSyncIfNoMappings() {
    const mappings = await getFolderMappings();
    if (mappings.length > 0)
        return false;
    const settings = await getSettings();
    if (!settings.enabled)
        return false;
    await updateSettings({ enabled: false });
    logger/* logger */.v.info('No folder mappings left — auto-sync disabled');
    return true;
}
async function addFolderMapping(mapping) {
    const mappings = await getFolderMappings();
    // Check for duplicates
    const exists = mappings.find((m) => m.firefoxFolderId === mapping.firefoxFolderId ||
        m.raindropCollectionId === mapping.raindropCollectionId);
    if (exists) {
        throw new Error('Mapping already exists for this folder or collection');
    }
    mappings.push(mapping);
    await saveFolderMappings(mappings);
    return mappings;
}
async function removeFolderMapping(mappingId) {
    const mappings = await getFolderMappings();
    // Find mapping to be removed and its children (recursively if needed, though depth 1 is common)
    const idsToRemove = new Set([mappingId]);
    // One pass for children is enough for depth 1, but let's be more robust
    let added;
    do {
        added = false;
        for (const m of mappings) {
            if (m.parentMappingId && idsToRemove.has(m.parentMappingId) && !idsToRemove.has(m.id)) {
                idsToRemove.add(m.id);
                added = true;
            }
        }
    } while (added);
    const filtered = mappings.filter((m) => !idsToRemove.has(m.id));
    await saveFolderMappings(filtered);
    // Also remove associated bookmark links for ALL removed mappings
    const links = await getBookmarkLinks();
    const filteredLinks = links.filter((l) => !idsToRemove.has(l.mappingId));
    await saveBookmarkLinks(filteredLinks);
    logger/* logger */.v.info('Removed folder mapping(s) and associated links', {
        removedMappings: idsToRemove.size,
        removedLinks: links.length - filteredLinks.length
    });
}
async function updateFolderMapping(mappingId, updates) {
    const mappings = await getFolderMappings();
    const index = mappings.findIndex((m) => m.id === mappingId);
    if (index === -1)
        return null;
    mappings[index] = { ...mappings[index], ...updates };
    await saveFolderMappings(mappings);
    return mappings[index];
}
async function findMappingByFirefoxId(firefoxFolderId) {
    const mappings = await getFolderMappings();
    return mappings.find((m) => m.firefoxFolderId === firefoxFolderId) || null;
}
async function findMappingByRaindropId(raindropCollectionId) {
    const mappings = await getFolderMappings();
    return (mappings.find((m) => m.raindropCollectionId === raindropCollectionId) ||
        null);
}
// ==================== Bookmark Links ====================
// Internal save — no lock, used by functions that already hold storageLock
async function _saveBookmarkLinks(links) {
    try {
        await browser_polyfill_default().storage.local.set({
            [STORAGE_KEYS.BOOKMARK_LINKS]: links,
        });
        logger/* logger */.v.debug('Bookmark links saved', { count: links.length });
    }
    catch (error) {
        logger/* logger */.v.error('Failed to save bookmark links', error);
        throw error;
    }
}
// External save — acquires lock, safe for callers outside storageLock
async function saveBookmarkLinks(links) {
    return storageLock.run(() => _saveBookmarkLinks(links));
}
async function getBookmarkLinks() {
    try {
        const result = await browser_polyfill_default().storage.local.get(STORAGE_KEYS.BOOKMARK_LINKS);
        return result[STORAGE_KEYS.BOOKMARK_LINKS] || [];
    }
    catch (error) {
        logger/* logger */.v.error('Failed to get bookmark links', error);
        return [];
    }
}
async function addBookmarkLink(link) {
    return storageLock.run(async () => {
        const links = await getBookmarkLinks();
        // Check if link already exists to avoid duplicates
        // Each Firefox ID and each Raindrop ID should have at most one link
        const exists = links.some((l) => l.firefoxId === link.firefoxId || l.raindropId === link.raindropId);
        if (!exists) {
            links.push(link);
            await _saveBookmarkLinks(links);
        }
        else {
            logger/* logger */.v.debug('Bookmark link already exists for this ID, skipping', {
                firefoxId: link.firefoxId,
                raindropId: link.raindropId,
            });
        }
    });
}
async function updateBookmarkLink(linkId, updates) {
    return storageLock.run(async () => {
        const links = await getBookmarkLinks();
        const index = links.findIndex((l) => l.id === linkId);
        if (index === -1)
            return null;
        links[index] = { ...links[index], ...updates };
        await _saveBookmarkLinks(links);
        return links[index];
    });
}
async function removeBookmarkLink(linkId) {
    return storageLock.run(async () => {
        const links = await getBookmarkLinks();
        const filtered = links.filter((l) => l.id !== linkId);
        await _saveBookmarkLinks(filtered);
    });
}
async function removeBookmarkLinksForMapping(mappingId) {
    return storageLock.run(async () => {
        const links = await getBookmarkLinks();
        const filtered = links.filter((l) => l.mappingId !== mappingId);
        if (filtered.length !== links.length) {
            await _saveBookmarkLinks(filtered);
        }
    });
}
async function findBookmarkLink(firefoxId, raindropId) {
    const links = await getBookmarkLinks();
    if (firefoxId) {
        const byFirefox = links.find((l) => l.firefoxId === firefoxId);
        if (byFirefox)
            return byFirefox;
    }
    if (raindropId) {
        const byRaindrop = links.find((l) => l.raindropId === raindropId);
        if (byRaindrop)
            return byRaindrop;
    }
    return null;
}
async function findBookmarkLinkByUrl(url) {
    const links = await getBookmarkLinks();
    return links.find((l) => l.url === url) || null;
}
async function getBookmarkLinksForMapping(mappingId) {
    const links = await getBookmarkLinks();
    return links.filter((l) => l.mappingId === mappingId);
}
// ==================== Sync Stats ====================
async function getSyncStats() {
    try {
        const result = await browser_polyfill_default().storage.local.get([
            STORAGE_KEYS.SYNC_STATS,
            STORAGE_KEYS.BOOKMARK_LINKS,
        ]);
        const stats = result[STORAGE_KEYS.SYNC_STATS] || {
            ...DEFAULT_SYNC_STATS,
        };
        const links = result[STORAGE_KEYS.BOOKMARK_LINKS] || [];
        // Always return actual links count
        return {
            ...stats,
            totalSynced: links.length,
        };
    }
    catch (error) {
        logger/* logger */.v.error('Failed to get sync stats', error);
        return { ...DEFAULT_SYNC_STATS };
    }
}
async function updateSyncStats(updates) {
    const current = await getSyncStats();
    const updated = { ...current, ...updates };
    try {
        await browser_polyfill_default().storage.local.set({
            [STORAGE_KEYS.SYNC_STATS]: updated,
        });
        return updated;
    }
    catch (error) {
        logger/* logger */.v.error('Failed to update sync stats', error);
        throw error;
    }
}
// ==================== Sync Errors (inline, task 015) ====================
// The errors from the LAST reconcile pass, replaced wholesale on every pass
// (clean pass → []). The Options page renders each entry inline next to the
// mapping it happened under. Capped so a pathological pass can't bloat storage.
const MAX_SYNC_ERRORS = 50;
async function getSyncErrors() {
    try {
        const result = await browser_polyfill_default().storage.local.get(STORAGE_KEYS.SYNC_ERRORS);
        return result[STORAGE_KEYS.SYNC_ERRORS] || [];
    }
    catch (error) {
        logger/* logger */.v.error('Failed to get sync errors', error);
        return [];
    }
}
async function setSyncErrors(errors) {
    try {
        await browser_polyfill_default().storage.local.set({
            [STORAGE_KEYS.SYNC_ERRORS]: errors.slice(0, MAX_SYNC_ERRORS),
        });
    }
    catch (error) {
        logger/* logger */.v.error('Failed to set sync errors', error);
    }
}
// ==================== Utility Functions ====================
async function clearAllData() {
    try {
        await browser.storage.local.clear();
        storage_logger.info('All storage data cleared');
    }
    catch (error) {
        storage_logger.error('Failed to clear all data', error);
        throw error;
    }
}
async function exportData() {
    try {
        const data = await browser_polyfill_default().storage.local.get(null);
        // Remove sensitive data
        delete data[STORAGE_KEYS.API_TOKEN];
        return data;
    }
    catch (error) {
        logger/* logger */.v.error('Failed to export data', error);
        throw error;
    }
}
async function importData(data) {
    try {
        await browser.storage.local.set(data);
        storage_logger.info('Data imported successfully');
    }
    catch (error) {
        storage_logger.error('Failed to import data', error);
        throw error;
    }
}


/***/ },

/***/ 554
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  zE: () => (/* binding */ clearCachedUser),
  KZ: () => (/* binding */ getSyncStatus),
  tm: () => (/* binding */ handleSyncAlarm),
  Hd: () => (/* binding */ performFullResync),
  Zo: () => (/* binding */ performInitialSync),
  reconcileAllMappings: () => (/* binding */ reconcileAllMappings),
  U9: () => (/* binding */ setupPeriodicSync),
  vr: () => (/* binding */ syncFolderWithChildren)
});

// UNUSED EXPORTS: propagateBrowserFolderDeletions, propagateRaindropCollectionDeletions, reconcileFolderTree

// EXTERNAL MODULE: ./src/background/storage.ts + 1 modules
var storage = __webpack_require__(105);
// EXTERNAL MODULE: ./src/background/raindropApi.ts
var raindropApi = __webpack_require__(908);
// EXTERNAL MODULE: ./src/background/bookmarkListeners.ts
var bookmarkListeners = __webpack_require__(356);
// EXTERNAL MODULE: ./node_modules/webextension-polyfill/dist/browser-polyfill.js
var browser_polyfill = __webpack_require__(815);
var browser_polyfill_default = /*#__PURE__*/__webpack_require__.n(browser_polyfill);
// EXTERNAL MODULE: ./src/utils/logger.ts
var logger = __webpack_require__(628);
// EXTERNAL MODULE: ./src/utils/hash.ts
var hash = __webpack_require__(760);
// EXTERNAL MODULE: ./src/utils/bookmarkNode.ts
var bookmarkNode = __webpack_require__(168);
;// ./src/background/reconcile.ts
// Three-way reconcile decisions (task 014). Pure — no IO, no browser API.
//
// baseline = what both sides looked like after the last successful sync:
//   bookmark → BookmarkLink.contentHash + BookmarkLink.mappingId
//   folder   → FolderMapping.folderName
// Each side is compared against the baseline; the side that changed wins its
// direction. Both changed → conflict → Raindrop wins. No baseline is handled
// by the caller (create/adopt, never delete).
// Conflict strategies (per mapping, see resolveStrategy):
//   'skip'     — keep both sides untouched and report the conflict
//   'chrome'   — Chrome wins a conflict
//   'raindrop' — Raindrop wins a conflict
//   'newest'   — the side modified most recently wins
// Only CONFLICTS (both sides changed, or edit-vs-delete) consult the strategy;
// a one-sided change always propagates.
const CONFLICT_STRATEGIES = ['skip', 'chrome', 'raindrop', 'newest'];
function normalizeStrategy(value) {
    return CONFLICT_STRATEGIES.includes(value) ? value : 'raindrop';
}
// base: { bHash, rHash, mappingId } (bHash/rHash may differ after a
// "keep both" adoption); sides: { hash, mappingId, time } or null.
// times: { browserDeletedAt } — optional.
function decideBookmarkAction(base, browserSide, raindropSide, strategy = 'raindrop', times = {}) {
    strategy = normalizeStrategy(strategy);
    const bChanged = (s) => s.hash !== base.bHash || s.mappingId !== base.mappingId;
    const rChanged = (s) => s.hash !== base.rHash || s.mappingId !== base.mappingId;
    if (browserSide && raindropSide) {
        const b = bChanged(browserSide);
        const r = rChanged(raindropSide);
        if (!b && !r)
            return 'none';
        // Both sides already agree (e.g. the same edit made twice, or a
        // conflict the user resolved by hand) — just move the baseline.
        if (browserSide.hash === raindropSide.hash && browserSide.mappingId === raindropSide.mappingId)
            return 'rebaseline';
        if (b && !r)
            return 'push-update';
        if (!b && r)
            return 'pull-update';
        switch (strategy) {
            case 'chrome': return 'push-update';
            case 'raindrop': return 'pull-update';
            case 'newest':
                return (browserSide.time || 0) > (raindropSide.time || 0) ? 'push-update' : 'pull-update';
            default: return 'conflict';
        }
    }
    if (!browserSide && raindropSide) {
        if (!rChanged(raindropSide))
            return 'delete-in-raindrop'; // plain deletion in Chrome
        // Deleted in Chrome, edited in Raindrop.
        switch (strategy) {
            case 'chrome': return 'delete-in-raindrop';
            case 'raindrop': return 'pull-update';
            case 'newest':
                return times.browserDeletedAt && times.browserDeletedAt > (raindropSide.time || 0)
                    ? 'delete-in-raindrop'
                    : 'pull-update';
            default: return 'conflict';
        }
    }
    if (browserSide && !raindropSide) {
        if (!bChanged(browserSide))
            return 'delete-in-browser'; // plain deletion in Raindrop
        // Deleted in Raindrop, edited in Chrome. Raindrop exposes no deletion
        // time, so "newest" keeps the edit (the non-destructive choice).
        switch (strategy) {
            case 'raindrop': return 'delete-in-browser';
            case 'chrome':
            case 'newest': return 'recreate-in-raindrop';
            default: return 'conflict';
        }
    }
    return 'drop-link';
}
// Name comparison for folder<->collection sync: case-insensitive, trimmed.
// Case/whitespace drift is not a rename.
function namesMatch(a, b) {
    return a.trim().toLowerCase() === b.trim().toLowerCase();
}
function decideRenameAction(baseName, browserName, raindropName, strategy = 'raindrop', times = {}) {
    strategy = normalizeStrategy(strategy);
    const browserChanged = !namesMatch(browserName, baseName);
    const raindropChanged = !namesMatch(raindropName, baseName);
    if (browserChanged && raindropChanged) {
        if (namesMatch(browserName, raindropName))
            return 'none';
        switch (strategy) {
            case 'chrome': return 'push-rename';
            case 'raindrop': return 'pull-rename';
            case 'newest':
                return (times.browser || 0) > (times.raindrop || 0) ? 'push-rename' : 'pull-rename';
            default: return 'conflict';
        }
    }
    if (raindropChanged)
        return 'pull-rename';
    if (browserChanged)
        return 'push-rename';
    return 'none';
}

;// ./src/utils/collections.ts
// Pure helpers over the Raindrop collections cache.
/**
 * Direct child collections of `collectionId` from a prefetched cache
 * (task 001). Root collections have `parent: null` and are never
 * anyone's children.
 */
function getChildCollectionsOf(collectionId, cache) {
    return cache.filter((c) => c.parent?.$id === collectionId);
}

;// ./src/background/syncManager.ts
// Sync Manager - Core synchronization logic









// Since task 014 this is a thin wrapper over the unified three-way reconcile:
// build/refresh the folder↔collection subtree, then run one global reconcile
// pass. With no baseline (fresh mapping) the engine unions both sides by
// construction — same semantics the old initialSyncForMapping implemented by
// hand, minus its duplicate-creation races (task 013).
async function performInitialSync(mapping) {
    logger/* logger */.v.info(`Starting initial sync for folder: ${mapping.folderName}`);
    // The subtree walk repeats inside reconcileAllMappings — accepted double
    // work on this rare path; the wrapper needs the subtree for foldersSynced.
    // One setSyncing envelope over both (the depth counter nests) so no
    // bookmark event slips through between the tree walk and the engine pass.
    const collectionsCache = await (0,raindropApi/* getAllCollections */.R9)();
    (0,bookmarkListeners/* setSyncing */.sV)(true);
    let subtree;
    let r;
    try {
        subtree = await reconcileFolderTree(mapping, collectionsCache);
        r = await reconcileAllMappings();
    }
    finally {
        (0,bookmarkListeners/* setSyncing */.sV)(false);
    }
    const result = {
        matched: r.adopted,
        createdInRaindrop: r.createdInRaindrop,
        createdInFirefox: r.createdInBrowser,
        foldersSynced: subtree.length,
        errors: r.errors,
    };
    logger/* logger */.v.info('Initial sync completed', result);
    return result;
}
// ==================== Deletion Propagation (task 010) ====================
// Distinguish a genuine "bookmark does not exist" rejection from a transient
// error, so deletion catch-up can fail closed (task 006). Messages differ per
// browser: Firefox "Bookmark not found"; Chrome "Can't find bookmark for id.".
// A Raindrop API error carrying HTTP 404 — the collection genuinely does not
// exist (deleted). apiRequest attaches `.status` to the thrown error. Used to
// confirm a deletion before acting, so an incomplete collections list or a
// transient/network error never triggers a destructive folder removal.
function isCollectionNotFoundError(error) {
    return (typeof error === 'object' &&
        error !== null &&
        error.status === 404);
}
function isBookmarkNotFoundError(error) {
    const msg = (error instanceof Error ? error.message : String(error)).toLowerCase();
    // Must be specifically about a bookmark — guarding a destructive delete, so
    // a generic "... not found" (e.g. "Bookmarks database not found") must miss.
    return (/\bbookmark not found\b/.test(msg) || // Firefox
        /can'?t find bookmark/.test(msg) || // Chrome: "Can't find bookmark for id."
        /cannot find bookmark/.test(msg) ||
        /no bookmark (?:with )?id/.test(msg));
}
/**
 * Propagate browser folder deletions to Raindrop (task 010, direction A).
 *
 * Bidirectional-delete model (iCloud/GDrive): a mapped browser folder that was
 * deleted must delete its Raindrop collection too, then drop the mapping.
 * `deleteCollection` cascades server-side — child collections are removed and
 * their raindrops go to Trash (verified against the API), so one call handles a
 * whole subtree. Running BEFORE reconcile (and re-fetching the collections
 * cache after) means the deleted collection is gone from the cache, so reconcile
 * never resurrects the folder.
 *
 * Fail-closed like the per-bookmark deletion catch-up: only a *confirmed*
 * "bookmark not found" triggers deletion. A transient error (network, etc.) is
 * treated as "folder still there" so a flaky read never destroys data.
 *
 * Supersedes task 008's prune, which kept the collection (that produced the
 * "deleted nested folder keeps coming back" bug — reconcile re-created it from
 * the surviving collection).
 *
 * Returns the ids of the removed mappings.
 */
async function propagateBrowserFolderDeletions() {
    const mappings = await (0,storage.getFolderMappings)();
    const removedIds = [];
    for (const mapping of mappings) {
        try {
            // Fail-closed: act ONLY on a confirmed "bookmark not found". If get
            // resolves (with anything) the folder exists — keep. A transient error
            // (network, etc.) must never destroy data, so we swallow only the
            // specific not-found rejection and treat everything else as "keep".
            await browser_polyfill_default().bookmarks.get(mapping.firefoxFolderId);
            continue; // folder exists → keep
        }
        catch (error) {
            if (!isBookmarkNotFoundError(error)) {
                logger/* logger */.v.warn(`Skipping "${mapping.folderName}" — folder check failed with a non-not-found error`, error);
                continue;
            }
        }
        // Confirmed: the folder no longer exists in the browser → propagate delete.
        logger/* logger */.v.info(`Folder for mapping "${mapping.folderName}" (${mapping.firefoxFolderId}) was deleted in the browser — deleting Raindrop collection ${mapping.raindropCollectionId} (cascades children; raindrops → Trash) and dropping the mapping`);
        let collectionGone = false;
        try {
            await (0,raindropApi/* deleteCollection */.o4)(mapping.raindropCollectionId);
            collectionGone = true;
        }
        catch (error) {
            if (isCollectionNotFoundError(error)) {
                // Already gone (cascaded by an ancestor deleted earlier this pass).
                collectionGone = true;
            }
            else {
                // Transient/network failure — do NOT drop the mapping, or the
                // collection would be orphaned in Raindrop with no retry path. Keep it
                // and retry on the next sync. The mapping meanwhile points at a folder
                // that no longer exists; reconcile skips such a mapping (it does not
                // resurrect), so no duplicate is created before the retry succeeds.
                logger/* logger */.v.warn(`deleteCollection(${mapping.raindropCollectionId}) failed transiently for "${mapping.folderName}" — keeping mapping to retry`, error);
            }
        }
        if (!collectionGone)
            continue;
        try {
            // Cascades to child mappings + drops all associated bookmark links.
            await (0,storage.removeFolderMapping)(mapping.id);
            removedIds.push(mapping.id);
        }
        catch (error) {
            // One removal failing must not abort the whole sync.
            logger/* logger */.v.error(`Failed to drop mapping "${mapping.folderName}"`, error);
        }
    }
    return removedIds;
}
/**
 * Propagate Raindrop collection deletions to the browser (task 010, direction B).
 *
 * The other half of bidirectional delete: a collection deleted on the server
 * removes the mapped browser folder (removeTree cascades child folders) and
 * drops the mapping (+ child mappings + links). Takes the already-fetched
 * collections cache so it shares one API read with the caller and can trust it.
 *
 * Fail-closed (data-loss guard): an EMPTY cache is never acted on. A folder
 * moved elsewhere keeps the same collection id, so only a truly absent id counts
 * as deleted. Must run inside setSyncing() — removeTree fires onRemoved events.
 *
 * Returns the ids of the removed mappings.
 */
async function propagateRaindropCollectionDeletions(collectionsCache) {
    const removedIds = [];
    // Too dangerous to act on an empty list — a transient wipe would mass-delete
    // every synced folder. getAllCollections throws on fetch failure, but the
    // blast radius of a false "empty" isn't worth it.
    if (collectionsCache.length === 0) {
        logger/* logger */.v.warn('Skipping Raindrop-side deletion propagation — empty collections cache');
        return removedIds;
    }
    const liveIds = new Set(collectionsCache.map((c) => c._id));
    const mappings = await (0,storage.getFolderMappings)();
    for (const mapping of mappings) {
        if (liveIds.has(mapping.raindropCollectionId))
            continue; // collection alive
        // Absent from the cache is NOT proof of deletion — the list could be
        // incomplete (deep nesting, an API quirk). Before destroying a browser
        // folder, CONFIRM the collection is really gone with a direct fetch: a
        // successful fetch means the cache was incomplete → keep; only a 404
        // (confirmed deleted) proceeds; a transient error keeps it (fail-closed).
        try {
            await (0,raindropApi/* getCollection */.X_)(mapping.raindropCollectionId);
            continue; // collection actually exists → cache was incomplete → keep
        }
        catch (error) {
            if (!isCollectionNotFoundError(error)) {
                logger/* logger */.v.warn(`Keeping "${mapping.folderName}" — collection ${mapping.raindropCollectionId} existence check failed (non-404), not treating as deleted`, error);
                continue;
            }
        }
        logger/* logger */.v.info(`Collection ${mapping.raindropCollectionId} ("${mapping.raindropCollectionName}") was deleted in Raindrop — removing browser folder ${mapping.firefoxFolderId} and dropping the mapping`);
        try {
            // Cascades to child folders in the browser.
            await browser_polyfill_default().bookmarks.removeTree(mapping.firefoxFolderId);
        }
        catch (error) {
            // Folder may already be gone (cascaded with a parent removed earlier this
            // pass, or deleted by the user) — tolerate and still drop the mapping.
            logger/* logger */.v.warn(`removeTree(${mapping.firefoxFolderId}) failed (may already be gone) for "${mapping.folderName}"`, error);
        }
        try {
            await (0,storage.removeFolderMapping)(mapping.id);
            removedIds.push(mapping.id);
        }
        catch (error) {
            logger/* logger */.v.error(`Failed to drop mapping "${mapping.folderName}"`, error);
        }
    }
    return removedIds;
}
// ==================== Per-mapping options ====================
// Child mappings created by the recursive tree walk don't store their own
// options — they inherit from their root, so changing the root's strategy in
// the Options table applies to the whole subtree at once.
function rootMappingOf(mapping, mappingById) {
    let current = mapping;
    for (let i = 0; i < 64 && current && current.parentMappingId; i++) {
        const parent = mappingById.get(current.parentMappingId);
        if (!parent)
            break;
        current = parent;
    }
    return current;
}
function resolveStrategy(mapping, mappingById, fallback) {
    const root = mapping ? rootMappingOf(mapping, mappingById) : null;
    return normalizeStrategy(root?.conflictStrategy ?? fallback);
}
function includesSubfolders(mapping, mappingById) {
    const root = rootMappingOf(mapping, mappingById);
    return root?.includeSubfolders !== false;
}
async function readBrowserMtimes() {
    try {
        const result = await browser_polyfill_default().storage.local.get('browser_mtimes');
        return result.browser_mtimes || {};
    }
    catch {
        return {};
    }
}
function parseRaindropTime(value) {
    const t = Date.parse(value || '');
    return Number.isFinite(t) ? t : 0;
}
// Folder rename conflicts skipped during reconcileFolderTree, surfaced in the
// error panel by the surrounding reconcileAllMappings pass.
let pendingFolderConflicts = [];
// ==================== Unified Three-Way Reconcile (task 014) ====================
// Stale-tolerant storage lock: only one reconcile at a time, surviving MV3 SW
// restarts (same pattern the old queue used).
const RECONCILE_LOCK_KEY = 'reconcile_lock';
const RECONCILE_LOCK_TIMEOUT = 5 * 60 * 1000;
async function acquireReconcileLock() {
    const result = await browser_polyfill_default().storage.local.get(RECONCILE_LOCK_KEY);
    const lock = result[RECONCILE_LOCK_KEY];
    if (lock && Date.now() - lock.timestamp < RECONCILE_LOCK_TIMEOUT)
        return false;
    await browser_polyfill_default().storage.local.set({
        [RECONCILE_LOCK_KEY]: { timestamp: Date.now() },
    });
    return true;
}
async function releaseReconcileLock() {
    await browser_polyfill_default().storage.local.remove(RECONCILE_LOCK_KEY);
}
// One shape for every link the reconcile creates — keeps the BookmarkLink
// schema in a single place across the adopt/create paths.
function buildLink(firefoxId, raindropId, url, title, contentHash, mappingId) {
    return {
        id: (0,hash/* generateId */.$C)(),
        firefoxId,
        raindropId,
        url,
        title,
        lastModified: Date.now(),
        contentHash,
        syncStatus: 'synced',
        mappingId,
    };
}
// NOTE: no `settings.enabled` guard here — the toggle gates only the
// AUTOMATIC triggers (periodic alarm in handleSyncAlarm, event-driven path).
// Manual "Sync Now" / "Full Resync" call this directly and must run
// regardless (task 007).
async function reconcileAllMappings() {
    const result = {
        pushed: 0,
        pulled: 0,
        createdInRaindrop: 0,
        createdInBrowser: 0,
        adopted: 0,
        deletedInRaindrop: 0,
        deletedInBrowser: 0,
        errors: [],
    };
    if (!(await acquireReconcileLock())) {
        logger/* logger */.v.debug('Reconcile already in progress (lock held), skipping');
        return result;
    }
    // Structured errors for the UI (task 015): same messages as result.errors,
    // plus a short `type` (which operation failed) so the Options panel can show
    // "type — message". Persisted (replace-all) at pass end, so a clean pass
    // clears them and a re-run reflects only the current state.
    const errorEntries = [];
    // Read once per pass: every conflict in this reconciliation uses the same
    // user-selected authority even if the settings page changes mid-pass.
    const { authority = 'raindrop' } = await (0,storage/* getSettings */.mt)();
    const recordError = (type, message) => {
        result.errors.push(message);
        errorEntries.push({ type, message });
    };
    (0,bookmarkListeners/* setSyncing */.sV)(true);
    try {
        // Structural passes first — identical order to the old push/pull preamble.
        await propagateBrowserFolderDeletions();
        if ((await (0,storage.getFolderMappings)()).length === 0) {
            await (0,storage/* setSyncErrors */.R9)([]);
            return result;
        }
        const collectionsCache = await (0,raindropApi/* getAllCollections */.R9)();
        await propagateRaindropCollectionDeletions(collectionsCache);
        pendingFolderConflicts = []; // re-detected by the tree walk below
        for (const root of (await (0,storage.getFolderMappings)()).filter((m) => m.depth === 0)) {
            try {
                await reconcileFolderTree(root, collectionsCache);
            }
            catch (error) {
                const msg = `Failed to reconcile folder tree for ${root.folderName}: ${error}`;
                recordError('folder', msg);
                logger/* logger */.v.error(msg);
            }
        }
        for (const msg of pendingFolderConflicts)
            recordError('conflict', msg);
        pendingFolderConflicts = [];
        const allMappings = await (0,storage.getFolderMappings)();
        const mappingById = new Map(allMappings.map((m) => [m.id, m]));
        const strategyOf = (mappingId) => resolveStrategy(mappingById.get(mappingId), mappingById, authority);
        const mtimes = await readBrowserMtimes();
        const browserTime = (node) => mtimes[node.id] || node.dateAdded || 0;
        const existingCollectionIds = new Set(collectionsCache.map((c) => c._id));
        // ---- Snapshot both sides globally (cross-mapping move detection) ----
        // A mapping whose side could not be read is UNAVAILABLE: its links are
        // skipped entirely, so a failed read never looks like "everything deleted"
        // (deletion-safety guard, parity with task 001).
        const unavailable = new Set();
        const raindropsByMapping = new Map();
        const raindropLoc = new Map();
        for (const m of allMappings) {
            if (!existingCollectionIds.has(m.raindropCollectionId)) {
                logger/* logger */.v.warn(`Collection ${m.raindropCollectionId} ("${m.raindropCollectionName}") not in cache, skipping mapping ${m.folderName}`);
                unavailable.add(m.id);
                continue;
            }
            try {
                const drops = await (0,raindropApi/* getAllRaindropsInCollection */.F_)(m.raindropCollectionId);
                raindropsByMapping.set(m.id, drops);
                for (const r of drops)
                    raindropLoc.set(r._id, { raindrop: r, mappingId: m.id });
            }
            catch (error) {
                unavailable.add(m.id);
                recordError('fetch', `Failed to fetch raindrops for ${m.folderName}: ${error}`);
            }
        }
        const browserByMapping = new Map();
        const browserLoc = new Map();
        for (const m of allMappings) {
            try {
                // `getChildren()` has returned inconsistent node shapes for the
                // Chrome Bookmarks Bar across browser versions. Read the mapped
                // folder as a subtree instead, then take its direct children.
                // A direct child with a URL is a bookmark regardless of its
                // optional browser-specific `type` value. Subfolders are still
                // handled by their own recursive mappings below.
                const subtree = await browser_polyfill_default().bookmarks.getSubTree(m.firefoxFolderId);
                const children = (subtree[0]?.children ?? []).filter((node) => typeof node.url === 'string' && node.url.length > 0);
                browserByMapping.set(m.id, children);
                for (const b of children)
                    browserLoc.set(b.id, { node: b, mappingId: m.id });
            }
            catch (error) {
                unavailable.add(m.id);
                logger/* logger */.v.warn(`Failed to read browser folder for ${m.folderName}, skipping mapping`, error);
            }
        }
        // ---- Phase 1: linked bookmarks (baseline exists) — three-way per link ----
        const allLinks = await (0,storage/* getBookmarkLinks */.w5)();
        for (const link of allLinks) {
            if (!mappingById.has(link.mappingId) || unavailable.has(link.mappingId))
                continue;
            const bLoc = browserLoc.get(link.firefoxId);
            const rLoc = raindropLoc.get(link.raindropId);
            // A side that resolved into an unavailable mapping can't be judged — skip.
            if ((bLoc && unavailable.has(bLoc.mappingId)) ||
                (rLoc && unavailable.has(rLoc.mappingId))) {
                continue;
            }
            if (!bLoc) {
                // Not under any mapped folder. Deleted, or moved out of synced scope
                // (both mean "absent"), or an unreadable state — verify fail-closed.
                try {
                    await browser_polyfill_default().bookmarks.get(link.firefoxId); // alive → departed scope → absent
                }
                catch (error) {
                    if (!isBookmarkNotFoundError(error))
                        continue; // can't verify → retry next pass
                }
            }
            const base = {
                bHash: link.browserHash ?? link.contentHash,
                rHash: link.raindropHash ?? link.contentHash,
                mappingId: link.mappingId,
            };
            const browserSnap = bLoc && bLoc.node.url
                ? {
                    hash: (0,hash/* computeBookmarkHash */.q$)(bLoc.node.url, bLoc.node.title),
                    mappingId: bLoc.mappingId,
                    time: browserTime(bLoc.node),
                }
                : null;
            const raindropSnap = rLoc
                ? {
                    hash: (0,hash/* computeRaindropHash */.vD)(rLoc.raindrop.link, rLoc.raindrop.title),
                    mappingId: rLoc.mappingId,
                    time: parseRaindropTime(rLoc.raindrop.lastUpdate),
                }
                : null;
            const linkStrategy = strategyOf(link.mappingId);
            try {
                switch (decideBookmarkAction(base, browserSnap, raindropSnap, linkStrategy, {
                    browserDeletedAt: mtimes[`del:${link.firefoxId}`],
                })) {
                    case 'none':
                        break;
                    case 'rebaseline':
                        await (0,storage/* updateBookmarkLink */.Ok)(link.id, {
                            url: bLoc.node.url,
                            title: bLoc.node.title,
                            contentHash: browserSnap.hash,
                            browserHash: browserSnap.hash,
                            raindropHash: browserSnap.hash,
                            mappingId: bLoc.mappingId,
                            lastModified: Date.now(),
                            syncStatus: 'synced',
                        });
                        break;
                    case 'conflict': {
                        const what = !bLoc
                            ? 'Chrome 已删除、Raindrop 有修改'
                            : !rLoc
                                ? 'Raindrop 已删除、Chrome 有修改'
                                : '两边都有修改';
                        await (0,storage/* updateBookmarkLink */.Ok)(link.id, { syncStatus: 'conflict' });
                        recordError('conflict', `已跳过冲突（${what}）：“${link.title}”`);
                        break;
                    }
                    case 'push-update': {
                        const target = mappingById.get(bLoc.mappingId);
                        const updates = {
                            link: bLoc.node.url,
                            title: bLoc.node.title,
                        };
                        if (bLoc.mappingId !== link.mappingId) {
                            updates.collection = { $id: target.raindropCollectionId }; // move preserves _id
                        }
                        await (0,raindropApi/* updateRaindrop */.FL)(link.raindropId, updates);
                        await (0,storage/* updateBookmarkLink */.Ok)(link.id, {
                            url: bLoc.node.url,
                            title: bLoc.node.title,
                            contentHash: browserSnap.hash,
                            browserHash: browserSnap.hash,
                            raindropHash: browserSnap.hash,
                            mappingId: bLoc.mappingId,
                            lastModified: Date.now(),
                            syncStatus: 'synced',
                        });
                        result.pushed++;
                        break;
                    }
                    case 'pull-update': {
                        const target = mappingById.get(rLoc.mappingId);
                        let firefoxId = link.firefoxId;
                        if (!bLoc) {
                            // Delete-vs-edit conflict → Raindrop wins → resurrect in browser.
                            const created = await browser_polyfill_default().bookmarks.create({
                                parentId: target.firefoxFolderId,
                                title: rLoc.raindrop.title,
                                url: rLoc.raindrop.link,
                            });
                            firefoxId = created.id;
                        }
                        else {
                            if (browserSnap.hash !== raindropSnap.hash) {
                                await browser_polyfill_default().bookmarks.update(link.firefoxId, {
                                    title: rLoc.raindrop.title,
                                    url: rLoc.raindrop.link,
                                });
                            }
                            if (bLoc.mappingId !== rLoc.mappingId) {
                                await browser_polyfill_default().bookmarks.move(link.firefoxId, {
                                    parentId: target.firefoxFolderId,
                                });
                            }
                        }
                        await (0,storage/* updateBookmarkLink */.Ok)(link.id, {
                            firefoxId,
                            url: rLoc.raindrop.link,
                            title: rLoc.raindrop.title,
                            contentHash: raindropSnap.hash,
                            browserHash: raindropSnap.hash,
                            raindropHash: raindropSnap.hash,
                            mappingId: rLoc.mappingId,
                            lastModified: Date.now(),
                            syncStatus: 'synced',
                        });
                        result.pulled++;
                        break;
                    }
                    case 'delete-in-raindrop':
                        await (0,raindropApi/* deleteRaindrop */.Dd)(link.raindropId); // Raindrop Trash keeps it recoverable
                        await (0,storage/* removeBookmarkLink */.jH)(link.id);
                        result.deletedInRaindrop++;
                        break;
                    case 'delete-in-browser':
                        try {
                            await browser_polyfill_default().bookmarks.remove(link.firefoxId);
                        }
                        catch {
                            // already gone
                        }
                        await (0,storage/* removeBookmarkLink */.jH)(link.id);
                        result.deletedInBrowser++;
                        break;
                    case 'recreate-in-raindrop': {
                        // The authoritative Chrome copy remains; create a new
                        // Raindrop record instead of attempting to update an ID
                        // that the remote side has already deleted.
                        const target = mappingById.get(bLoc.mappingId);
                        const created = await (0,raindropApi/* createRaindrop */.eI)({
                            link: bLoc.node.url,
                            title: bLoc.node.title,
                            collection: { $id: target.raindropCollectionId },
                        });
                        await (0,storage/* updateBookmarkLink */.Ok)(link.id, {
                            raindropId: created._id,
                            url: bLoc.node.url,
                            title: bLoc.node.title,
                            contentHash: browserSnap.hash,
                            browserHash: browserSnap.hash,
                            raindropHash: browserSnap.hash,
                            mappingId: bLoc.mappingId,
                            lastModified: Date.now(),
                            syncStatus: 'synced',
                        });
                        result.createdInRaindrop++;
                        break;
                    }
                    case 'drop-link':
                        await (0,storage/* removeBookmarkLink */.jH)(link.id);
                        break;
                }
            }
            catch (error) {
                recordError('sync', `Reconcile failed for "${link.title}": ${error}`);
            }
        }
        // ---- Phases 2+3: no baseline → union/merge, never delete ----
        const linksAfter = await (0,storage/* getBookmarkLinks */.w5)();
        const linkedFirefoxIds = new Set(linksAfter.map((l) => l.firefoxId));
        const linkedRaindropIds = new Set(linksAfter.map((l) => l.raindropId));
        const linkedUrls = new Set(linksAfter.map((l) => (0,hash/* normalizeUrl */.l2)(l.url)));
        // Anything that HAD a baseline entering phase 1 was fully handled there.
        // The side snapshots are stale by now (a raindrop deleted in phase 1 is
        // still in raindropsByMapping, a removed bookmark still in
        // browserByMapping) — without this union a phase-1 deletion would be
        // resurrected here as a "new" object, oscillating on every pass.
        for (const l of allLinks) {
            linkedFirefoxIds.add(l.firefoxId);
            linkedRaindropIds.add(l.raindropId);
            linkedUrls.add((0,hash/* normalizeUrl */.l2)(l.url));
        }
        for (const m of allMappings) {
            if (unavailable.has(m.id))
                continue;
            const unlinkedDropByUrl = new Map();
            for (const r of raindropsByMapping.get(m.id) ?? []) {
                if (!linkedRaindropIds.has(r._id))
                    unlinkedDropByUrl.set((0,hash/* normalizeUrl */.l2)(r.link), r);
            }
            // Phase 2: browser-only bookmarks → adopt by URL, else create in Raindrop.
            const toCreate = [];
            for (const node of browserByMapping.get(m.id) ?? []) {
                if (!node.url || !(0,hash/* isValidSyncUrl */.zU)(node.url) || linkedFirefoxIds.has(node.id))
                    continue;
                const normalized = (0,hash/* normalizeUrl */.l2)(node.url);
                const match = unlinkedDropByUrl.get(normalized);
                if (match) {
                    // Destination already contains the URL: never create or
                    // overwrite a duplicate.  Link the two records and use the
                    // selected authority as the next three-way baseline.
                    try {
                        // Same URL on both sides, no baseline yet. The mapping's
                        // strategy picks which title becomes the baseline (the
                        // other side then syncs to it). "skip" records each
                        // side's own state as its baseline, so nothing is
                        // overwritten and later one-sided edits still flow.
                        const strategy = strategyOf(m.id);
                        const bHash = (0,hash/* computeBookmarkHash */.q$)(node.url, node.title);
                        const rHash = (0,hash/* computeRaindropHash */.vD)(match.link, match.title);
                        const useChrome = strategy === 'chrome' ||
                            (strategy === 'newest' && browserTime(node) > parseRaindropTime(match.lastUpdate));
                        const link = strategy === 'skip'
                            ? { ...buildLink(node.id, match._id, node.url, node.title, bHash, m.id), browserHash: bHash, raindropHash: rHash }
                            // Baseline = the LOSING side's state, so the next
                            // pass sees the winning side as "changed" and
                            // propagates it over the loser.
                            : buildLink(node.id, match._id, useChrome ? match.link : node.url, useChrome ? match.title : node.title, useChrome ? rHash : bHash, m.id);
                        await (0,storage/* addBookmarkLink */.sB)(link);
                        unlinkedDropByUrl.delete(normalized);
                        linkedRaindropIds.add(match._id);
                        linkedUrls.add(normalized);
                        result.adopted++;
                    }
                    catch (error) {
                        // One bad adoption must not abort the rest of the pass.
                        recordError('sync', `Failed to adopt "${node.title}": ${error}`);
                    }
                }
                else {
                    toCreate.push(node);
                }
            }
            if (toCreate.length > 0) {
                try {
                    const created = await (0,raindropApi/* createRaindrops */.LE)(toCreate.map((b) => ({
                        link: b.url,
                        title: b.title,
                        collection: { $id: m.raindropCollectionId },
                    })));
                    // Splice-match back by URL — never link the same bookmark twice.
                    const remaining = [...toCreate];
                    for (const createdDrop of created) {
                        const idx = remaining.findIndex((b) => b.url && (0,hash/* urlsMatch */.Kk)(b.url, createdDrop.link));
                        if (idx === -1)
                            continue;
                        const [node] = remaining.splice(idx, 1);
                        await (0,storage/* addBookmarkLink */.sB)(buildLink(node.id, createdDrop._id, createdDrop.link, createdDrop.title, (0,hash/* computeBookmarkHash */.q$)(createdDrop.link, createdDrop.title), m.id));
                        linkedUrls.add((0,hash/* normalizeUrl */.l2)(createdDrop.link));
                        result.createdInRaindrop++;
                    }
                }
                catch (error) {
                    recordError('create', `Bulk create in Raindrop failed for ${m.folderName}: ${error}`);
                }
            }
            // Phase 3: Raindrop-only → create in browser.  The check is scoped
            // to this destination folder, so the same URL may legitimately live
            // in a different mapped folder.
            for (const r of unlinkedDropByUrl.values()) {
                const normalized = (0,hash/* normalizeUrl */.l2)(r.link);
                const destinationHasDuplicate = (browserByMapping.get(m.id) ?? [])
                    .some((node) => node.url && (0,hash/* normalizeUrl */.l2)(node.url) === normalized);
                if (destinationHasDuplicate) {
                    logger/* logger */.v.debug(`Browser destination already contains ${r.link}, skipping duplicate`);
                    continue;
                }
                try {
                    const created = await browser_polyfill_default().bookmarks.create({
                        parentId: m.firefoxFolderId,
                        title: r.title,
                        url: r.link,
                    });
                    await (0,storage/* addBookmarkLink */.sB)(buildLink(created.id, r._id, r.link, r.title, (0,hash/* computeRaindropHash */.vD)(r.link, r.title), m.id));
                    linkedUrls.add(normalized);
                    result.createdInBrowser++;
                }
                catch (error) {
                    recordError('create', `Failed to create bookmark for "${r.title}": ${error}`);
                }
            }
            await (0,storage/* updateFolderMapping */.uz)(m.id, { lastSync: Date.now() });
        }
        // Persist this pass's outcome (replace-all: clean → []). A failure to WRITE
        // the results is not a sync failure — the work already happened — so log it
        // rather than let it fall into the pass-aborted catch below and get
        // mislabelled as a 'connection' error.
        try {
            await (0,storage/* setSyncErrors */.R9)(errorEntries);
            await (0,storage/* updateSyncStats */.ml)({
                lastSyncTime: Date.now(),
                lastSyncStatus: result.errors.length === 0 ? 'success' : 'partial',
            });
        }
        catch (persistError) {
            logger/* logger */.v.error('Failed to persist reconcile results', persistError);
        }
        logger/* logger */.v.info('Reconcile completed', result);
        return result;
    }
    catch (error) {
        // A failure that aborted the whole pass (e.g. the collection fetch threw —
        // offline / server down / bad token). Surface it in the panel as a
        // connection error so a fully-failed background pass isn't silent.
        recordError('connection', `Sync failed: ${error}`);
        await (0,storage/* setSyncErrors */.R9)(errorEntries);
        await (0,storage/* updateSyncStats */.ml)({ lastSyncTime: Date.now(), lastSyncStatus: 'failed' });
        throw error;
    }
    finally {
        (0,bookmarkListeners/* setSyncing */.sV)(false);
        await releaseReconcileLock();
    }
}
// ==================== Nested Folder Sync ====================
// Safety ceiling against runaway recursion, not a feature limit: Raindrop.io
// accepts far deeper nesting (probed ≥8 levels), and real bookmark trees are
// rarely deeper than a handful. 20 covers any realistic tree while still
// bounding pathological cases (task 007). Raise if a real use case needs it.
const MAX_SYNC_DEPTH = 20;
/**
 * Recursive structural reconciliation of a mapped folder↔collection pair
 * (task 001). Walks both sides' children, creates whatever is missing
 * (folders, collections, child mappings), and recurses. Idempotent:
 * re-running on an already reconciled tree creates nothing.
 *
 * Returns every mapping in the subtree, including `mapping` itself.
 */
async function reconcileFolderTree(mapping, collectionsCache, depth = 0) {
    const result = [mapping];
    if (depth >= MAX_SYNC_DEPTH) {
        logger/* logger */.v.warn(`Max sync depth (${MAX_SYNC_DEPTH}) reached, stopping reconciliation`);
        return result;
    }
    // The mapping's own collection is gone (root resurrection is out of scope
    // for task 001): reconciling anyway would create child collections under a
    // dead parent id. Bail out; the pull guard already skips this mapping.
    if (!collectionsCache.some((c) => c._id === mapping.raindropCollectionId)) {
        logger/* logger */.v.warn(`Collection ${mapping.raindropCollectionId} ("${mapping.raindropCollectionName}") not found, skipping reconciliation for ${mapping.folderName}`);
        return result;
    }
    (0,bookmarkListeners/* setSyncing */.sV)(true);
    try {
        // Existing mappings are authoritative (grilling decision #1): a pair
        // already linked by a mapping is never re-matched by name.
        const allMappings = await (0,storage.getFolderMappings)();
        const mappingByCollectionId = new Map();
        for (const m of allMappings) {
            mappingByCollectionId.set(m.raindropCollectionId, m);
        }
        const mappingByFolderId = new Map();
        for (const m of allMappings) {
            mappingByFolderId.set(m.firefoxFolderId, m);
        }
        const mappingById = new Map(allMappings.map((m) => [m.id, m]));
        // Scope "this folder only": bookmarks directly inside are synced, the
        // subfolders are left alone on both sides.
        if (!includesSubfolders(mapping, mappingById)) {
            return result;
        }
        const { authority: fallbackStrategy = 'raindrop' } = await (0,storage/* getSettings */.mt)();
        const strategy = resolveStrategy(mapping, mappingById, fallbackStrategy);
        const folderMtimes = await readBrowserMtimes();
        const browserChildren = await browser_polyfill_default().bookmarks.getChildren(mapping.firefoxFolderId);
        const subfolders = browserChildren.filter(bookmarkNode/* isFolderNode */.R);
        // Unmapped browser subfolders → match an existing child collection by
        // name (discovery only — existing mappings already handled above), or
        // create a new collection.
        for (const subfolder of subfolders) {
            const linkedMapping = mappingByFolderId.get(subfolder.id);
            if (linkedMapping) {
                // A collection deleted in Raindrop while its folder lives on is
                // handled by propagateRaindropCollectionDeletions (Direction B),
                // which runs before reconcile and removes the folder + mapping. So
                // there is nothing to resurrect here — the linked pair is handled by
                // the collection pass below.
                continue;
            }
            const nameMatch = getChildCollectionsOf(mapping.raindropCollectionId, collectionsCache).find((c) => !mappingByCollectionId.has(c._id) &&
                namesMatch(c.title, subfolder.title));
            const childCollection = nameMatch ??
                (await (0,raindropApi/* createCollection */.No)({
                    title: subfolder.title,
                    parent: { $id: mapping.raindropCollectionId },
                }));
            if (!nameMatch) {
                collectionsCache.push(childCollection); // visible to recursion below
            }
            const childMapping = {
                id: (0,hash/* generateId */.$C)(),
                firefoxFolderId: subfolder.id,
                raindropCollectionId: childCollection._id,
                folderName: subfolder.title,
                raindropCollectionName: childCollection.title,
                parentMappingId: mapping.id,
                depth: mapping.depth + 1,
                lastSync: 0,
            };
            await (0,storage.addFolderMapping)(childMapping);
            // Make the freshly created child collection visible to the collection
            // pass below so it is not processed a second time.
            mappingByCollectionId.set(childCollection._id, childMapping);
        }
        // Recompute AFTER the browser pass so freshly created collections are
        // included — their subtrees still need recursion.
        const childCollections = getChildCollectionsOf(mapping.raindropCollectionId, collectionsCache);
        for (const childCollection of childCollections) {
            const existingMapping = mappingByCollectionId.get(childCollection._id);
            let childMapping;
            if (existingMapping) {
                childMapping = existingMapping;
                // Locate the mapped browser folder — a direct child, or moved
                // elsewhere but still alive (verify with bookmarks.get; "not a direct
                // child" alone is not proof of deletion). A folder deleted in the
                // browser is removed together with its collection by
                // propagateBrowserFolderDeletions (Direction A) before reconcile
                // runs, so reaching here with a genuinely missing folder is an
                // inconsistent state — skip it (Direction A cleans it next pass)
                // rather than resurrecting it.
                let browserFolder = subfolders.find((f) => f.id === existingMapping.firefoxFolderId);
                if (!browserFolder) {
                    try {
                        [browserFolder] = await browser_polyfill_default().bookmarks.get(childMapping.firefoxFolderId);
                    }
                    catch {
                        browserFolder = undefined;
                    }
                }
                if (!browserFolder)
                    continue;
                // Rename B↔R (task 014): three-way against the baseline name
                // (mapping.folderName = the name at last sync). Changed only in the
                // browser → push to Raindrop; changed only in Raindrop → pull;
                // both → conflict → Raindrop wins. ci+trim drift is not a rename.
                const renameAction = decideRenameAction(existingMapping.folderName, browserFolder.title, childCollection.title, strategy, {
                    browser: folderMtimes[browserFolder.id] || 0,
                    raindrop: parseRaindropTime(childCollection.lastUpdate),
                });
                if (renameAction === 'conflict') {
                    pendingFolderConflicts.push(`已跳过文件夹重命名冲突：Chrome “${browserFolder.title}” ↔ Raindrop “${childCollection.title}”`);
                }
                else if (renameAction === 'pull-rename') {
                    await browser_polyfill_default().bookmarks.update(childMapping.firefoxFolderId, {
                        title: childCollection.title,
                    });
                }
                else if (renameAction === 'push-rename') {
                    await (0,raindropApi/* updateCollection */.IX)(childCollection._id, {
                        title: browserFolder.title,
                    });
                    // Keep the shared cache honest for the recursion below.
                    childCollection.title = browserFolder.title;
                }
                const syncedName = childCollection.title;
                if (renameAction !== 'conflict' && (!namesMatch(existingMapping.folderName, syncedName) ||
                    existingMapping.raindropCollectionName !== syncedName)) {
                    childMapping = {
                        ...childMapping,
                        folderName: syncedName,
                        raindropCollectionName: syncedName,
                    };
                    await (0,storage/* updateFolderMapping */.uz)(existingMapping.id, {
                        folderName: syncedName,
                        raindropCollectionName: syncedName,
                    });
                }
            }
            else {
                // Raindrop-only child collection → materialize as a browser folder
                const folder = await browser_polyfill_default().bookmarks.create({
                    parentId: mapping.firefoxFolderId,
                    title: childCollection.title,
                });
                childMapping = {
                    id: (0,hash/* generateId */.$C)(),
                    firefoxFolderId: folder.id,
                    raindropCollectionId: childCollection._id,
                    folderName: childCollection.title,
                    raindropCollectionName: childCollection.title,
                    parentMappingId: mapping.id,
                    depth: mapping.depth + 1,
                    lastSync: 0,
                };
                await (0,storage.addFolderMapping)(childMapping);
            }
            const subtree = await reconcileFolderTree(childMapping, collectionsCache, depth + 1);
            result.push(...subtree);
        }
        return result;
    }
    finally {
        (0,bookmarkListeners/* setSyncing */.sV)(false);
    }
}
/**
 * Legacy entry point kept for the `syncFolderWithChildren` message —
 * now a thin wrapper over reconcileFolderTree (task 001). The folder
 * must already be mapped; returns the child mappings of the subtree.
 */
async function syncFolderWithChildren(firefoxFolderId, _raindropParentId) {
    const mappings = await (0,storage.getFolderMappings)();
    const rootMapping = mappings.find((m) => m.firefoxFolderId === firefoxFolderId);
    if (!rootMapping) {
        logger/* logger */.v.warn(`syncFolderWithChildren: no mapping found for folder ${firefoxFolderId}`);
        return [];
    }
    const collectionsCache = await (0,raindropApi/* getAllCollections */.R9)();
    const subtree = await reconcileFolderTree(rootMapping, collectionsCache);
    return subtree.filter((m) => m.id !== rootMapping.id);
}
// ==================== Full Re-sync ====================
async function performFullResync() {
    const results = [];
    const errors = [];
    const mappings = await (0,storage.getFolderMappings)();
    if (mappings.length === 0) {
        return { success: true, results: [], errors: ['No mappings configured'] };
    }
    // Clear existing links
    await (0,storage/* saveBookmarkLinks */.V_)([]);
    // One global pass (task 014): with the link table cleared there is no
    // baseline, so the engine unions every mapping (never deletes) and rebuilds
    // all links. Looping performInitialSync per mapping would run the same
    // global reconcile N times, attributing everything to the first mapping.
    try {
        const r = await reconcileAllMappings();
        results.push({
            matched: r.adopted,
            createdInRaindrop: r.createdInRaindrop,
            createdInFirefox: r.createdInBrowser,
            foldersSynced: (await (0,storage.getFolderMappings)()).length,
            errors: r.errors,
        });
        errors.push(...r.errors);
    }
    catch (error) {
        errors.push(`Full resync failed: ${error}`);
    }
    await (0,storage.updateSettings)({ lastFullSync: Date.now() });
    return {
        success: errors.length === 0,
        results,
        errors,
    };
}
// ==================== Periodic Sync Setup ====================
let syncAlarmName = 'raindrop-sync-interval';
async function setupPeriodicSync() {
    const settings = await (0,storage/* getSettings */.mt)();
    if (settings.enabled && settings.syncInterval > 0) {
        // Only create alarm if it doesn't exist or the interval changed.
        // Avoids resetting the timer on every Service Worker restart in Chrome MV3.
        const existing = await browser_polyfill_default().alarms.get(syncAlarmName);
        if (!existing || existing.periodInMinutes !== settings.syncInterval) {
            await browser_polyfill_default().alarms.clear(syncAlarmName);
            await browser_polyfill_default().alarms.create(syncAlarmName, {
                periodInMinutes: settings.syncInterval,
            });
            logger/* logger */.v.info(`Periodic sync set up: every ${settings.syncInterval} minutes`);
        }
    }
    else {
        await browser_polyfill_default().alarms.clear(syncAlarmName);
    }
}
async function handleSyncAlarm(alarm) {
    if (alarm.name === syncAlarmName) {
        // Automatic path: honour the "Enable Sync" toggle (task 007). Manual
        // sync bypasses this by calling reconcileAllMappings directly.
        const settings = await (0,storage/* getSettings */.mt)();
        if (!settings.enabled) {
            logger/* logger */.v.debug('Auto-sync disabled, skipping periodic pull');
            return;
        }
        logger/* logger */.v.info('Periodic sync triggered');
        // One unified three-way pass (task 014) — catches up both directions,
        // including deletions the real-time events missed.
        await reconcileAllMappings();
    }
}
// Cache username to avoid API call on every popup open
let cachedUserName;
function clearCachedUser() {
    cachedUserName = undefined;
}
async function getSyncStatus() {
    const isAuth = await (0,storage/* isAuthenticated */.wR)();
    const settings = await (0,storage/* getSettings */.mt)();
    const mappings = await (0,storage.getFolderMappings)();
    const links = await (0,storage/* getBookmarkLinks */.w5)();
    const stats = await (0,storage.getSyncStats)();
    const { isSyncInProgress } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 356));
    let userName;
    if (isAuth) {
        if (cachedUserName) {
            userName = cachedUserName;
        }
        else {
            try {
                const user = await (0,raindropApi/* getCurrentUser */.HW)();
                cachedUserName = user.fullName;
                userName = cachedUserName;
            }
            catch {
                // Token may be invalid
            }
        }
    }
    else {
        cachedUserName = undefined;
    }
    return {
        isAuthenticated: isAuth,
        isEnabled: settings.enabled,
        isSyncing: isSyncInProgress(),
        mappingsCount: mappings.length,
        linksCount: links.length,
        lastSyncTime: stats.lastSyncTime,
        lastSyncStatus: stats.lastSyncStatus,
        userName,
    };
}


/***/ },

/***/ 168
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   R: () => (/* binding */ isFolderNode),
/* harmony export */   d: () => (/* binding */ isBookmarkNode)
/* harmony export */ });
// Bookmark tree node predicates shared across sync code.
/**
 * Unified folder detection (task 001, bug #5).
 *
 * Firefox sets `type: 'folder'`, but Chrome often omits `type` entirely —
 * so a folder is "anything without a URL that isn't a separator".
 * Never check `node.type === 'folder'` directly.
 */
function isFolderNode(node) {
    return !node.url && node.type !== 'separator';
}
/**
 * Unified bookmark detection across Chrome and Firefox. A real bookmark has
 * a non-empty URL; Chrome may use `type: 'url'`, Firefox uses `bookmark`, and
 * older Chrome versions can omit `type`.
 */
function isBookmarkNode(node) {
    // Chrome may label bookmark-bar URLs as `type: 'url'`, while Firefox uses
    // `bookmark` and older Chrome versions omit the type.  A non-empty URL is
    // the stable cross-browser bookmark signal; folders/separators lack one.
    return typeof node.url === 'string' && node.url.length > 0 && node.type !== 'separator';
}


/***/ },

/***/ 760
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $C: () => (/* binding */ generateId),
/* harmony export */   Kk: () => (/* binding */ urlsMatch),
/* harmony export */   l2: () => (/* binding */ normalizeUrl),
/* harmony export */   q$: () => (/* binding */ computeBookmarkHash),
/* harmony export */   vD: () => (/* binding */ computeRaindropHash),
/* harmony export */   zU: () => (/* binding */ isValidSyncUrl)
/* harmony export */ });
/* unused harmony export hashString */
/* harmony import */ var nanoid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(329);
// Hash utilities for change detection

/**
 * Simple hash function for strings (DJB2 algorithm)
 */
function hashString(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
    }
    return (hash >>> 0).toString(16);
}
/**
 * Compute content hash for a bookmark
 */
function computeBookmarkHash(url, title) {
    const content = `${normalizeUrl(url)}|${title.trim()}`;
    return hashString(content);
}
/**
 * Compute content hash for a Raindrop
 */
function computeRaindropHash(link, title) {
    const content = `${normalizeUrl(link)}|${title.trim()}`;
    return hashString(content);
}
/**
 * Normalize URL for comparison
 * - Remove trailing slashes
 * - Convert to lowercase
 * - Remove common tracking parameters
 * - Sort query parameters
 */
function normalizeUrl(url) {
    try {
        const parsed = new URL(url);
        // Convert to lowercase
        parsed.hostname = parsed.hostname.toLowerCase();
        parsed.protocol = parsed.protocol.toLowerCase();
        // Remove trailing slash from pathname
        if (parsed.pathname.endsWith('/') && parsed.pathname.length > 1) {
            parsed.pathname = parsed.pathname.slice(0, -1);
        }
        // Remove common tracking parameters
        const trackingParams = [
            'utm_source',
            'utm_medium',
            'utm_campaign',
            'utm_term',
            'utm_content',
            'fbclid',
            'gclid',
        ];
        trackingParams.forEach((param) => {
            parsed.searchParams.delete(param);
        });
        // Sort query parameters for consistent comparison
        const params = [];
        parsed.searchParams.forEach((value, key) => {
            params.push([key, value]);
        });
        params.sort((a, b) => a[0].localeCompare(b[0]));
        const sortedParams = new URLSearchParams();
        params.forEach(([key, value]) => {
            sortedParams.append(key, value);
        });
        parsed.search = sortedParams.toString();
        // Remove hash
        parsed.hash = '';
        return parsed.toString();
    }
    catch {
        // If URL parsing fails, return the original string normalized
        return url.toLowerCase().replace(/\/+$/, '');
    }
}
/**
 * Check if two URLs are effectively the same
 */
function urlsMatch(url1, url2) {
    return normalizeUrl(url1) === normalizeUrl(url2);
}
/**
 * Generate a unique ID (cryptographically strong, 21 chars)
 */
function generateId() {
    return (0,nanoid__WEBPACK_IMPORTED_MODULE_0__/* .nanoid */ .Ak)();
}
/**
 * Check if URL is valid for syncing to Raindrop
 * Filters out internal browser URLs that Raindrop won't accept
 */
function isValidSyncUrl(url) {
    if (!url)
        return false;
    // Invalid protocols that Raindrop won't accept
    const invalidProtocols = [
        'about:',
        'chrome:',
        'chrome-extension:',
        'moz-extension:',
        'edge:',
        'brave:',
        'opera:',
        'vivaldi:',
        'file:',
        'data:',
        'javascript:',
        'blob:',
    ];
    const lowerUrl = url.toLowerCase();
    for (const protocol of invalidProtocols) {
        if (lowerUrl.startsWith(protocol)) {
            return false;
        }
    }
    // Must have a valid protocol
    if (!lowerUrl.startsWith('http://') && !lowerUrl.startsWith('https://')) {
        return false;
    }
    return true;
}


/***/ },

/***/ 628
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   v: () => (/* binding */ logger)
/* harmony export */ });
// Logger utility for debugging
class Logger {
    constructor() {
        this.debugMode = false;
        this.prefix = '[RaindropSync]';
        this.logHistory = [];
        this.maxHistorySize = 100;
    }
    setDebugMode(enabled) {
        this.debugMode = enabled;
    }
    isDebugMode() {
        return this.debugMode;
    }
    formatMessage(level, message) {
        const timestamp = new Date().toISOString();
        return `${this.prefix} [${timestamp}] [${level.toUpperCase()}] ${message}`;
    }
    addToHistory(level, message, data) {
        const entry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            data,
        };
        this.logHistory.push(entry);
        if (this.logHistory.length > this.maxHistorySize) {
            this.logHistory.shift();
        }
    }
    debug(message, data) {
        if (!this.debugMode)
            return;
        this.addToHistory('debug', message, data);
        if (data !== undefined) {
            console.log(this.formatMessage('debug', message), data);
        }
        else {
            console.log(this.formatMessage('debug', message));
        }
    }
    info(message, data) {
        this.addToHistory('info', message, data);
        if (data !== undefined) {
            console.info(this.formatMessage('info', message), data);
        }
        else {
            console.info(this.formatMessage('info', message));
        }
    }
    warn(message, data) {
        this.addToHistory('warn', message, data);
        if (data !== undefined) {
            console.warn(this.formatMessage('warn', message), data);
        }
        else {
            console.warn(this.formatMessage('warn', message));
        }
    }
    error(message, error) {
        this.addToHistory('error', message, error);
        if (error !== undefined) {
            console.error(this.formatMessage('error', message), error);
        }
        else {
            console.error(this.formatMessage('error', message));
        }
    }
    getHistory() {
        return [...this.logHistory];
    }
    clearHistory() {
        this.logHistory = [];
    }
}
const logger = new Logger();
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (logger)));


/***/ },

/***/ 815
(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else // removed by dead control flow
{ var mod; }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (module) {
  /* webextension-polyfill - v0.12.0 - Tue May 14 2024 18:01:29 */
  /* -*- Mode: indent-tabs-mode: nil; js-indent-level: 2 -*- */
  /* vim: set sts=2 sw=2 et tw=80: */
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  "use strict";

  if (!(globalThis.chrome && globalThis.chrome.runtime && globalThis.chrome.runtime.id)) {
    throw new Error("This script should only be loaded in a browser extension.");
  }
  if (!(globalThis.browser && globalThis.browser.runtime && globalThis.browser.runtime.id)) {
    const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";

    // Wrapping the bulk of this polyfill in a one-time-use function is a minor
    // optimization for Firefox. Since Spidermonkey does not fully parse the
    // contents of a function until the first time it's called, and since it will
    // never actually need to be called, this allows the polyfill to be included
    // in Firefox nearly for free.
    const wrapAPIs = extensionAPIs => {
      // NOTE: apiMetadata is associated to the content of the api-metadata.json file
      // at build time by replacing the following "include" with the content of the
      // JSON file.
      const apiMetadata = {
        "alarms": {
          "clear": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "clearAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "get": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "bookmarks": {
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getChildren": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getRecent": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getSubTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTree": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "browserAction": {
          "disable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "enable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "getBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getBadgeText": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "openPopup": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setBadgeText": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "browsingData": {
          "remove": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "removeCache": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCookies": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeDownloads": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFormData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeHistory": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeLocalStorage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePasswords": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePluginData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "settings": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "commands": {
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "contextMenus": {
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "cookies": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAllCookieStores": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "set": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "devtools": {
          "inspectedWindow": {
            "eval": {
              "minArgs": 1,
              "maxArgs": 2,
              "singleCallbackArg": false
            }
          },
          "panels": {
            "create": {
              "minArgs": 3,
              "maxArgs": 3,
              "singleCallbackArg": true
            },
            "elements": {
              "createSidebarPane": {
                "minArgs": 1,
                "maxArgs": 1
              }
            }
          }
        },
        "downloads": {
          "cancel": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "download": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "erase": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFileIcon": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "open": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "pause": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFile": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "resume": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "extension": {
          "isAllowedFileSchemeAccess": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "isAllowedIncognitoAccess": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "history": {
          "addUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "deleteRange": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getVisits": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "i18n": {
          "detectLanguage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAcceptLanguages": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "identity": {
          "launchWebAuthFlow": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "idle": {
          "queryState": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "management": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getSelf": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setEnabled": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "uninstallSelf": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "notifications": {
          "clear": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPermissionLevel": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "pageAction": {
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "hide": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "permissions": {
          "contains": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "request": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "runtime": {
          "getBackgroundPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPlatformInfo": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "openOptionsPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "requestUpdateCheck": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "sendMessage": {
            "minArgs": 1,
            "maxArgs": 3
          },
          "sendNativeMessage": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "setUninstallURL": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "sessions": {
          "getDevices": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getRecentlyClosed": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "restore": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "storage": {
          "local": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          },
          "managed": {
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            }
          },
          "sync": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          }
        },
        "tabs": {
          "captureVisibleTab": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "detectLanguage": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "discard": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "duplicate": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "executeScript": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getZoom": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getZoomSettings": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "goBack": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "goForward": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "highlight": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "insertCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "query": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "reload": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "sendMessage": {
            "minArgs": 2,
            "maxArgs": 3
          },
          "setZoom": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "setZoomSettings": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "update": {
            "minArgs": 1,
            "maxArgs": 2
          }
        },
        "topSites": {
          "get": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "webNavigation": {
          "getAllFrames": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFrame": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "webRequest": {
          "handlerBehaviorChanged": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "windows": {
          "create": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getLastFocused": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        }
      };
      if (Object.keys(apiMetadata).length === 0) {
        throw new Error("api-metadata.json has not been included in browser-polyfill");
      }

      /**
       * A WeakMap subclass which creates and stores a value for any key which does
       * not exist when accessed, but behaves exactly as an ordinary WeakMap
       * otherwise.
       *
       * @param {function} createItem
       *        A function which will be called in order to create the value for any
       *        key which does not exist, the first time it is accessed. The
       *        function receives, as its only argument, the key being created.
       */
      class DefaultWeakMap extends WeakMap {
        constructor(createItem, items = undefined) {
          super(items);
          this.createItem = createItem;
        }
        get(key) {
          if (!this.has(key)) {
            this.set(key, this.createItem(key));
          }
          return super.get(key);
        }
      }

      /**
       * Returns true if the given object is an object with a `then` method, and can
       * therefore be assumed to behave as a Promise.
       *
       * @param {*} value The value to test.
       * @returns {boolean} True if the value is thenable.
       */
      const isThenable = value => {
        return value && typeof value === "object" && typeof value.then === "function";
      };

      /**
       * Creates and returns a function which, when called, will resolve or reject
       * the given promise based on how it is called:
       *
       * - If, when called, `chrome.runtime.lastError` contains a non-null object,
       *   the promise is rejected with that value.
       * - If the function is called with exactly one argument, the promise is
       *   resolved to that value.
       * - Otherwise, the promise is resolved to an array containing all of the
       *   function's arguments.
       *
       * @param {object} promise
       *        An object containing the resolution and rejection functions of a
       *        promise.
       * @param {function} promise.resolve
       *        The promise's resolution function.
       * @param {function} promise.reject
       *        The promise's rejection function.
       * @param {object} metadata
       *        Metadata about the wrapped method which has created the callback.
       * @param {boolean} metadata.singleCallbackArg
       *        Whether or not the promise is resolved with only the first
       *        argument of the callback, alternatively an array of all the
       *        callback arguments is resolved. By default, if the callback
       *        function is invoked with only a single argument, that will be
       *        resolved to the promise, while all arguments will be resolved as
       *        an array if multiple are given.
       *
       * @returns {function}
       *        The generated callback function.
       */
      const makeCallback = (promise, metadata) => {
        return (...callbackArgs) => {
          if (extensionAPIs.runtime.lastError) {
            promise.reject(new Error(extensionAPIs.runtime.lastError.message));
          } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
            promise.resolve(callbackArgs[0]);
          } else {
            promise.resolve(callbackArgs);
          }
        };
      };
      const pluralizeArguments = numArgs => numArgs == 1 ? "argument" : "arguments";

      /**
       * Creates a wrapper function for a method with the given name and metadata.
       *
       * @param {string} name
       *        The name of the method which is being wrapped.
       * @param {object} metadata
       *        Metadata about the method being wrapped.
       * @param {integer} metadata.minArgs
       *        The minimum number of arguments which must be passed to the
       *        function. If called with fewer than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {integer} metadata.maxArgs
       *        The maximum number of arguments which may be passed to the
       *        function. If called with more than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {boolean} metadata.singleCallbackArg
       *        Whether or not the promise is resolved with only the first
       *        argument of the callback, alternatively an array of all the
       *        callback arguments is resolved. By default, if the callback
       *        function is invoked with only a single argument, that will be
       *        resolved to the promise, while all arguments will be resolved as
       *        an array if multiple are given.
       *
       * @returns {function(object, ...*)}
       *       The generated wrapper function.
       */
      const wrapAsyncFunction = (name, metadata) => {
        return function asyncFunctionWrapper(target, ...args) {
          if (args.length < metadata.minArgs) {
            throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
          }
          if (args.length > metadata.maxArgs) {
            throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
          }
          return new Promise((resolve, reject) => {
            if (metadata.fallbackToNoCallback) {
              // This API method has currently no callback on Chrome, but it return a promise on Firefox,
              // and so the polyfill will try to call it with a callback first, and it will fallback
              // to not passing the callback if the first call fails.
              try {
                target[name](...args, makeCallback({
                  resolve,
                  reject
                }, metadata));
              } catch (cbError) {
                console.warn(`${name} API method doesn't seem to support the callback parameter, ` + "falling back to call it without a callback: ", cbError);
                target[name](...args);

                // Update the API method metadata, so that the next API calls will not try to
                // use the unsupported callback anymore.
                metadata.fallbackToNoCallback = false;
                metadata.noCallback = true;
                resolve();
              }
            } else if (metadata.noCallback) {
              target[name](...args);
              resolve();
            } else {
              target[name](...args, makeCallback({
                resolve,
                reject
              }, metadata));
            }
          });
        };
      };

      /**
       * Wraps an existing method of the target object, so that calls to it are
       * intercepted by the given wrapper function. The wrapper function receives,
       * as its first argument, the original `target` object, followed by each of
       * the arguments passed to the original method.
       *
       * @param {object} target
       *        The original target object that the wrapped method belongs to.
       * @param {function} method
       *        The method being wrapped. This is used as the target of the Proxy
       *        object which is created to wrap the method.
       * @param {function} wrapper
       *        The wrapper function which is called in place of a direct invocation
       *        of the wrapped method.
       *
       * @returns {Proxy<function>}
       *        A Proxy object for the given method, which invokes the given wrapper
       *        method in its place.
       */
      const wrapMethod = (target, method, wrapper) => {
        return new Proxy(method, {
          apply(targetMethod, thisObj, args) {
            return wrapper.call(thisObj, target, ...args);
          }
        });
      };
      let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);

      /**
       * Wraps an object in a Proxy which intercepts and wraps certain methods
       * based on the given `wrappers` and `metadata` objects.
       *
       * @param {object} target
       *        The target object to wrap.
       *
       * @param {object} [wrappers = {}]
       *        An object tree containing wrapper functions for special cases. Any
       *        function present in this object tree is called in place of the
       *        method in the same location in the `target` object tree. These
       *        wrapper methods are invoked as described in {@see wrapMethod}.
       *
       * @param {object} [metadata = {}]
       *        An object tree containing metadata used to automatically generate
       *        Promise-based wrapper functions for asynchronous. Any function in
       *        the `target` object tree which has a corresponding metadata object
       *        in the same location in the `metadata` tree is replaced with an
       *        automatically-generated wrapper function, as described in
       *        {@see wrapAsyncFunction}
       *
       * @returns {Proxy<object>}
       */
      const wrapObject = (target, wrappers = {}, metadata = {}) => {
        let cache = Object.create(null);
        let handlers = {
          has(proxyTarget, prop) {
            return prop in target || prop in cache;
          },
          get(proxyTarget, prop, receiver) {
            if (prop in cache) {
              return cache[prop];
            }
            if (!(prop in target)) {
              return undefined;
            }
            let value = target[prop];
            if (typeof value === "function") {
              // This is a method on the underlying object. Check if we need to do
              // any wrapping.

              if (typeof wrappers[prop] === "function") {
                // We have a special-case wrapper for this method.
                value = wrapMethod(target, target[prop], wrappers[prop]);
              } else if (hasOwnProperty(metadata, prop)) {
                // This is an async method that we have metadata for. Create a
                // Promise wrapper for it.
                let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                value = wrapMethod(target, target[prop], wrapper);
              } else {
                // This is a method that we don't know or care about. Return the
                // original method, bound to the underlying object.
                value = value.bind(target);
              }
            } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
              // This is an object that we need to do some wrapping for the children
              // of. Create a sub-object wrapper for it with the appropriate child
              // metadata.
              value = wrapObject(value, wrappers[prop], metadata[prop]);
            } else if (hasOwnProperty(metadata, "*")) {
              // Wrap all properties in * namespace.
              value = wrapObject(value, wrappers[prop], metadata["*"]);
            } else {
              // We don't need to do any wrapping for this property,
              // so just forward all access to the underlying object.
              Object.defineProperty(cache, prop, {
                configurable: true,
                enumerable: true,
                get() {
                  return target[prop];
                },
                set(value) {
                  target[prop] = value;
                }
              });
              return value;
            }
            cache[prop] = value;
            return value;
          },
          set(proxyTarget, prop, value, receiver) {
            if (prop in cache) {
              cache[prop] = value;
            } else {
              target[prop] = value;
            }
            return true;
          },
          defineProperty(proxyTarget, prop, desc) {
            return Reflect.defineProperty(cache, prop, desc);
          },
          deleteProperty(proxyTarget, prop) {
            return Reflect.deleteProperty(cache, prop);
          }
        };

        // Per contract of the Proxy API, the "get" proxy handler must return the
        // original value of the target if that value is declared read-only and
        // non-configurable. For this reason, we create an object with the
        // prototype set to `target` instead of using `target` directly.
        // Otherwise we cannot return a custom object for APIs that
        // are declared read-only and non-configurable, such as `chrome.devtools`.
        //
        // The proxy handlers themselves will still use the original `target`
        // instead of the `proxyTarget`, so that the methods and properties are
        // dereferenced via the original targets.
        let proxyTarget = Object.create(target);
        return new Proxy(proxyTarget, handlers);
      };

      /**
       * Creates a set of wrapper functions for an event object, which handles
       * wrapping of listener functions that those messages are passed.
       *
       * A single wrapper is created for each listener function, and stored in a
       * map. Subsequent calls to `addListener`, `hasListener`, or `removeListener`
       * retrieve the original wrapper, so that  attempts to remove a
       * previously-added listener work as expected.
       *
       * @param {DefaultWeakMap<function, function>} wrapperMap
       *        A DefaultWeakMap object which will create the appropriate wrapper
       *        for a given listener function when one does not exist, and retrieve
       *        an existing one when it does.
       *
       * @returns {object}
       */
      const wrapEvent = wrapperMap => ({
        addListener(target, listener, ...args) {
          target.addListener(wrapperMap.get(listener), ...args);
        },
        hasListener(target, listener) {
          return target.hasListener(wrapperMap.get(listener));
        },
        removeListener(target, listener) {
          target.removeListener(wrapperMap.get(listener));
        }
      });
      const onRequestFinishedWrappers = new DefaultWeakMap(listener => {
        if (typeof listener !== "function") {
          return listener;
        }

        /**
         * Wraps an onRequestFinished listener function so that it will return a
         * `getContent()` property which returns a `Promise` rather than using a
         * callback API.
         *
         * @param {object} req
         *        The HAR entry object representing the network request.
         */
        return function onRequestFinished(req) {
          const wrappedReq = wrapObject(req, {} /* wrappers */, {
            getContent: {
              minArgs: 0,
              maxArgs: 0
            }
          });
          listener(wrappedReq);
        };
      });
      const onMessageWrappers = new DefaultWeakMap(listener => {
        if (typeof listener !== "function") {
          return listener;
        }

        /**
         * Wraps a message listener function so that it may send responses based on
         * its return value, rather than by returning a sentinel value and calling a
         * callback. If the listener function returns a Promise, the response is
         * sent when the promise either resolves or rejects.
         *
         * @param {*} message
         *        The message sent by the other end of the channel.
         * @param {object} sender
         *        Details about the sender of the message.
         * @param {function(*)} sendResponse
         *        A callback which, when called with an arbitrary argument, sends
         *        that value as a response.
         * @returns {boolean}
         *        True if the wrapped listener returned a Promise, which will later
         *        yield a response. False otherwise.
         */
        return function onMessage(message, sender, sendResponse) {
          let didCallSendResponse = false;
          let wrappedSendResponse;
          let sendResponsePromise = new Promise(resolve => {
            wrappedSendResponse = function (response) {
              didCallSendResponse = true;
              resolve(response);
            };
          });
          let result;
          try {
            result = listener(message, sender, wrappedSendResponse);
          } catch (err) {
            result = Promise.reject(err);
          }
          const isResultThenable = result !== true && isThenable(result);

          // If the listener didn't returned true or a Promise, or called
          // wrappedSendResponse synchronously, we can exit earlier
          // because there will be no response sent from this listener.
          if (result !== true && !isResultThenable && !didCallSendResponse) {
            return false;
          }

          // A small helper to send the message if the promise resolves
          // and an error if the promise rejects (a wrapped sendMessage has
          // to translate the message into a resolved promise or a rejected
          // promise).
          const sendPromisedResult = promise => {
            promise.then(msg => {
              // send the message value.
              sendResponse(msg);
            }, error => {
              // Send a JSON representation of the error if the rejected value
              // is an instance of error, or the object itself otherwise.
              let message;
              if (error && (error instanceof Error || typeof error.message === "string")) {
                message = error.message;
              } else {
                message = "An unexpected error occurred";
              }
              sendResponse({
                __mozWebExtensionPolyfillReject__: true,
                message
              });
            }).catch(err => {
              // Print an error on the console if unable to send the response.
              console.error("Failed to send onMessage rejected reply", err);
            });
          };

          // If the listener returned a Promise, send the resolved value as a
          // result, otherwise wait the promise related to the wrappedSendResponse
          // callback to resolve and send it as a response.
          if (isResultThenable) {
            sendPromisedResult(result);
          } else {
            sendPromisedResult(sendResponsePromise);
          }

          // Let Chrome know that the listener is replying.
          return true;
        };
      });
      const wrappedSendMessageCallback = ({
        reject,
        resolve
      }, reply) => {
        if (extensionAPIs.runtime.lastError) {
          // Detect when none of the listeners replied to the sendMessage call and resolve
          // the promise to undefined as in Firefox.
          // See https://github.com/mozilla/webextension-polyfill/issues/130
          if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
            resolve();
          } else {
            reject(new Error(extensionAPIs.runtime.lastError.message));
          }
        } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
          // Convert back the JSON representation of the error into
          // an Error instance.
          reject(new Error(reply.message));
        } else {
          resolve(reply);
        }
      };
      const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
        if (args.length < metadata.minArgs) {
          throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
        }
        if (args.length > metadata.maxArgs) {
          throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
        }
        return new Promise((resolve, reject) => {
          const wrappedCb = wrappedSendMessageCallback.bind(null, {
            resolve,
            reject
          });
          args.push(wrappedCb);
          apiNamespaceObj.sendMessage(...args);
        });
      };
      const staticWrappers = {
        devtools: {
          network: {
            onRequestFinished: wrapEvent(onRequestFinishedWrappers)
          }
        },
        runtime: {
          onMessage: wrapEvent(onMessageWrappers),
          onMessageExternal: wrapEvent(onMessageWrappers),
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
            minArgs: 1,
            maxArgs: 3
          })
        },
        tabs: {
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
            minArgs: 2,
            maxArgs: 3
          })
        }
      };
      const settingMetadata = {
        clear: {
          minArgs: 1,
          maxArgs: 1
        },
        get: {
          minArgs: 1,
          maxArgs: 1
        },
        set: {
          minArgs: 1,
          maxArgs: 1
        }
      };
      apiMetadata.privacy = {
        network: {
          "*": settingMetadata
        },
        services: {
          "*": settingMetadata
        },
        websites: {
          "*": settingMetadata
        }
      };
      return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
    };

    // The build process adds a UMD wrapper around this file, which makes the
    // `module` variable available.
    module.exports = wrapAPIs(chrome);
  } else {
    module.exports = globalThis.browser;
  }
});
//# sourceMappingURL=browser-polyfill.js.map


/***/ },

/***/ 329
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ak: () => (/* binding */ nanoid)
/* harmony export */ });
/* unused harmony exports random, customRandom, customAlphabet */
/* harmony import */ var _url_alphabet_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(207);
/* @ts-self-types="./index.d.ts" */


let random = bytes => crypto.getRandomValues(new Uint8Array(bytes))
let customRandom = (alphabet, defaultSize, getRandom) => {
  let mask = (2 << Math.log2(alphabet.length - 1)) - 1
  let step = -~((1.6 * mask * defaultSize) / alphabet.length)
  return (size = defaultSize) => {
    let id = ''
    while (true) {
      let bytes = getRandom(step)
      let j = step | 0
      while (j--) {
        id += alphabet[bytes[j] & mask] || ''
        if (id.length >= size) return id
      }
    }
  }
}
let customAlphabet = (alphabet, size = 21) =>
  customRandom(alphabet, size | 0, random)
let nanoid = (size = 21) => {
  let id = ''
  let bytes = crypto.getRandomValues(new Uint8Array((size |= 0)))
  while (size--) {
    id += _url_alphabet_index_js__WEBPACK_IMPORTED_MODULE_0__/* .urlAlphabet */ .x[bytes[size] & 63]
  }
  return id
}


/***/ },

/***/ 207
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   x: () => (/* binding */ urlAlphabet)
/* harmony export */ });
const urlAlphabet =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(815);
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(628);
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(105);
/* harmony import */ var _bookmarkListeners__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(356);
/* harmony import */ var _syncManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(554);
/* harmony import */ var _raindropApi__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(908);
// Background Script - Main Entry Point






// ==================== Initialization ====================
async function initialize() {
    _utils_logger__WEBPACK_IMPORTED_MODULE_1__/* .logger */ .v.info('Raindrop Bookmark Sync extension starting...');
    try {
        // Load settings and set debug mode
        const settings = await (0,_storage__WEBPACK_IMPORTED_MODULE_2__/* .getSettings */ .mt)();
        _utils_logger__WEBPACK_IMPORTED_MODULE_1__/* .logger */ .v.setDebugMode(settings.debugMode);
        // No mapping, no sync (task 012): normalize a stale enabled=true left over
        // with zero mappings (e.g. from before this rule) so it can't silently
        // resume when a mapping is next added.
        const { disableAutoSyncIfNoMappings } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 105));
        await disableAutoSyncIfNoMappings();
        // Always start sync services (they check internally for auth/enabled)
        await (0,_syncManager__WEBPACK_IMPORTED_MODULE_4__/* .setupPeriodicSync */ .U9)();
        _utils_logger__WEBPACK_IMPORTED_MODULE_1__/* .logger */ .v.info('Sync services started');
    }
    catch (error) {
        _utils_logger__WEBPACK_IMPORTED_MODULE_1__/* .logger */ .v.error('Initialization failed', error);
    }
}
// ==================== Message Handlers ====================
async function handleMessage(request) {
    _utils_logger__WEBPACK_IMPORTED_MODULE_1__/* .logger */ .v.debug('Received message', request);
    try {
        switch (request.action) {
            // ==================== Auth ====================
            case 'logout':
                // Disconnect = full teardown. Stop all background activity FIRST so
                // nothing writes back into storage after the wipe, then blank-slate the
                // extension's local state (task 011). Browser folders + Raindrop
                // collections are the user's data and are left untouched.
                await (0,_raindropApi__WEBPACK_IMPORTED_MODULE_5__/* .logout */ .ri)();
                (0,_syncManager__WEBPACK_IMPORTED_MODULE_4__/* .clearCachedUser */ .zE)();
                (0,_bookmarkListeners__WEBPACK_IMPORTED_MODULE_3__/* .unregisterBookmarkListeners */ .WI)();
                await webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().alarms.clearAll();
                await (0,_storage__WEBPACK_IMPORTED_MODULE_2__/* .resetLocalState */ .G2)();
                return { success: true };
            case 'isAuthenticated':
                const isAuth = await (0,_storage__WEBPACK_IMPORTED_MODULE_2__/* .isAuthenticated */ .wR)();
                return { success: true, data: isAuth };
            case 'getUser':
                const user = await (0,_raindropApi__WEBPACK_IMPORTED_MODULE_5__/* .getCurrentUser */ .HW)();
                return { success: true, data: user };
            // ==================== API Token ====================
            case 'getApiToken':
                const token = await (0,_storage__WEBPACK_IMPORTED_MODULE_2__/* .getApiToken */ ._$)();
                return { success: true, data: { hasToken: !!token } };
            case 'saveApiToken':
                await (0,_storage__WEBPACK_IMPORTED_MODULE_2__/* .saveApiToken */ .D$)(request.data);
                return { success: true };
            case 'clearApiToken':
                await (0,_storage__WEBPACK_IMPORTED_MODULE_2__/* .clearApiToken */ .hB)();
                (0,_syncManager__WEBPACK_IMPORTED_MODULE_4__/* .clearCachedUser */ .zE)();
                return { success: true };
            // ==================== Settings ====================
            case 'getSettings':
                const settings = await (0,_storage__WEBPACK_IMPORTED_MODULE_2__/* .getSettings */ .mt)();
                return { success: true, data: settings };
            case 'updateSettings':
                const { updateSettings, getFolderMappings: getMappingsForGuard } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 105));
                let settingsUpdates = request.data;
                if (settingsUpdates?.authority !== undefined && !['skip', 'chrome', 'raindrop', 'newest'].includes(settingsUpdates.authority)) {
                    settingsUpdates = { ...settingsUpdates, authority: 'raindrop' };
                }
                // No mapping, no sync (task 012): never let sync be enabled with zero
                // mappings, whatever asked (the popup has its own toggle). Authoritative
                // guard so every path is covered, not just the options UI.
                if (settingsUpdates.enabled === true &&
                    (await getMappingsForGuard()).length === 0) {
                    settingsUpdates = { ...settingsUpdates, enabled: false };
                }
                const newSettings = await updateSettings(settingsUpdates);
                // Apply settings changes
                if (newSettings.enabled) {
                    (0,_bookmarkListeners__WEBPACK_IMPORTED_MODULE_3__/* .registerBookmarkListeners */ .tW)();
                    await (0,_syncManager__WEBPACK_IMPORTED_MODULE_4__/* .setupPeriodicSync */ .U9)();
                }
                else {
                    (0,_bookmarkListeners__WEBPACK_IMPORTED_MODULE_3__/* .unregisterBookmarkListeners */ .WI)();
                    await webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().alarms.clear('raindrop-sync-interval');
                }
                _utils_logger__WEBPACK_IMPORTED_MODULE_1__/* .logger */ .v.setDebugMode(newSettings.debugMode);
                return { success: true, data: newSettings };
            // ==================== Collections ====================
            case 'getCollections':
                const collections = await (0,_raindropApi__WEBPACK_IMPORTED_MODULE_5__/* .getAllCollections */ .R9)();
                return { success: true, data: collections };
            case 'getRootCollections':
                const rootCollections = await (0,_raindropApi__WEBPACK_IMPORTED_MODULE_5__/* .getRootCollections */ .Gi)();
                return { success: true, data: rootCollections };
            case 'getChildCollections':
                const childCollections = await (0,_raindropApi__WEBPACK_IMPORTED_MODULE_5__/* .getChildCollections */ .Id)();
                return { success: true, data: childCollections };
            case 'createCollection':
                // This creates a separate root collection before a browser folder
                // is mapped to it; existing collections and bookmarks are untouched.
                const collectionTitle = typeof request.data?.title === 'string'
                    ? request.data.title.trim()
                    : '';
                if (!collectionTitle) {
                    return { success: false, error: 'Collection name is required' };
                }
                const createdCollection = await (0,_raindropApi__WEBPACK_IMPORTED_MODULE_5__/* .createCollection */ .No)({ title: collectionTitle });
                return { success: true, data: createdCollection };
            // ==================== Folder Mappings ====================
            case 'updateFolderMapping': {
                // Only user-facing options are editable from the Options page.
                const { id, updates = {} } = request.data || {};
                const allowed = {};
                if (['skip', 'chrome', 'raindrop', 'newest'].includes(updates.conflictStrategy))
                    allowed.conflictStrategy = updates.conflictStrategy;
                if (typeof updates.includeSubfolders === 'boolean')
                    allowed.includeSubfolders = updates.includeSubfolders;
                const updated = await (0,_storage__WEBPACK_IMPORTED_MODULE_2__/* .updateFolderMapping */ .uz)(id, allowed);
                return updated ? { success: true, data: updated } : { success: false, error: 'Mapping not found' };
            }
            case 'searchCollectionCovers': {
                const urls = await (0,_raindropApi__WEBPACK_IMPORTED_MODULE_5__/* .searchCollectionCovers */ .Cv)(request.data?.text);
                return { success: true, data: urls };
            }
            case 'setCollectionCover': {
                const { id, cover } = request.data || {};
                if (typeof id !== 'number' || typeof cover !== 'string' || !/^https:\/\//.test(cover)) {
                    return { success: false, error: 'Invalid cover request' };
                }
                const updatedCollection = await (0,_raindropApi__WEBPACK_IMPORTED_MODULE_5__/* .updateCollection */ .IX)(id, { cover: [cover] });
                return { success: true, data: updatedCollection };
            }
            case 'getFolderMappings':
                const { getFolderMappings } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 105));
                const mappings = await getFolderMappings();
                return { success: true, data: mappings };
            case 'addFolderMapping':
                const { addFolderMapping } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 105));
                const addedMappings = await addFolderMapping(request.data);
                return { success: true, data: addedMappings };
            case 'removeFolderMapping':
                const { removeFolderMapping, disableAutoSyncIfNoMappings } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 105));
                await removeFolderMapping(request.data);
                // No mappings left → nothing to sync: force auto-sync off and tear down
                // the auto-sync services (task 012), mirroring the disable path in
                // updateSettings so the periodic alarm/listeners don't run against nothing.
                if (await disableAutoSyncIfNoMappings()) {
                    (0,_bookmarkListeners__WEBPACK_IMPORTED_MODULE_3__/* .unregisterBookmarkListeners */ .WI)();
                    await webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().alarms.clear('raindrop-sync-interval');
                }
                return { success: true };
            case 'syncFolderWithChildren':
                const syncData = request.data;
                const childMappings = await (0,_syncManager__WEBPACK_IMPORTED_MODULE_4__/* .syncFolderWithChildren */ .vr)(syncData.firefoxFolderId, syncData.raindropParentId);
                return { success: true, data: childMappings };
            // ==================== Sync ====================
            case 'getSyncStatus':
                const status = await (0,_syncManager__WEBPACK_IMPORTED_MODULE_4__/* .getSyncStatus */ .KZ)();
                return { success: true, data: status };
            case 'triggerSync':
                // One unified three-way reconcile (task 014): deletion propagation,
                // tree reconciliation, per-object direction and union of never-synced
                // mappings all happen inside reconcileAllMappings.
                _utils_logger__WEBPACK_IMPORTED_MODULE_1__/* .logger */ .v.info('Manual sync triggered');
                try {
                    const r = await (0,_syncManager__WEBPACK_IMPORTED_MODULE_4__.reconcileAllMappings)();
                    // Get updated stats and status
                    const { getSyncStats } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 105));
                    const updatedStats = await getSyncStats();
                    const updatedStatus = await (0,_syncManager__WEBPACK_IMPORTED_MODULE_4__/* .getSyncStatus */ .KZ)();
                    return {
                        success: true,
                        data: {
                            // UI-compatible shape (popup/options read push/pull counts)
                            push: {
                                created: r.createdInRaindrop,
                                updated: r.pushed,
                                deleted: r.deletedInRaindrop,
                                errors: r.errors,
                            },
                            pull: {
                                created: r.createdInBrowser + r.adopted,
                                updated: r.pulled,
                                deleted: r.deletedInBrowser,
                                errors: [],
                            },
                            stats: updatedStats,
                            status: updatedStatus,
                        },
                    };
                }
                catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                    _utils_logger__WEBPACK_IMPORTED_MODULE_1__/* .logger */ .v.error('Sync failed', error);
                    return { success: false, error: errorMessage };
                }
            case 'performInitialSync':
                const mapping = request.data;
                const initialResult = await (0,_syncManager__WEBPACK_IMPORTED_MODULE_4__/* .performInitialSync */ .Zo)(mapping);
                return { success: true, data: initialResult };
            case 'performFullResync':
                const fullResult = await (0,_syncManager__WEBPACK_IMPORTED_MODULE_4__/* .performFullResync */ .Hd)();
                return { success: true, data: fullResult };
            // ==================== Firefox Bookmarks ====================
            case 'getFirefoxBookmarkTree':
                const tree = await webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().bookmarks.getTree();
                return { success: true, data: tree };
            case 'getFirefoxFolder':
                const folderId = request.data;
                const folder = await webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().bookmarks.getSubTree(folderId);
                return { success: true, data: folder };
            case 'createBrowserFolder': {
                const title = typeof request.data?.title === 'string' ? request.data.title.trim() : '';
                const parentId = request.data?.parentId || '1'; // Chrome bookmark bar by default
                if (!title) {
                    return { success: false, error: 'Folder name is required' };
                }
                const createdFolder = await webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().bookmarks.create({ parentId, title });
                return { success: true, data: createdFolder };
            }
            // ==================== Stats ====================
            case 'getSyncStats':
                const { getSyncStats } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 105));
                const stats = await getSyncStats();
                return { success: true, data: stats };
            case 'getSyncErrors':
                const { getSyncErrors } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 105));
                const syncErrors = await getSyncErrors();
                return { success: true, data: syncErrors };
            // ==================== Debug ====================
            case 'exportData':
                const { exportData } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 105));
                const exportedData = await exportData();
                return { success: true, data: exportedData };
            case 'getLogHistory':
                return { success: true, data: _utils_logger__WEBPACK_IMPORTED_MODULE_1__/* .logger */ .v.getHistory() };
            default:
                return { success: false, error: `Unknown action: ${request.action}` };
        }
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        _utils_logger__WEBPACK_IMPORTED_MODULE_1__/* .logger */ .v.error(`Message handler error: ${request.action}`, error);
        return { success: false, error: errorMessage };
    }
}
// ==================== Event Listeners ====================
// Message listener for popup and options page
webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().runtime.onMessage.addListener((request) => {
    // Returning a Promise is supported by webextension-polyfill 
    // and is the recommended way to handle async messages in MV3.
    return handleMessage(request);
});
// Alarm listener for the periodic reconcile.
// MUST return a Promise so Chrome MV3 keeps the Service Worker alive
// until the async work completes.
webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().alarms.onAlarm.addListener((alarm) => (0,_syncManager__WEBPACK_IMPORTED_MODULE_4__/* .handleSyncAlarm */ .tm)(alarm));
// Installation/update listener
webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        _utils_logger__WEBPACK_IMPORTED_MODULE_1__/* .logger */ .v.info('Extension installed');
        // Open options page on first install
        webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().runtime.openOptionsPage();
    }
    else if (details.reason === 'update') {
        _utils_logger__WEBPACK_IMPORTED_MODULE_1__/* .logger */ .v.info(`Extension updated to version ${webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().runtime.getManifest().version}`);
        // Migration: the operation queue was removed in 014. Clear its leftover
        // 1-minute alarm so an upgraded install stops firing a now-ignored event.
        void webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().alarms.clear('process-queue');
    }
});
// Startup listener
webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().runtime.onStartup.addListener(() => {
    _utils_logger__WEBPACK_IMPORTED_MODULE_1__/* .logger */ .v.info('Browser started');
    initialize();
});
// ==================== Start ====================
// Register listeners at top level for MV3 compatibility
(0,_bookmarkListeners__WEBPACK_IMPORTED_MODULE_3__/* .registerBookmarkListeners */ .tW)();
// Initialize on script load
initialize();

})();

/******/ })()
;
//# sourceMappingURL=background.js.map
