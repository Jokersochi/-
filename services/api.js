// API Service Layer - Client-side API calls

import { API_ENDPOINTS } from '../utils/constants';
import { getErrorMessage } from '../utils/helpers';

/**
 * Base API call wrapper with error handling
 */
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error ${response.status}`);
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: getErrorMessage(error) };
  }
}

/**
 * Generation API Service
 */
export const generationApi = {
  /**
   * Generate new design
   */
  async generate(imageUrl, style, options = {}) {
    return apiCall(API_ENDPOINTS.generate, {
      method: 'POST',
      body: JSON.stringify({
        imageUrl,
        style,
        ...options,
      }),
    });
  },

  /**
   * Get generation status (for async polling)
   */
  async getStatus(predictionId) {
    return apiCall(`${API_ENDPOINTS.generate}?id=${predictionId}`, {
      method: 'GET',
    });
  },
};

/**
 * Payment API Service
 */
export const paymentApi = {
  /**
   * Create payment
   */
  async createPayment(amount, description, metadata = {}) {
    return apiCall(API_ENDPOINTS.payment, {
      method: 'POST',
      body: JSON.stringify({
        amount,
        description,
        metadata,
      }),
    });
  },

  /**
   * Check payment status
   */
  async checkPaymentStatus(paymentId) {
    return apiCall(`${API_ENDPOINTS.payment}?id=${paymentId}`, {
      method: 'GET',
    });
  },
};

/**
 * History API Service
 */
export const historyApi = {
  /**
   * Get generation history
   */
  async getHistory(limit = 20, offset = 0) {
    return apiCall(`${API_ENDPOINTS.history}?limit=${limit}&offset=${offset}`, {
      method: 'GET',
    });
  },

  /**
   * Delete history item
   */
  async deleteItem(id) {
    return apiCall(`${API_ENDPOINTS.history}?id=${id}`, {
      method: 'DELETE',
    });
  },
};

export default {
  generation: generationApi,
  payment: paymentApi,
  history: historyApi,
};
