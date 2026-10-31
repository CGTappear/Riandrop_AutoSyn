/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

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
};
const DEFAULT_SYNC_STATS = {
    totalSynced: 0,
    lastSyncTime: 0,
    lastSyncStatus: 'never',
};

;// ./node_modules/nanoid/url-alphabet/index.js
const urlAlphabet =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'

;// ./node_modules/nanoid/index.browser.js
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
    id += urlAlphabet[bytes[size] & 63]
  }
  return id
}

;// ./src/utils/hash.ts
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
    return nanoid();
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

;// ./src/utils/bookmarkNode.ts
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
 * Unified bookmark detection: Firefox sets `type: 'bookmark'`, Chrome
 * often omits `type` — so a bookmark is "has a URL and type is either
 * 'bookmark' or absent".
 */
function isBookmarkNode(node) {
    return !!node.url && (node.type === 'bookmark' || node.type === undefined);
}

;// ./src/options/liveRefresh.ts
// Live-refresh helpers for the Options page.
//
// The Options page is otherwise passive: it reads storage only in initialize()
// and after its own actions, so external changes (background sync alarm, folder
// deletion cascade, popup, a second tab) leave it stale. These pure helpers
// decide what to re-render in response to a storage.onChanged event; the DOM
// wiring lives in options.ts. Kept DOM-free so it is unit-testable under the
// node test environment.

/**
 * Map a storage.onChanged `changes` object to the Options sections that must be
 * re-rendered. `bookmark_links` and `api_token` intentionally trigger nothing —
 * they are not surfaced in this UI.
 */
function storageChangeReloads(changes) {
    return {
        mappings: STORAGE_KEYS.FOLDER_MAPPINGS in changes,
        settings: STORAGE_KEYS.SYNC_SETTINGS in changes,
        stats: STORAGE_KEYS.SYNC_STATS in changes,
        errors: STORAGE_KEYS.SYNC_ERRORS in changes,
    };
}

;// ./src/options/options.ts
// Options Page Script





