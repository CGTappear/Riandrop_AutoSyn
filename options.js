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
const firefoxFolderSelect = document.getElementById('firefox-folder');
const raindropCollectionSelect = document.getElementById('raindrop-collection');
const addMappingBtn = document.getElementById('add-mapping-btn');
const mappingsList = document.getElementById('mappings-list');
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
    renderMappings();
}
// Load settings
async function loadSettings() {
    try {
        const response = await sendMessage('getSettings');
        if (response.success && response.data) {
            const settings = response.data;
            enableSyncToggle.checked = settings.enabled;
            syncIntervalSelect.value = settings.syncInterval.toString();
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
// Load Firefox folders
async function loadFirefoxFolders() {
    try {
        const response = await sendMessage('getFirefoxBookmarkTree');
        if (response.success && response.data) {
            const tree = response.data;
            firefoxFolders = [];
            firefoxFolderSelect.innerHTML = '<option value="">请选择文件夹…</option>';
            // In-order DFS so options read top-to-bottom as the real tree. Indent
            // with non-breaking spaces (regular leading spaces get collapsed in
            // <option>). Keep the stored node's title CLEAN — addMapping derives
            // folderName from it and .trim() would not strip a nbsp prefix.
            function collectFolders(node, depth = 0) {
                const isRoot = node.id === '0' || node.id === 'root________';
                if (isFolderNode(node)) {
                    if (!isRoot && node.title) {
                        firefoxFolders.push(node);
                        const option = document.createElement('option');
                        option.value = node.id;
                        const indent = '\u00A0\u00A0\u00A0\u00A0'.repeat(Math.max(0, depth - 1));
                        const prefix = depth > 1 ? '\u21B3 ' : '';
                        option.textContent = indent + prefix + node.title;
                        firefoxFolderSelect.appendChild(option);
                    }
                    if (node.children) {
                        for (const child of node.children) {
                            collectFolders(child, depth + 1);
                        }
                    }
                }
            }
            for (const root of tree) {
                collectFolders(root, 0);
            }
        }
    }
    catch (error) {
        console.error('Failed to load Firefox folders:', error);
    }
}
// Load Raindrop collections
async function loadRaindropCollections() {
    try {
        const response = await sendMessage('getCollections');
        if (response.success && response.data) {
            raindropCollections = response.data;
            raindropCollectionSelect.innerHTML = '<option value="">请选择分组…</option>';
            const createOption = document.createElement('option');
            createOption.value = 'new';
            createOption.textContent = '+ 新建分组';
            raindropCollectionSelect.appendChild(createOption);
            // Render the collection tree in depth order (DFS), indented per level so
            // nesting is visible. Regular leading spaces collapse in <option>, so
            // indent with non-breaking spaces.
            const byTitle = (a, b) => a.title.localeCompare(b.title);
            const childrenOf = (parentId) => raindropCollections
                .filter((c) => (c.parent?.$id ?? null) === parentId)
                .sort(byTitle);
            const seen = new Set();
            const appendCollection = (collection, depth) => {
                if (seen.has(collection._id))
                    return; // guard against cyclic parent refs
                seen.add(collection._id);
                const option = document.createElement('option');
                option.value = collection._id.toString();
                const indent = '\u00A0\u00A0\u00A0\u00A0'.repeat(depth);
                const prefix = depth > 0 ? '\u21B3 ' : '';
                option.textContent = indent + prefix + collection.title;
                raindropCollectionSelect.appendChild(option);
                for (const child of childrenOf(collection._id)) {
                    appendCollection(child, depth + 1);
                }
            };
            for (const root of childrenOf(null)) {
                appendCollection(root, 0);
            }
            // Orphans (parent not in the returned set) — show at root level, not lost.
            for (const collection of raindropCollections.slice().sort(byTitle)) {
                if (!seen.has(collection._id))
                    appendCollection(collection, 0);
            }
        }
    }
    catch (error) {
        console.error('Failed to load Raindrop collections:', error);
    }
}
// Load mappings
async function loadMappings() {
    try {
        const response = await sendMessage('getFolderMappings');
        if (response.success && response.data) {
            currentMappings = response.data;
            renderMappings();
        }
    }
    catch (error) {
        console.error('Failed to load mappings:', error);
    }
}
// Render mappings list
function renderMappings() {
    // Re-gate on every render so adding/removing a mapping (or connect/disconnect)
    // updates the sync controls — no mapping, no sync (task 012).
    refreshControlGating();
    // Only the folders the user explicitly connected (roots) are shown. Nested
    // subfolders sync automatically as part of their root's subtree \u2014 they are
    // an implementation detail, not separately managed. Removing a root cascades
    // to its children.
    const rootMappings = currentMappings.filter((m) => m.depth === 0);
    if (rootMappings.length === 0) {
        mappingsList.innerHTML = '<p class="empty-state">尚未配置映射</p>';
        return;
    }
    // Disconnect wipes all mappings (task 011), so a rendered list only ever
    // happens while connected \u2014 no read-only reference mode to show anymore.
    mappingsList.innerHTML =
        rootMappings
            .map((mapping) => `
      <div class="mapping-item" data-id="${mapping.id}">
        <div class="mapping-info">
          <div class="mapping-folder">
            <span class="mapping-icon">\uD83D\uDCC1</span>
            <span class="mapping-name">${escapeHtml(mapping.folderName)}</span>
          </div>
          <span class="mapping-arrow">\u2192</span>
          <div class="mapping-collection">
            <span class="mapping-icon">\uD83C\uDF27\uFE0F</span>
            <span class="mapping-name">${escapeHtml(mapping.raindropCollectionName)}</span>
          </div>
        </div>
        <button class="remove-mapping-btn" data-id="${mapping.id}"${isConnected ? '' : ' disabled'}>移除</button>
      </div>
    `)
            .join('');
    if (isConnected) {
        mappingsList.querySelectorAll('.remove-mapping-btn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget;
                const mappingId = target.dataset.id;
                if (!mappingId)
                    return;
                armConfirm(target, '再次点击确认', () => removeMapping(mappingId));
            });
        });
    }
}
// Add mapping
async function addMapping() {
    const firefoxFolderId = firefoxFolderSelect.value;
    let collectionValue = raindropCollectionSelect.value;
    if (!firefoxFolderId || !collectionValue) {
        showToast('请选择浏览器文件夹和 Raindrop 分组', true);
        return;
    }
    const folder = firefoxFolders.find((f) => f.id === firefoxFolderId);
    if (!folder) {
        showToast('未找到所选文件夹', true);
        return;
    }
    if (currentMappings.some((mapping) => mapping.firefoxFolderId === firefoxFolderId)) {
        showToast('该浏览器文件夹已映射到其他分组', true);
        return;
    }
    if (collectionValue === 'new') {
        // Create a separate root destination before mapping this browser folder.
        // Existing Raindrop collections and their bookmarks are never modified.
        const requestedName = window.prompt('请输入新的 Raindrop 分组名称', folder.title?.trim() || 'Chrome 书签');
        const title = requestedName?.trim();
        if (!title) {
            showToast('未创建新分组', true);
            return;
        }
        addMappingBtn.textContent = '正在创建分组…';
        addMappingBtn.disabled = true;
        try {
            const createResponse = await sendMessage('createCollection', { title });
            if (!createResponse.success || !createResponse.data) {
                throw new Error(createResponse.error || '创建分组失败');
            }
            const createdCollection = createResponse.data;
            raindropCollections.push(createdCollection);
            collectionValue = createdCollection._id.toString();
        }
        catch (error) {
            console.error('Failed to create Raindrop collection:', error);
            showToast(error instanceof Error ? error.message : '创建分组失败', true);
            addMappingBtn.textContent = '添加映射';
            addMappingBtn.disabled = false;
            return;
        }
    }
    let collectionId;
    let collectionName;
    if (collectionValue === 'new') {
        showToast('新建分组功能不可用，请选择现有分组。', true);
        return;
    }
    else {
        collectionId = parseInt(collectionValue, 10);
        const collection = raindropCollections.find((c) => c._id === collectionId);
        collectionName = collection?.title || '未知分组';
    }
    const mapping = {
        id: generateId(),
        firefoxFolderId,
        raindropCollectionId: collectionId,
        folderName: folder.title?.trim() || '未命名文件夹',
        raindropCollectionName: collectionName,
        depth: 0,
        lastSync: 0,
    };
    try {
        addMappingBtn.textContent = '正在添加…';
        addMappingBtn.disabled = true;
        const addResponse = await sendMessage('addFolderMapping', mapping);
        if (!addResponse.success) {
            throw new Error(addResponse.error || '添加文件夹映射失败');
        }
        // Initial sync reconciles the whole nested tree itself (both
        // directions) — one call, no separate syncFolderWithChildren
        // round-trip (task 001). Every mapped folder syncs all its children.
        const syncResponse = await sendMessage('performInitialSync', mapping);
        if (!syncResponse.success) {
            throw new Error(syncResponse.error || '首次同步失败');
        }
        const syncResult = syncResponse.data;
        if (syncResult.errors && syncResult.errors.length > 0) {
            showToast(`映射已添加，但部分书签同步失败：${syncResult.errors.join('；')}`, true);
        }
        else {
            showToast(`映射已添加：文件夹 ${syncResult.foldersSynced} 个，已匹配 ${syncResult.matched} 条，已上传 Raindrop ${syncResult.createdInRaindrop} 条，已下载浏览器 ${syncResult.createdInFirefox} 条。`);
        }
        await loadMappings();
        await loadStats();
        await loadRaindropCollections();
        firefoxFolderSelect.value = '';
        raindropCollectionSelect.value = '';
    }
    catch (error) {
        console.error('Failed to add mapping:', error);
        showToast('添加映射失败，请重试。', true);
    }
    finally {
        addMappingBtn.textContent = '添加映射';
        addMappingBtn.disabled = false;
    }
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
    // Add mapping button
    addMappingBtn.addEventListener('click', addMapping);
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
