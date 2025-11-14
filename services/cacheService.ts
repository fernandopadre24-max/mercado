// A key prefix to avoid collisions with other data in localStorage
const CACHE_PREFIX = 'posPro_';

/**
 * Retrieves an item from localStorage.
 * @param key The key of the item to retrieve.
 * @returns The parsed item, or null if not found or if parsing fails.
 */
export const get = <T>(key: string): T | null => {
  try {
    const item = window.localStorage.getItem(`${CACHE_PREFIX}${key}`);
    return item ? (JSON.parse(item) as T) : null;
  } catch (error) {
    console.error(`Error getting item "${key}" from cache`, error);
    // If parsing fails, remove the corrupted item
    remove(key);
    return null;
  }
};

/**
 * Saves an item to localStorage.
 * @param key The key under which to save the item.
 * @param value The value to save. Must be JSON-serializable.
 */
export const set = <T>(key: string, value: T): void => {
  try {
    if (value === undefined || value === null) {
      remove(key);
    } else {
      window.localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(value));
    }
  } catch (error) {
    console.error(`Error setting item "${key}" in cache`, error);
  }
};

/**
 * Removes an item from localStorage.
 * @param key The key of the item to remove.
 */
export const remove = (key: string): void => {
    try {
        window.localStorage.removeItem(`${CACHE_PREFIX}${key}`);
    } catch (error) {
        console.error(`Error removing item "${key}" from cache`, error);
    }
};

/**
 * Clears all cached items managed by this service.
 */
export const clear = (): void => {
    try {
        Object.keys(window.localStorage)
            .filter(key => key.startsWith(CACHE_PREFIX))
            .forEach(key => window.localStorage.removeItem(key));
    } catch (error) {
        console.error('Error clearing cache', error);
    }
};
