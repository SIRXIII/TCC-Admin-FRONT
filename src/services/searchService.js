// src/services/searchService.js
import API from "./api"; // ✅ Your axios instance

/**
 * Global search function
 * @param {string} query - Search text
 * @returns {Promise<Object>} - { partners, travelers, riders, orders }
 */
export const globalSearch = async (query) => {
  if (!query.trim()) return { partners: [], travelers: [], riders: [], orders: [] };

  try {
    const { data } = await API.get(`/search?query=${encodeURIComponent(query)}`);
    return data;
  } catch (error) {
    console.error("Global search error:", error);
    return { partners: [], travelers: [], riders: [], orders: [] };
  }
};