// Send message to background script
async function sendMessage(action, data) {
    return browser_polyfill_default().runtime.sendMessage({ action, data });
}
// DOM Elements
const connectionStatus = document.getElementById('connection-status');
const apiTokenInput = document.getElementById('api-token');
const saveTokenBtn = document.getElementById('save-token-btn');
const disconnectBtn = document.getElementById('disconnect-btn');
const chromeTreeEl = document.getElementById('chrome-tree');
const raindropTreeEl = document.getElementById('raindrop-tree');
const chromeCheckedCount = document.getElementById('chrome-checked-count');
const raindropCheckedCount = document.getElementById('raindrop-checked-count');
const includeSubfoldersBox = document.getElementById('include-subfolders');
const conflictStrategySelect = document.getElementById('conflict-strategy');
const addMappingBtn = document.getElementById('add-mapping-btn');
const removeSelectedBtn = document.getElementById('remove-selected-btn');
const refreshTreesBtn = document.getElementById('refresh-trees-btn');
const autoMatchBtn = document.getElementById('auto-match-btn');
const autoIconBtn = document.getElementById('auto-icon-btn');
const mappingsTbody = document.getElementById('mappings-tbody');
const selectAllMappings = document.getElementById('select-all-mappings');
const appDialog = document.getElementById('app-dialog');
const dialogTitle = document.getElementById('dialog-title');
const dialogBody = document.getElementById('dialog-body');
const dialogOk = document.getElementById('dialog-ok');
const dialogCancel = document.getElementById('dialog-cancel');
const enableSyncToggle = document.getElementById('enable-sync');
const syncIntervalSelect = document.getElementById('sync-interval');
const debugModeToggle = document.getElementById('debug-mode');
const statTotal = document.getElementById('stat-total');
const statLastSync = document.getElementById('stat-last-sync');
const syncNowBtn = document.getElementById('sync-now-btn');
const fullResyncBtn = document.getElementById('full-resync-btn');
const syncStatusMsg = document.getElementById('sync-status-msg');
const syncErrorsList = document.getElementById('sync-errors-list');
const versionEl = document.getElementById('version');
// State
let isConnected = false;
let firefoxFolders = [];
let raindropCollections = [];
let currentMappings = [];
// Initialize
async function initialize() {
    const manifest = browser_polyfill_default().runtime.getManifest();
    versionEl.textContent = manifest.version;
    await checkConnection();
    await loadSettings();
    await loadStats();
    await loadSyncErrors();
    // Mappings are shown even while disconnected (read-only) — they live in
    // local storage and carry their own display names, so no token is needed.
    await loadMappings();
    if (isConnected) {
        await loadFirefoxFolders();
        await loadRaindropCollections();
    }
    setupEventListeners();
    setupLiveRefresh();
}
// Keep the page in sync with external state changes so it never goes stale
// while left open (background sync alarm, folder-deletion cascade, popup, or a
// second tab). Two independent sources of staleness:
//   1. storage.local — mappings list, settings, stats.
//   2. the browser bookmark tree — the "Firefox folder" picker (not in storage,
//      so storage.onChanged can't see it; needs bookmarks events).
let folderReloadTimer;
function scheduleFolderReload() {
    // The picker is only populated while connected; skip otherwise.
    if (!isConnected)
        return;
    if (folderReloadTimer)
        clearTimeout(folderReloadTimer);
    // Debounce: a single sync fires many bookmark events in a burst.
    folderReloadTimer = setTimeout(() => {
        void loadFirefoxFolders();
    }, 400);
}
// storage.onChanged can fire in bursts: one sync writes `lastSync` per mapping
// (N writes) plus a stats write, so a large tree would trigger N unthrottled
// loadMappings()/loadStats() message round-trips to the background SW. Coalesce
// the pending sections and reload once per burst.
let storageReloadTimer;
const pendingReload = { mappings: false, settings: false, stats: false, errors: false };
function scheduleStorageReload(plan) {
    pendingReload.mappings || (pendingReload.mappings = plan.mappings);
    pendingReload.settings || (pendingReload.settings = plan.settings);
    pendingReload.stats || (pendingReload.stats = plan.stats);
    pendingReload.errors || (pendingReload.errors = plan.errors);
    if (!pendingReload.mappings &&
        !pendingReload.settings &&
        !pendingReload.stats &&
        !pendingReload.errors) {
        return;
    }
    if (storageReloadTimer)
        clearTimeout(storageReloadTimer);
    storageReloadTimer = setTimeout(() => {
        if (pendingReload.mappings)
            void loadMappings();
        if (pendingReload.settings)
            void loadSettings();
        if (pendingReload.stats)
            void loadStats();
        if (pendingReload.errors)
            void loadSyncErrors();
        pendingReload.mappings = false;
        pendingReload.settings = false;
        pendingReload.stats = false;
        pendingReload.errors = false;
    }, 300);
}
function setupLiveRefresh() {
    browser_polyfill_default().storage.onChanged.addListener((changes, areaName) => {
        if (areaName !== 'local')
            return;
        scheduleStorageReload(storageChangeReloads(changes));
    });
    browser_polyfill_default().bookmarks.onCreated.addListener(scheduleFolderReload);
    browser_polyfill_default().bookmarks.onRemoved.addListener(scheduleFolderReload);
    browser_polyfill_default().bookmarks.onChanged.addListener(scheduleFolderReload);
    browser_polyfill_default().bookmarks.onMoved.addListener(scheduleFolderReload);
}
// Check connection status by verifying the token works
async function checkConnection() {
    try {
        const authResponse = await sendMessage('isAuthenticated');
        if (authResponse.success && authResponse.data) {
            // Token exists, verify it works by fetching user
            const userResponse = await sendMessage('getUser');
            if (userResponse.success && userResponse.data) {
                const user = userResponse.data;
                showConnectedState(user.fullName);
                return;
            }
        }
        showDisconnectedState();
    }
    catch (error) {
        console.error('Failed to check connection:', error);
        showDisconnectedState();
    }
}
function showConnectedState(userName) {
    isConnected = true;
    const statusIndicator = connectionStatus.querySelector('.status-indicator');
    const statusText = connectionStatus.querySelector('.status-text');
    statusIndicator.classList.remove('disconnected');
    statusIndicator.classList.add('connected');
    statusText.textContent = userName ? `已连接：${userName}` : '已连接';
    apiTokenInput.placeholder = '令牌已保存（输入新令牌可替换）';
    apiTokenInput.value = '';
    saveTokenBtn.textContent = '更新令牌';
    disconnectBtn.classList.remove('hidden');
    renderMappings(); // re-render so Remove buttons reflect the new mode (also re-gates)
}
// Gate controls by BOTH a working connection and having something to sync.
// Adding the first mapping needs only a connection (task 007). Everything that
// actually syncs — the Enable Sync toggle, the interval, and all Actions —
// also needs at least one mapping: no mapping, no sync (task 012). Debug Mode
// stays free (local logging, useful while troubleshooting).
function refreshControlGating() {
    const canManage = isConnected; // add the first mapping
    const canSync = isConnected && currentMappings.length > 0;
    addMappingBtn.disabled = !canManage;
    autoMatchBtn.disabled = !canManage;
    refreshTreesBtn.disabled = !canManage;
    autoIconBtn.disabled = !canManage;
    removeSelectedBtn.disabled = !canManage || selectedMappingIds.size === 0;
    enableSyncToggle.disabled = !canSync;
    syncIntervalSelect.disabled = !canSync;
    syncNowBtn.disabled = !canSync;
    fullResyncBtn.disabled = !canSync;
    // With nothing to sync the toggle must read OFF, never a stuck "on but
    // greyed" (the background also forces enabled=false when the last mapping
    // goes, so this just mirrors that state).
    if (!canSync)
        enableSyncToggle.checked = false;
}
// Non-blocking inline feedback near the action buttons. This is the ONLY way
// the options page tells the user anything — we never use alert()/confirm(),
// which throw a blocking "The extension … says" modal (see armConfirm for the
// destructive-action replacement).
let toastTimer;
function showToast(message, isError = false) {
    syncStatusMsg.textContent = message;
    syncStatusMsg.classList.toggle('is-error', isError);
    if (toastTimer)
        clearTimeout(toastTimer);
    // Errors linger longer; a plain "nothing to sync" fades quickly.
    toastTimer = setTimeout(() => {
        syncStatusMsg.textContent = '';
        syncStatusMsg.classList.remove('is-error');
    }, isError ? 12000 : 6000);
}
// Non-blocking replacement for confirm() on destructive actions. First click
// arms the button (swaps its label to `confirmText` for ~3s); a second click
// within that window runs `action`. No modal, but a stray single click can't
// destroy anything.
const armTimers = new Map();
function armConfirm(btn, confirmText, action) {
    const existing = armTimers.get(btn);
    if (existing) {
        // Second click within the window → confirmed.
        clearTimeout(existing);
        armTimers.delete(btn);
        btn.classList.remove('confirming');
        btn.textContent = btn.dataset.armLabel ?? btn.textContent;
        delete btn.dataset.armLabel;
        void action();
        return;
    }
    // First click → arm.
    btn.dataset.armLabel = btn.textContent ?? '';
    btn.textContent = confirmText;
    btn.classList.add('confirming');
    const timer = setTimeout(() => {
        armTimers.delete(btn);
        btn.classList.remove('confirming');
        btn.textContent = btn.dataset.armLabel ?? '';
        delete btn.dataset.armLabel;
    }, 3000);
    armTimers.set(btn, timer);
}
// Honest "Sync Now" summary from the triggerSync result — real counts, not a
// blanket "completed successfully" that lies when nothing happened (task 007).
function summarizeSync(data) {
    const d = (data ?? {});
    const push = d.push ?? {};
    const pull = d.pull ?? {};
    const pulled = pull.created ?? 0;
    const pushed = push.created ?? 0;
    const updated = (push.updated ?? 0) + (pull.updated ?? 0);
    // push.deleted = browser deletions propagated to Raindrop;
    // pull.deleted = raindrop deletions propagated to the browser.
    const removed = (push.deleted ?? 0) + (pull.deleted ?? 0);
    const errors = [...(push.errors ?? []), ...(pull.errors ?? [])];
    const parts = [];
    if (pulled)
        parts.push(`↓ 已拉取 ${pulled} 条`);
    if (pushed)
        parts.push(`↑ 已推送 ${pushed} 条`);
    if (updated)
        parts.push(`已更新 ${updated} 条`);
    if (removed)
        parts.push(`已删除 ${removed} 条`);
    const summary = parts.length
        ? `同步完成：${parts.join('，')}。`
        : '已是最新状态，无需同步。';
    return errors.length
        ? `${summary}\n\n错误 ${errors.length} 项：\n${errors.slice(0, 10).join('\n')}`
        : summary;
}
function showDisconnectedState() {
    isConnected = false;
    const statusIndicator = connectionStatus.querySelector('.status-indicator');
    const statusText = connectionStatus.querySelector('.status-text');
    statusIndicator.classList.remove('connected');
    statusIndicator.classList.add('disconnected');
    statusText.textContent = '未连接';
    apiTokenInput.placeholder = '在此粘贴测试令牌…';
    saveTokenBtn.textContent = '保存并连接';
    disconnectBtn.classList.add('hidden');
    // Disconnect is a blank slate (task 011): the background wiped all mappings,
    // links and settings. Reflect that immediately — drop the in-memory mappings
    // and reset the sync toggle so the UI never shows phantom mappings or a
    // stuck "enabled" against no connection.
    currentMappings = [];
    enableSyncToggle.checked = false;
    syncIntervalSelect.value = DEFAULT_SYNC_SETTINGS.syncInterval.toString();
    chromeById = new Map();
    collById = new Map();
    renderMappings();
    renderChromeTree();
    renderRaindropTree();
}
// Load settings
async function loadSettings() {
    try {
        const response = await sendMessage('getSettings');
        if (response.success && response.data) {
            const settings = response.data;
            enableSyncToggle.checked = settings.enabled;
            syncIntervalSelect.value = settings.syncInterval.toString();
            const previousDefault = defaultStrategy;
            defaultStrategy = STRATEGY_LABELS[settings.authority] ? settings.authority : 'raindrop';
            if (previousDefault !== defaultStrategy)
                renderMappings();
            debugModeToggle.checked = settings.debugMode;
            // Re-gate: a settings-only live reload must not leave the toggle "on"
            // (or enabled) when there are no mappings to sync (task 012).
            refreshControlGating();
        }
    }
    catch (error) {
        console.error('Failed to load settings:', error);
    }
}
// Load stats
async function loadStats() {
    try {
        const response = await sendMessage('getSyncStats');
        if (response.success && response.data) {
            const stats = response.data;
            statTotal.textContent = stats.totalSynced.toString();
            statLastSync.textContent = stats.lastSyncTime > 0
                ? formatDate(stats.lastSyncTime)
                : '从未';
        }
    }
    catch (error) {
        console.error('Failed to load stats:', error);
    }
}
// Load and render the sync errors panel (task 015). Reconcile replaces the
// stored set wholesale each pass, so this only ever shows the current pass's
// errors — a clean pass (e.g. a successful re-sync) clears the panel.
async function loadSyncErrors() {
    try {
        const response = await sendMessage('getSyncErrors');
        if (!response.success)
            return;
        const errors = response.data ?? [];
        if (errors.length === 0) {
            syncErrorsList.innerHTML = '<p class="empty-state">没有错误</p>';
            return;
        }
        syncErrorsList.innerHTML = errors
            .map((e) => `
      <div class="sync-error-item">
        <span class="sync-error-type">${escapeHtml(e.type)}</span>
        <span class="sync-error-message">${escapeHtml(e.message)}</span>
      </div>
    `)
            .join('');
    }
    catch (error) {
        console.error('Failed to load sync errors:', error);
    }
}
// ==================== Two-tree mapping UI ====================
// Left: Chrome bookmark folders; right: Raindrop collections. Both are
// checkable trees. The table below lists root mappings; clicking a row locates
// both ends in the trees. All state lives in memory and survives re-renders.
const STRATEGY_LABELS = {
    skip: '保留双方 / 跳过冲突',
    chrome: 'Chrome 优先',
    raindrop: 'Raindrop 优先',
    newest: '最新修改优先',
};
const ROOT_FOLDER_NAMES = {
    '1': '书签栏',
    '2': '其他书签',
    '3': '移动设备书签',
    'toolbar_____': '书签栏',
    'unfiled_____': '其他书签',
    'mobile______': '移动设备书签',
};
const ROOT_CONTAINER_IDS = new Set(Object.keys(ROOT_FOLDER_NAMES));
let defaultStrategy = 'raindrop'; // legacy global setting, used by old mappings
let chromeById = new Map(); // id -> { id, name, parentId, children: [ids], isRoot }
let chromeRootIds = [];
let collById = new Map(); // _id -> collection
let collChildren = new Map(); // parent _id|null -> [collections]
const checkedChrome = new Set();
const checkedRaindrop = new Set();
const expandedChrome = new Set(['1', '2', 'toolbar_____', 'unfiled_____']);
const expandedRaindrop = new Set();
const selectedMappingIds = new Set();
function safeStorageGet(key) {
    try {
        return window.localStorage.getItem(key);
    }
    catch {
        return null;
    }
}
function safeStorageSet(key, value) {
    try {
        window.localStorage.setItem(key, value);
    }
    catch {
        // per-viewer convenience only
    }
}
function normalizeName(s) {
    return (s || '').trim().toLowerCase().replace(/\s+/g, ' ');
}
function strategyOfMapping(mapping) {
    return STRATEGY_LABELS[mapping.conflictStrategy] ? mapping.conflictStrategy : defaultStrategy;
}
// ---------- Data indexes ----------
function indexChromeTree(tree) {
    chromeById = new Map();
    chromeRootIds = [];
    const visit = (node, parentId, isRoot) => {
        if (!isFolderNode(node))
            return;
        const name = (node.title && node.title.trim()) || ROOT_FOLDER_NAMES[node.id] || '未命名文件夹';
        const entry = { id: node.id, name, parentId, children: [], isRoot };
        chromeById.set(node.id, entry);
        for (const child of node.children || []) {
            if (isFolderNode(child)) {
                entry.children.push(child.id);
                visit(child, node.id, false);
            }
        }
    };
    for (const top of tree) {
        // Skip the virtual root (id "0" / "root________"); its children are the
        // bookmark bar / other bookmarks / mobile containers.
        for (const container of top.children || []) {
            if (!isFolderNode(container))
                continue;
            chromeRootIds.push(container.id);
            visit(container, null, true);
        }
    }
    firefoxFolders = [...chromeById.values()].map((f) => ({ id: f.id, title: f.name }));
}
function indexCollections(collections) {
    raindropCollections = collections;
    collById = new Map(collections.map((c) => [c._id, c]));
    collChildren = new Map();
    for (const c of collections) {
        let parent = c.parent?.$id ?? null;
        if (parent !== null && !collById.has(parent))
            parent = null; // orphan → show at root
        if (!collChildren.has(parent))
            collChildren.set(parent, []);
        collChildren.get(parent).push(c);
    }
    for (const list of collChildren.values()) {
        list.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0) || a.title.localeCompare(b.title));
    }
}
// Path helpers. Chrome paths exclude nothing (root container shown greyed in
// the table); relative paths (for name matching) drop the root container.
function chromePath(id) {
    const names = [];
    let cur = chromeById.get(id);
    for (let i = 0; cur && i < 64; i++) {
        names.unshift(cur.name);
        cur = cur.parentId ? chromeById.get(cur.parentId) : null;
    }
    return names;
}
function chromeAncestors(id) {
    const out = [];
    let cur = chromeById.get(id);
    for (let i = 0; cur && cur.parentId && i < 64; i++) {
        out.push(cur.parentId);
        cur = chromeById.get(cur.parentId);
    }
    return out;
}
function collPath(id) {
    const names = [];
    let cur = collById.get(id);
    const seen = new Set();
    while (cur && !seen.has(cur._id)) {
        seen.add(cur._id);
        names.unshift(cur.title);
        const parent = cur.parent?.$id;
        cur = parent != null ? collById.get(parent) : null;
    }
    return names;
}
function collAncestors(id) {
    const out = [];
    let cur = collById.get(id);
    const seen = new Set();
    while (cur && cur.parent?.$id != null && !seen.has(cur._id)) {
        seen.add(cur._id);
        out.push(cur.parent.$id);
        cur = collById.get(cur.parent.$id);
    }
    return out;
}
// Mapping lookups (all mappings, including the auto-created child mappings).
function mappingIndexes() {
    const byFolder = new Map();
    const byColl = new Map();
    const byId = new Map();
    for (const m of currentMappings) {
        byFolder.set(m.firefoxFolderId, m);
        byColl.set(m.raindropCollectionId, m);
        byId.set(m.id, m);
    }
    const rootOf = (m) => {
        let cur = m;
        for (let i = 0; i < 64 && cur?.parentMappingId && byId.has(cur.parentMappingId); i++)
            cur = byId.get(cur.parentMappingId);
        return cur;
    };
    return { byFolder, byColl, rootOf };
}
// A folder/collection is "covered" when an ancestor is mapped with
// "include all subfolders" — it already syncs as part of that subtree.
function coveringMappingForFolder(id, idx) {
    for (const anc of chromeAncestors(id)) {
        const m = idx.byFolder.get(anc);
        if (m && idx.rootOf(m).includeSubfolders !== false)
            return idx.rootOf(m);
    }
    return null;
}
function coveringMappingForColl(id, idx) {
    for (const anc of collAncestors(id)) {
        const m = idx.byColl.get(anc);
        if (m && idx.rootOf(m).includeSubfolders !== false)
            return idx.rootOf(m);
    }
    return null;
}
// ---------- Tree rendering ----------
function renderTreeInto(container, rootKeys, describe, expanded, checked) {
    const build = (key) => {
        const d = describe(key);
        const li = document.createElement('li');
        li.dataset.key = String(key);
        const hasChildren = d.children.length > 0;
        if (hasChildren && !expanded.has(key))
            li.classList.add('collapsed');
        const row = document.createElement('div');
        row.className = 'tree-row' + (d.mapped ? ' is-mapped' : '') + (d.covered ? ' is-covered' : '');
        row.setAttribute('role', 'treeitem');
        const caret = document.createElement('button');
        caret.type = 'button';
        caret.className = 'tree-caret' + (hasChildren ? '' : ' is-leaf');
        caret.textContent = hasChildren && !expanded.has(key) ? '▶' : '▼';
        caret.setAttribute('aria-label', '展开/折叠');
        caret.addEventListener('click', () => {
            const collapsed = li.classList.toggle('collapsed');
            caret.textContent = collapsed ? '▶' : '▼';
            if (collapsed)
                expanded.delete(key);
            else
                expanded.add(key);
        });
        const label = document.createElement('label');
        label.className = 'tree-label';
        label.style.display = 'contents';
        const box = document.createElement('input');
        box.type = 'checkbox';
        box.checked = checked.has(key);
        box.addEventListener('change', () => {
            if (box.checked)
                checked.add(key);
            else
                checked.delete(key);
            updateCheckedCounts();
        });
        const icon = document.createElement('span');
        icon.className = 'tree-icon';
        if (d.iconUrl) {
            const img = document.createElement('img');
            img.src = d.iconUrl;
            img.alt = '';
            img.referrerPolicy = 'no-referrer';
            img.addEventListener('error', () => { icon.textContent = '📁'; img.remove(); });
            icon.appendChild(img);
        }
        else {
            icon.textContent = '📁';
        }
        const name = document.createElement('span');
        name.className = 'tree-name';
        name.textContent = d.name;
        name.title = d.name;
        label.append(box, icon, name);
        row.append(caret, label);
        if (d.badge) {
            const badge = document.createElement('span');
            badge.className = 'tree-badge' + (d.badgeMuted ? ' muted' : '');
            badge.textContent = d.badge;
            badge.title = d.badgeTitle || '';
            row.appendChild(badge);
        }
        if (d.meta) {
            const meta = document.createElement('span');
            meta.className = 'tree-meta';
            meta.textContent = d.meta;
            row.appendChild(meta);
        }
        li.appendChild(row);
        if (hasChildren) {
            const ul = document.createElement('ul');
            ul.setAttribute('role', 'group');
            for (const child of d.children)
                ul.appendChild(build(child));
            li.appendChild(ul);
        }
        return li;
    };
    const scroll = container.scrollTop;
    container.innerHTML = '';
    if (rootKeys.length === 0) {
        container.innerHTML = '<p class="empty-state">没有可显示的收藏夹</p>';
        return;
    }
    const ul = document.createElement('ul');
    for (const key of rootKeys)
        ul.appendChild(build(key));
    container.appendChild(ul);
    container.scrollTop = scroll;
}
function renderChromeTree() {
    if (!isConnected || chromeById.size === 0) {
        chromeTreeEl.innerHTML = `<p class="empty-state">${isConnected ? '正在加载…' : '连接后显示'}</p>`;
        return;
    }
    const idx = mappingIndexes();
    // Drop checks for folders that no longer exist.
    for (const id of [...checkedChrome])
        if (!chromeById.has(id))
            checkedChrome.delete(id);
    renderTreeInto(chromeTreeEl, chromeRootIds, (id) => {
        const f = chromeById.get(id);
        const m = idx.byFolder.get(id);
        const root = m ? idx.rootOf(m) : null;
        const covered = !m && coveringMappingForFolder(id, idx);
        return {
            name: f.name,
            children: f.children,
            mapped: !!m,
            covered: !!covered,
            badge: m ? (m.parentMappingId ? '随上级' : '⇄') : covered ? '随上级' : '',
            badgeMuted: !!(m?.parentMappingId) || !!covered,
            badgeTitle: m ? `已映射到 Raindrop「${m.raindropCollectionName}」${root && root !== m ? `（属于「${root.folderName}」的子收藏夹同步）` : ''}` : covered ? `随「${covered.folderName}」一起同步` : '',
        };
    }, expandedChrome, checkedChrome);
    updateCheckedCounts();
}
function renderRaindropTree() {
    if (!isConnected || collById.size === 0) {
        raindropTreeEl.innerHTML = `<p class="empty-state">${isConnected ? (collById.size === 0 ? 'Raindrop 中还没有收藏夹' : '正在加载…') : '连接后显示'}</p>`;
        return;
    }
    const idx = mappingIndexes();
    for (const id of [...checkedRaindrop])
        if (!collById.has(id))
            checkedRaindrop.delete(id);
    const roots = (collChildren.get(null) || []).map((c) => c._id);
    renderTreeInto(raindropTreeEl, roots, (id) => {
        const c = collById.get(id);
        const m = idx.byColl.get(id);
        const covered = !m && coveringMappingForColl(id, idx);
        return {
            name: c.title,
            children: (collChildren.get(id) || []).map((x) => x._id),
            iconUrl: Array.isArray(c.cover) && c.cover[0] ? c.cover[0] : '',
            mapped: !!m,
            covered: !!covered,
            badge: m ? (m.parentMappingId ? '随上级' : '⇄') : covered ? '随上级' : '',
            badgeMuted: !!(m?.parentMappingId) || !!covered,
            badgeTitle: m ? `已映射到 Chrome「${m.folderName}」` : covered ? `随「${covered.raindropCollectionName}」一起同步` : '',
            meta: typeof c.count === 'number' ? String(c.count) : '',
        };
    }, expandedRaindrop, checkedRaindrop);
    updateCheckedCounts();
}
function updateCheckedCounts() {
    chromeCheckedCount.textContent = checkedChrome.size ? `已勾选 ${checkedChrome.size}` : '';
    raindropCheckedCount.textContent = checkedRaindrop.size ? `已勾选 ${checkedRaindrop.size}` : '';
}
// Expand ancestors, highlight and scroll a node into view inside its panel.
function locateInTree(container, key, ancestors, expanded) {
    container.querySelectorAll('.tree-row.is-located').forEach((r) => r.classList.remove('is-located'));
    for (const anc of ancestors)
        expanded.add(anc);
    const li = container.querySelector(`li[data-key="${CSS.escape(String(key))}"]`);
    if (!li)
        return false;
    let cur = li.parentElement?.closest('li');
    while (cur) {
        cur.classList.remove('collapsed');
        const caret = cur.querySelector(':scope > .tree-row > .tree-caret');
        if (caret && !caret.classList.contains('is-leaf'))
            caret.textContent = '▼';
        cur = cur.parentElement?.closest('li');
    }
    const row = li.querySelector(':scope > .tree-row');
    row.classList.add('is-located');
    const top = row.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
    container.scrollTop = Math.max(0, top - container.clientHeight / 2);
    return true;
}
// ---------- Loading ----------
async function loadFirefoxFolders() {
    try {
        const response = await sendMessage('getFirefoxBookmarkTree');
        if (response.success && response.data) {
            indexChromeTree(response.data);
            renderChromeTree();
            renderMappings(); // paths in the table come from the trees
        }
    }
    catch (error) {
        console.error('Failed to load bookmark folders:', error);
    }
}
async function loadRaindropCollections() {
    try {
        const response = await sendMessage('getCollections');
        if (response.success && response.data) {
            indexCollections(response.data);
            renderRaindropTree();
            renderMappings(); // paths in the table come from the trees
        }
    }
    catch (error) {
        console.error('Failed to load Raindrop collections:', error);
    }
}
async function loadMappings() {
    try {
        const response = await sendMessage('getFolderMappings');
        if (response.success && response.data) {
            currentMappings = response.data;
            renderMappings();
            renderChromeTree();
            renderRaindropTree();
        }
    }
    catch (error) {
        console.error('Failed to load mappings:', error);
    }
}
// ---------- Mapping table ----------
function pathCellHtml(names, fallback) {
    if (!names.length)
        return escapeHtml(fallback || '（已不存在）');
    if (names.length === 1)
        return escapeHtml(names[0]);
    return `<span class="path-root">${escapeHtml(names[0])} / </span>${escapeHtml(names.slice(1).join(' / '))}`;
}
function renderMappings() {
    refreshControlGating();
    const roots = currentMappings.filter((m) => m.depth === 0 || !m.parentMappingId);
    for (const id of [...selectedMappingIds])
        if (!roots.some((m) => m.id === id))
            selectedMappingIds.delete(id);
    selectAllMappings.checked = roots.length > 0 && selectedMappingIds.size === roots.length;
    if (roots.length === 0) {
        mappingsTbody.innerHTML = '<tr class="empty-row"><td colspan="5">尚未配置映射</td></tr>';
        return;
    }
    mappingsTbody.innerHTML = roots.map((m) => {
        const strategy = strategyOfMapping(m);
        const options = Object.entries(STRATEGY_LABELS)
            .map(([value, label]) => `<option value="${value}"${value === strategy ? ' selected' : ''}>${label}</option>`)
            .join('');
        const chromeNames = chromeById.has(m.firefoxFolderId) ? chromePath(m.firefoxFolderId) : [];
        const collNames = collById.has(m.raindropCollectionId) ? collPath(m.raindropCollectionId) : [];
        const chromeTitle = chromeNames.join(' / ') || m.folderName;
        const collTitle = collNames.join(' / ') || m.raindropCollectionName;
        return `<tr data-id="${escapeHtml(m.id)}" class="${selectedMappingIds.has(m.id) ? 'is-selected' : ''}">
        <td class="col-check"><input type="checkbox" class="row-check" ${selectedMappingIds.has(m.id) ? 'checked' : ''} aria-label="选择映射"></td>
        <td title="${escapeHtml(chromeTitle)}">${pathCellHtml(chromeNames, m.folderName)}</td>
        <td title="${escapeHtml(collTitle)}">${pathCellHtml(collNames, m.raindropCollectionName)}</td>
        <td>${m.includeSubfolders === false ? '仅此收藏夹' : '含全部子收藏夹'}</td>
        <td><select class="select select-compact row-strategy"${isConnected ? '' : ' disabled'}>${options}</select></td>
      </tr>`;
    }).join('');
}
function onMappingTableClick(event) {
    const tr = event.target.closest('tr[data-id]');
    if (!tr)
        return;
    const id = tr.dataset.id;
    if (event.target.closest('select'))
        return;
    if (event.target.classList.contains('row-check')) {
        if (event.target.checked)
            selectedMappingIds.add(id);
        else
            selectedMappingIds.delete(id);
        tr.classList.toggle('is-selected', event.target.checked);
        refreshControlGating();
        return;
    }
    const m = currentMappings.find((x) => x.id === id);
    if (!m)
        return;
    const okChrome = locateInTree(chromeTreeEl, m.firefoxFolderId, chromeAncestors(m.firefoxFolderId), expandedChrome);
    const okRaindrop = locateInTree(raindropTreeEl, m.raindropCollectionId, collAncestors(m.raindropCollectionId), expandedRaindrop);
    if (!okChrome || !okRaindrop) {
        showToast(`${okChrome ? '' : 'Chrome 中找不到该文件夹。'}${okRaindrop ? '' : 'Raindrop 中找不到该收藏夹。'}可点击“刷新收藏夹树”。`, true);
    }
}
async function onMappingStrategyChange(event) {
    const select = event.target.closest('.row-strategy');
    if (!select)
        return;
    const id = select.closest('tr[data-id]')?.dataset.id;
    if (!id)
        return;
    const response = await sendMessage('updateFolderMapping', { id, updates: { conflictStrategy: select.value } });
    if (response.success) {
        showToast(`冲突策略已改为：${STRATEGY_LABELS[select.value]}（含其全部子收藏夹）`);
    }
    else {
        showToast('修改冲突策略失败：' + (response.error || '未知错误'), true);
        await loadMappings();
    }
}
// ---------- Dialog (non-blocking replacement for confirm/prompt) ----------
function openDialog({ title, body, okText = '确定', cancelText = '取消', hideCancel = false }) {
    dialogTitle.textContent = title;
    dialogBody.innerHTML = '';
    if (typeof body === 'string')
        dialogBody.innerHTML = body;
    else if (body)
        dialogBody.appendChild(body);
    dialogOk.textContent = okText;
    dialogCancel.textContent = cancelText;
    dialogCancel.classList.toggle('hidden', hideCancel);
    return new Promise((resolve) => {
        const onClose = () => {
            appDialog.removeEventListener('close', onClose);
            resolve(appDialog.returnValue === 'ok');
        };
        appDialog.returnValue = '';
        appDialog.addEventListener('close', onClose);
        appDialog.showModal();
    });
}
function pairListHtml(pairs, withChecks) {
    return `<ul class="dialog-list">${pairs.map((p, i) => `<li>
      ${withChecks ? `<input type="checkbox" data-index="${i}" checked>` : ''}
      <span>${escapeHtml(p.left)}</span><span class="arrow">⇄</span><span>${escapeHtml(p.right)}</span>
    </li>`).join('')}</ul>`;
}
// Create the mappings then run ONE sync pass for all of them (the old flow ran
// a full global pass per mapping).
async function createMappingsAndSync(pairs, includeSubfolders, conflictStrategy, busyBtn) {
    const original = busyBtn.textContent;
    busyBtn.disabled = true;
    busyBtn.textContent = '正在建立映射…';
    let created = 0;
    const errors = [];
    try {
        for (const pair of pairs) {
            try {
                let folder = pair.folder;
                let collection = pair.collection;
                if (!collection) {
                    const r = await sendMessage('createCollection', { title: folder.title });
                    if (!r.success || !r.data)
                        throw new Error(r.error || '创建 Raindrop 收藏夹失败');
                    collection = r.data;
                }
                if (!folder) {
                    const r = await sendMessage('createBrowserFolder', { parentId: '1', title: collection.title });
                    if (!r.success || !r.data)
                        throw new Error(r.error || '创建 Chrome 文件夹失败');
                    folder = { id: r.data.id, title: r.data.title };
                }
                const mapping = {
                    id: generateId(),
                    firefoxFolderId: folder.id,
                    raindropCollectionId: collection._id,
                    folderName: folder.title,
                    raindropCollectionName: collection.title,
                    depth: 0,
                    lastSync: 0,
                    includeSubfolders,
                    conflictStrategy,
                };
                const add = await sendMessage('addFolderMapping', mapping);
                if (!add.success)
                    throw new Error(add.error || '添加映射失败');
                created++;
            }
            catch (error) {
                errors.push(`${pair.label}：${error instanceof Error ? error.message : error}`);
            }
        }
        await loadMappings();
        if (created > 0) {
            busyBtn.textContent = '正在首次同步…';
            const sync = await sendMessage('triggerSync');
            if (!sync.success)
                errors.push('首次同步失败：' + (sync.error || '未知错误'));
            else
                showToast(`已建立 ${created} 个映射。${summarizeSync(sync.data)}`);
        }
        if (errors.length) {
            showToast(`已建立 ${created} 个映射，${errors.length} 项失败：\n${errors.slice(0, 8).join('\n')}`, true);
        }
        await loadMappings();
        await loadStats();
        await loadFirefoxFolders();
        await loadRaindropCollections();
    }
    finally {
        busyBtn.textContent = original;
        refreshControlGating();
    }
}
// ---------- Toolbar actions ----------
function treeOrder(ids, rootKeys, childrenOf) {
    const order = [];
    const walk = (key) => {
        order.push(key);
        for (const c of childrenOf(key))
            walk(c);
    };
    rootKeys.forEach(walk);
    const pos = new Map(order.map((k, i) => [k, i]));
    return [...ids].sort((a, b) => (pos.get(a) ?? 1e9) - (pos.get(b) ?? 1e9));
}
async function addCheckedMappings() {
    const includeSubfolders = includeSubfoldersBox.checked;
    const conflictStrategy = conflictStrategySelect.value;
    const left = treeOrder(checkedChrome, chromeRootIds, (id) => chromeById.get(id)?.children || []);
    const right = treeOrder(checkedRaindrop, (collChildren.get(null) || []).map((c) => c._id), (id) => (collChildren.get(id) || []).map((c) => c._id));
    if (!left.length && !right.length) {
        showToast('请先在上方两边勾选要映射的收藏夹', true);
        return;
    }
    if (left.length && right.length && left.length !== right.length) {
        showToast(`两边勾选数量不一致（Chrome ${left.length} 个，Raindrop ${right.length} 个）。请一一对应勾选，或只勾一边以自动新建对端。`, true);
        return;
    }
    const idx = mappingIndexes();
    const pairs = [];
    const skipped = [];
    const count = Math.max(left.length, right.length);
    for (let i = 0; i < count; i++) {
        const fid = left[i];
        const cid = right[i];
        const folder = fid ? { id: fid, title: chromeById.get(fid).name } : null;
        const coll = cid != null ? collById.get(cid) : null;
        const label = `${folder ? chromePath(fid).join(' / ') : '（新建 Chrome 文件夹）'} ⇄ ${coll ? collPath(cid).join(' / ') : '（新建 Raindrop 收藏夹）'}`;
        if (fid && idx.byFolder.has(fid)) {
            skipped.push(`${label}：Chrome 文件夹已在映射中`);
            continue;
        }
        if (cid != null && idx.byColl.has(cid)) {
            skipped.push(`${label}：Raindrop 收藏夹已在映射中`);
            continue;
        }
        const coverF = fid && coveringMappingForFolder(fid, idx);
        const coverC = cid != null && coveringMappingForColl(cid, idx);
        if (coverF || coverC) {
            skipped.push(`${label}：已随「${(coverF || coverC).folderName}」的子收藏夹同步`);
            continue;
        }
        pairs.push({
            folder, collection: coll, label,
            left: folder ? chromePath(fid).join(' / ') : `（新建）${coll.title}`,
            right: coll ? collPath(cid).join(' / ') : `（新建）${folder.title}`,
        });
    }
    if (!pairs.length) {
        showToast(`没有可建立的映射：\n${skipped.join('\n')}`, true);
        return;
    }
    const body = `<p>将建立 ${pairs.length} 个双向映射（范围：${includeSubfolders ? '含全部子收藏夹，按相对路径匹配' : '仅此收藏夹'}；冲突策略：${STRATEGY_LABELS[conflictStrategy]}）：</p>
      ${pairListHtml(pairs, false)}
      ${skipped.length ? `<p class="muted">跳过 ${skipped.length} 项：<br>${skipped.map(escapeHtml).join('<br>')}</p>` : ''}
      <p>首次同步只合并、不删除：两边缺少的书签${includeSubfolders ? '和子收藏夹' : ''}会互相补齐。</p>`;
    if (!(await openDialog({ title: '建立勾选收藏夹映射', body, okText: '建立并同步' })))
        return;
    await createMappingsAndSync(pairs, includeSubfolders, conflictStrategy, addMappingBtn);
    checkedChrome.clear();
    checkedRaindrop.clear();
    renderChromeTree();
    renderRaindropTree();
}
function removeSelectedMappings() {
    if (!selectedMappingIds.size) {
        showToast('请先在下方表格勾选要删除的映射', true);
        return;
    }
    armConfirm(removeSelectedBtn, `再次点击：删除 ${selectedMappingIds.size} 个映射`, async () => {
        let removed = 0;
        for (const id of [...selectedMappingIds]) {
            const r = await sendMessage('removeFolderMapping', id);
            if (r.success) {
                removed++;
                selectedMappingIds.delete(id);
            }
        }
        await loadMappings();
        await loadStats();
        showToast(`已删除 ${removed} 个映射。两边的书签和收藏夹都保留不动。`);
    });
}
async function refreshTrees() {
    refreshTreesBtn.disabled = true;
    try {
        await Promise.all([loadFirefoxFolders(), loadRaindropCollections(), loadMappings()]);
        showToast('收藏夹树已刷新。');
    }
    finally {
        refreshTreesBtn.disabled = !isConnected;
    }
}
// Auto-match by RELATIVE PATH (root container like 书签栏 excluded), exact,
// case-insensitive. With "include all subfolders" only the topmost matches
// become mappings — their subfolders are matched by the tree walk.
async function autoMatchMappings() {
    const includeSubfolders = includeSubfoldersBox.checked;
    const conflictStrategy = conflictStrategySelect.value;
    const idx = mappingIndexes();
    const chromeByPath = new Map();
    const dupes = [];
    for (const id of treeOrder(new Set(chromeById.keys()), chromeRootIds, (k) => chromeById.get(k)?.children || [])) {
        const f = chromeById.get(id);
        if (f.isRoot || idx.byFolder.has(id) || coveringMappingForFolder(id, idx))
            continue;
        const key = chromePath(id).slice(1).map(normalizeName).join('/');
        if (chromeByPath.has(key))
            dupes.push(chromePath(id).join(' / '));
        else
            chromeByPath.set(key, id);
    }
    const collByPath = new Map();
    for (const c of raindropCollections) {
        if (idx.byColl.has(c._id) || coveringMappingForColl(c._id, idx))
            continue;
        const key = collPath(c._id).map(normalizeName).join('/');
        if (collByPath.has(key))
            dupes.push('Raindrop：' + collPath(c._id).join(' / '));
        else
            collByPath.set(key, c._id);
    }
    let keys = [...chromeByPath.keys()].filter((k) => collByPath.has(k));
    if (includeSubfolders) {
        const keySet = new Set(keys);
        keys = keys.filter((k) => {
            const parts = k.split('/');
            for (let n = 1; n < parts.length; n++)
                if (keySet.has(parts.slice(0, n).join('/')))
                    return false;
            return true;
        });
    }
    if (!keys.length) {
        showToast('没有找到可自动匹配的同名收藏夹（已映射或已随上级同步的会被跳过）。', true);
        return;
    }
    const pairs = keys.map((k) => {
        const fid = chromeByPath.get(k);
        const cid = collByPath.get(k);
        return {
            folder: { id: fid, title: chromeById.get(fid).name },
            collection: collById.get(cid),
            label: chromePath(fid).join(' / '),
            left: chromePath(fid).join(' / '),
            right: collPath(cid).join(' / '),
        };
    });
    const matchedKeys = new Set(keys);
    const under = (k) => [...matchedKeys].some((m) => k === m || k.startsWith(m + '/'));
    const unmatchedChrome = [...chromeByPath.keys()].filter((k) => !under(k)).length;
    const unmatchedColl = [...collByPath.keys()].filter((k) => !under(k)).length;
    const wrap = document.createElement('div');
    wrap.innerHTML = `<p>按相对路径（不含“书签栏 / 其他书签”这一层）找到 ${pairs.length} 组同名收藏夹，取消勾选可排除：</p>
      ${pairListHtml(pairs, true)}
      <p>范围：${includeSubfolders ? '含全部子收藏夹。子收藏夹按相对路径继续匹配，缺少的一侧会自动新建' : '仅此收藏夹'}；冲突策略：${STRATEGY_LABELS[conflictStrategy]}。</p>
      <p class="muted">另有 Chrome ${unmatchedChrome} 个、Raindrop ${unmatchedColl} 个收藏夹没有同名对端，不会自动处理，可在上方勾选后手动建立映射。${dupes.length ? `<br>重名已跳过：${dupes.slice(0, 6).map(escapeHtml).join('、')}${dupes.length > 6 ? '…' : ''}` : ''}</p>`;
    if (!(await openDialog({ title: '按名称自动匹配全部收藏夹', body: wrap, okText: '建立并同步' })))
        return;
    const chosen = pairs.filter((_, i) => wrap.querySelector(`input[data-index="${i}"]`)?.checked);
    if (!chosen.length) {
        showToast('未选择任何映射。');
        return;
    }
    await createMappingsAndSync(chosen, includeSubfolders, conflictStrategy, autoMatchBtn);
}
// Raindrop collections can carry an icon ("cover"); Chrome folders cannot, so
// this only writes to Raindrop. Candidates come from Raindrop's icon search.
function iconSearchTerm(title) {
    return (title || '')
        .replace(/[\p{Extended_Pictographic}\u{FE0F}]/gu, '')
        .replace(/[\[\]【】()（）《》<>"'“”‘’|\\/_#@&*+=~^`]+/g, ' ')
        .trim();
}
async function autoMatchIcons() {
    const idx = mappingIndexes();
    const options = document.createElement('div');
    options.innerHTML = `<p>为 Raindrop 收藏夹搜索并设置图标（Chrome 文件夹不支持自定义图标）。</p>
      <p><label class="check-label"><input type="radio" name="icon-scope" value="mapped" checked> 只处理已映射的收藏夹（含子收藏夹）</label><br>
      <label class="check-label"><input type="radio" name="icon-scope" value="all"> 处理全部 Raindrop 收藏夹</label></p>
      <p><label class="check-label"><input type="checkbox" id="icon-overwrite"> 也替换已有图标</label></p>
      <p class="muted">图标库以英文名为主，中文名可能搜不到；搜不到的会列出来但不会修改。</p>`;
    if (!(await openDialog({ title: '自动匹配收藏夹图标', body: options, okText: '开始搜索' })))
        return;
    const scope = options.querySelector('input[name="icon-scope"]:checked').value;
    const overwrite = options.querySelector('#icon-overwrite').checked;
    const targets = raindropCollections.filter((c) => {
        if (scope === 'mapped' && !idx.byColl.has(c._id))
            return false;
        const hasCover = Array.isArray(c.cover) && c.cover[0];
        return overwrite || !hasCover;
    });
    if (!targets.length) {
        showToast('没有需要处理的收藏夹。');
        return;
    }
    const original = autoIconBtn.textContent;
    autoIconBtn.disabled = true;
    const results = [];
    try {
        for (let i = 0; i < targets.length; i++) {
            autoIconBtn.textContent = `正在搜索图标 ${i + 1}/${targets.length}…`;
            const c = targets[i];
            const term = iconSearchTerm(c.title);
            let urls = [];
            if (term) {
                const r = await sendMessage('searchCollectionCovers', { text: term });
                if (r.success && Array.isArray(r.data))
                    urls = r.data.filter((u) => /^https:\/\//.test(u)).slice(0, 5);
            }
            results.push({ c, urls, choice: 0 });
        }
    }
    finally {
        autoIconBtn.textContent = original;
        autoIconBtn.disabled = !isConnected;
    }
    const found = results.filter((r) => r.urls.length);
    const missing = results.filter((r) => !r.urls.length);
    const wrap = document.createElement('div');
    wrap.innerHTML = `<p>找到 ${found.length} 个收藏夹的候选图标（点击小图换一个，取消勾选可跳过）：</p>
      <ul class="dialog-list">${found.map((r, i) => `<li data-index="${i}">
        <input type="checkbox" checked>
        <span class="icon-choices">${r.urls.map((u, j) => `<img src="${escapeHtml(u)}" data-choice="${j}" referrerpolicy="no-referrer" alt="" style="cursor:pointer;border-radius:4px;${j === 0 ? 'outline:2px solid #0066ff' : 'opacity:.55'}">`).join(' ')}</span>
        <span>${escapeHtml(collPath(r.c._id).join(' / '))}</span>
      </li>`).join('')}</ul>
      ${missing.length ? `<p class="muted">未找到图标（不修改）：${missing.slice(0, 20).map((r) => escapeHtml(r.c.title)).join('、')}${missing.length > 20 ? '…' : ''}</p>` : ''}`;
    wrap.addEventListener('click', (e) => {
        const img = e.target.closest('img[data-choice]');
        if (!img)
            return;
        const li = img.closest('li[data-index]');
        found[Number(li.dataset.index)].choice = Number(img.dataset.choice);
        li.querySelectorAll('img[data-choice]').forEach((el) => {
            const on = el === img;
            el.style.outline = on ? '2px solid #0066ff' : '';
            el.style.opacity = on ? '1' : '.55';
        });
    });
    if (!found.length) {
        await openDialog({ title: '自动匹配收藏夹图标', body: wrap, okText: '知道了', hideCancel: true });
        return;
    }
    if (!(await openDialog({ title: '自动匹配收藏夹图标', body: wrap, okText: '应用图标' })))
        return;
    const chosen = found.filter((_, i) => wrap.querySelector(`li[data-index="${i}"] input[type="checkbox"]`)?.checked);
    autoIconBtn.disabled = true;
    let applied = 0;
    const errors = [];
    try {
        for (let i = 0; i < chosen.length; i++) {
            autoIconBtn.textContent = `正在设置图标 ${i + 1}/${chosen.length}…`;
            const r = chosen[i];
            const res = await sendMessage('setCollectionCover', { id: r.c._id, cover: r.urls[r.choice] });
            if (res.success)
                applied++;
            else
                errors.push(`${r.c.title}：${res.error || '失败'}`);
        }
    }
    finally {
        autoIconBtn.textContent = original;
        autoIconBtn.disabled = !isConnected;
    }
    await loadRaindropCollections();
    showToast(`已为 ${applied} 个收藏夹设置图标。${errors.length ? `\n失败 ${errors.length} 项：${errors.slice(0, 5).join('；')}` : ''}`, errors.length > 0);
}
// Remove mapping
async function removeMapping(mappingId) {
    try {
        const response = await sendMessage('removeFolderMapping', mappingId);
        if (response.success) {
            await loadMappings();
            await loadStats();
            showToast('映射已移除。');
        }
        else {
            showToast('移除映射失败：' + (response.error || '未知错误'), true);
        }
    }
    catch (error) {
        console.error('Failed to remove mapping:', error);
        showToast('移除映射失败', true);
    }
}
// Update settings
async function updateSettingsAction(updates) {
    try {
        await sendMessage('updateSettings', updates);
    }
    catch (error) {
        console.error('Failed to update settings:', error);
        showToast('保存设置失败', true);
    }
}
// Setup event listeners
function setupEventListeners() {
    // Save token button
    saveTokenBtn.addEventListener('click', async () => {
        const token = apiTokenInput.value.trim();
        if (!token) {
            showToast('请输入测试令牌', true);
            return;
        }
        saveTokenBtn.disabled = true;
        saveTokenBtn.textContent = '正在验证…';
        try {
            // Save the token
            const saveResponse = await sendMessage('saveApiToken', token);
            if (!saveResponse.success) {
                throw new Error(saveResponse.error || '保存令牌失败');
            }
            // Verify it works by fetching user info
            const userResponse = await sendMessage('getUser');
            if (!userResponse.success) {
                // Token is invalid, clear it
                await sendMessage('clearApiToken');
                throw new Error('令牌无效，请检查测试令牌后重试。');
            }
            const user = userResponse.data;
            showConnectedState(user.fullName);
            // Load data now that we're connected
            await loadFirefoxFolders();
            await loadRaindropCollections();
            await loadMappings();
            showToast(`已连接：${user.fullName}`);
        }
        catch (error) {
            const msg = error instanceof Error ? error.message : '连接失败';
            showToast(msg, true);
            showDisconnectedState();
        }
        finally {
            saveTokenBtn.disabled = false;
            if (isConnected) {
                saveTokenBtn.textContent = '更新令牌';
            }
            else {
                saveTokenBtn.textContent = '保存并连接';
            }
        }
    });
    // Disconnect button — two-click confirm instead of a blocking confirm().
    disconnectBtn.addEventListener('click', () => {
        armConfirm(disconnectBtn, '再次点击：断开并清除映射', async () => {
            await sendMessage('logout');
            showDisconnectedState();
            showToast('已断开连接。');
        });
    });
    // Mapping toolbar
    const savedStrategy = safeStorageGet('rd_new_mapping_strategy');
    if (savedStrategy && STRATEGY_LABELS[savedStrategy])
        conflictStrategySelect.value = savedStrategy;
    const savedInclude = safeStorageGet('rd_new_mapping_include');
    if (savedInclude !== null)
        includeSubfoldersBox.checked = savedInclude === '1';
    conflictStrategySelect.addEventListener('change', () => safeStorageSet('rd_new_mapping_strategy', conflictStrategySelect.value));
    includeSubfoldersBox.addEventListener('change', () => safeStorageSet('rd_new_mapping_include', includeSubfoldersBox.checked ? '1' : '0'));
    addMappingBtn.addEventListener('click', addCheckedMappings);
    removeSelectedBtn.addEventListener('click', removeSelectedMappings);
    refreshTreesBtn.addEventListener('click', refreshTrees);
    autoMatchBtn.addEventListener('click', autoMatchMappings);
    autoIconBtn.addEventListener('click', autoMatchIcons);
    mappingsTbody.addEventListener('click', onMappingTableClick);
    mappingsTbody.addEventListener('change', onMappingStrategyChange);
    selectAllMappings.addEventListener('change', () => {
        selectedMappingIds.clear();
        if (selectAllMappings.checked) {
            for (const m of currentMappings)
                if (m.depth === 0 || !m.parentMappingId)
                    selectedMappingIds.add(m.id);
        }
        renderMappings();
    });
    // Settings toggles
    enableSyncToggle.addEventListener('change', () => {
        updateSettingsAction({ enabled: enableSyncToggle.checked });
    });
    syncIntervalSelect.addEventListener('change', () => {
        updateSettingsAction({ syncInterval: parseInt(syncIntervalSelect.value, 10) });
    });
    debugModeToggle.addEventListener('change', () => {
        updateSettingsAction({ debugMode: debugModeToggle.checked });
    });
    // Action buttons
    syncNowBtn.addEventListener('click', async () => {
        if (!isConnected) {
            showToast('尚未连接，请先添加 Raindrop.io 测试令牌。', true);
            return;
        }
        syncNowBtn.textContent = '正在同步…';
        syncNowBtn.disabled = true;
        try {
            const response = await sendMessage('triggerSync');
            if (response.success) {
                await new Promise(resolve => setTimeout(resolve, 500));
                await loadStats();
                showToast(summarizeSync(response.data));
            }
            else {
            showToast('同步失败：' + (response.error || '未知错误'), true);
            }
        }
        catch (error) {
            console.error('Sync error:', error);
            showToast('无法触发同步', true);
        }
        finally {
            syncNowBtn.textContent = '立即同步';
            syncNowBtn.disabled = !isConnected;
            await loadStats();
        }
    });
    fullResyncBtn.addEventListener('click', () => {
        if (!isConnected) {
            showToast('尚未连接，请先添加 Raindrop.io 测试令牌。', true);
            return;
        }
        // Two-click confirm: this resyncs every mapped folder.
        armConfirm(fullResyncBtn, '再次点击：重新同步全部内容', async () => {
        fullResyncBtn.textContent = '正在重新同步…';
            fullResyncBtn.disabled = true;
            try {
                const response = await sendMessage('performFullResync');
                if (response.success) {
                    showToast('完整重新同步已完成。');
                }
                else {
                    showToast('完整重新同步失败：' + response.error, true);
                }
                await loadStats();
            }
            catch (error) {
                showToast('无法执行完整重新同步', true);
            }
            finally {
                fullResyncBtn.textContent = '完整重新同步';
                fullResyncBtn.disabled = !isConnected;
            }
        });
    });
}
// Utility functions
function formatDate(timestamp) {
    return new Date(timestamp).toLocaleString('zh-CN');
}
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initialize);

})();

/******/ })()
;
//# sourceMappingURL=options.js.map
