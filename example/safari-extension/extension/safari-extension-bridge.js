// Safari Extension Bridge
// This file provides compatibility between Chrome extension APIs and Safari extension APIs

(function() {
  // Create chrome namespace if it doesn't exist
  if (typeof chrome === 'undefined') {
    window.chrome = {};
  }
  
  // Implement chrome.storage API
  if (!chrome.storage) {
    chrome.storage = {
      local: {
        get: function(keys, callback) {
          // In Safari, we use localStorage for simple storage
          const result = {};
          
          if (Array.isArray(keys)) {
            keys.forEach(key => {
              const value = localStorage.getItem(key);
              if (value !== null) {
                try {
                  result[key] = JSON.parse(value);
                } catch (e) {
                  result[key] = value;
                }
              }
            });
          } else if (typeof keys === 'object') {
            Object.keys(keys).forEach(key => {
              const value = localStorage.getItem(key);
              if (value !== null) {
                try {
                  result[key] = JSON.parse(value);
                } catch (e) {
                  result[key] = value;
                }
              } else {
                result[key] = keys[key]; // Default value
              }
            });
          } else if (typeof keys === 'string') {
            const value = localStorage.getItem(keys);
            if (value !== null) {
              try {
                result[keys] = JSON.parse(value);
              } catch (e) {
                result[keys] = value;
              }
            }
          } else if (keys === null) {
            // Get all items
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key) {
                const value = localStorage.getItem(key);
                if (value !== null) {
                  try {
                    result[key] = JSON.parse(value);
                  } catch (e) {
                    result[key] = value;
                  }
                }
              }
            }
          }
          
          if (callback) {
            callback(result);
          }
          
          return Promise.resolve(result);
        },
        
        set: function(items, callback) {
          Object.keys(items).forEach(key => {
            localStorage.setItem(key, JSON.stringify(items[key]));
          });
          
          if (callback) {
            callback();
          }
          
          return Promise.resolve();
        },
        
        remove: function(keys, callback) {
          if (Array.isArray(keys)) {
            keys.forEach(key => {
              localStorage.removeItem(key);
            });
          } else if (typeof keys === 'string') {
            localStorage.removeItem(keys);
          }
          
          if (callback) {
            callback();
          }
          
          return Promise.resolve();
        },
        
        clear: function(callback) {
          localStorage.clear();
          
          if (callback) {
            callback();
          }
          
          return Promise.resolve();
        }
      },
      
      // Implement sync storage using local storage for now
      sync: {
        get: function(keys, callback) {
          return chrome.storage.local.get(keys, callback);
        },
        
        set: function(items, callback) {
          return chrome.storage.local.set(items, callback);
        },
        
        remove: function(keys, callback) {
          return chrome.storage.local.remove(keys, callback);
        },
        
        clear: function(callback) {
          return chrome.storage.local.clear(callback);
        }
      }
    };
  }
  
  // Implement chrome.runtime API
  if (!chrome.runtime) {
    chrome.runtime = {
      getURL: function(path) {
        // In Safari, we can use browser.runtime.getURL
        if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.getURL) {
          return browser.runtime.getURL(path);
        }
        
        // Fallback: assume the path is relative to the current page
        return path;
      },
      
      sendMessage: function(message, callback) {
        // In Safari, we can use browser.runtime.sendMessage
        if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.sendMessage) {
          return browser.runtime.sendMessage(message).then(callback);
        }
        
        // Fallback: use window.postMessage for simple messaging
        window.postMessage({
          type: 'safari-extension-message',
          message: message
        }, '*');
        
        if (callback) {
          callback();
        }
        
        return Promise.resolve();
      }
    };
  }
  
  // Add listener for messages from native app (iOS/macOS)
  window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'safari-extension-message') {
      // Handle message from native app
      console.log('Received message from native app:', event.data.message);
      
      // Dispatch custom event for extension code to listen to
      const customEvent = new CustomEvent('safari-extension-message', {
        detail: event.data.message
      });
      
      window.dispatchEvent(customEvent);
    }
  });
  
  console.log('Safari Extension Bridge loaded');
})();