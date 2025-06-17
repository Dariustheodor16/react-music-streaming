import { trackService, albumService, userService } from "./index";

class SearchService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000;
  }

  getCacheKey(type, searchTerm) {
    return `${type}_${searchTerm.toLowerCase()}`;
  }

  isValidCache(cacheEntry) {
    return Date.now() - cacheEntry.timestamp < this.cacheTimeout;
  }

  async searchWithCache(type, searchTerm, searchFunction, limit) {
    const cacheKey = this.getCacheKey(type, searchTerm);
    const cachedResult = this.cache.get(cacheKey);

    if (cachedResult && this.isValidCache(cachedResult)) {
      return cachedResult.data.slice(0, limit);
    }

    try {
      const results = await searchFunction(searchTerm, limit * 2);

      this.cache.set(cacheKey, {
        data: results,
        timestamp: Date.now(),
      });

      return results.slice(0, limit);
    } catch (error) {
      console.error(`Error in cached search for ${type}:`, error);
      return [];
    }
  }

  async searchTracks(searchTerm, limit = 10) {
    return this.searchWithCache(
      "tracks",
      searchTerm,
      (term, lim) => trackService.searchTracks(term, lim),
      limit
    );
  }

  async searchAlbums(searchTerm, limit = 10) {
    return this.searchWithCache(
      "albums",
      searchTerm,
      (term, lim) => albumService.searchAlbums(term, lim),
      limit
    );
  }

  async searchAlbumsByType(searchTerm, type, limit = 10) {
    return this.searchWithCache(
      `${type}s`,
      searchTerm,
      (term, lim) => albumService.searchAlbumsByType(term, type, lim),
      limit
    );
  }

  async searchUsers(searchTerm, limit = 10) {
    return this.searchWithCache(
      "users",
      searchTerm,
      (term, lim) => userService.searchUsers(term, lim),
      limit
    );
  }

  clearCache() {
    this.cache.clear();
  }

  cleanExpiredCache() {
    for (const [key, value] of this.cache.entries()) {
      if (!this.isValidCache(value)) {
        this.cache.delete(key);
      }
    }
  }
}

export const searchService = new SearchService();

setInterval(() => {
  searchService.cleanExpiredCache();
}, 10 * 60 * 1000);
