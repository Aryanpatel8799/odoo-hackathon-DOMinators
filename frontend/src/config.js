// API Configuration
export const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

// App Configuration
export const APP_CONFIG = {
  MAX_PENDING_SWAPS: 5,
  DEFAULT_PAGE_SIZE: 10,
  DEBOUNCE_DELAY: 500,
};

// Status constants
export const SWAP_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

// User availability status
export const AVAILABILITY_STATUS = {
  AVAILABLE: 'available',
  BUSY: 'busy',
  AWAY: 'away',
}; 