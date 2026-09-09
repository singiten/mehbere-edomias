// utils/apiHelpers.js

/**
 * Extract data from API response regardless of structure
 * Handles: { data: ... } or { data: { data: ... } } or direct response
 */
export const extractData = (response) => {
  if (!response) return null;
  
  // If response has data property
  if (response.data) {
    // If data has data property (nested)
    if (response.data.data !== undefined) {
      return response.data.data;
    }
    return response.data;
  }
  
  return response;
};

/**
 * Extract array from API response
 */
export const extractArray = (response, defaultValue = []) => {
  const data = extractData(response);
  return Array.isArray(data) ? data : defaultValue;
};

/**
 * Extract object from API response
 */
export const extractObject = (response, defaultValue = {}) => {
  const data = extractData(response);
  return typeof data === 'object' && data !== null && !Array.isArray(data) 
    ? data 
    : defaultValue;
};