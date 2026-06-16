/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Subscription API Types
 */
export interface SubscriptionStatusResponse {
  status: 0 | 1;
}

export interface SubscriberDetails {
  msisdn: string;
  valid_from: string;
  valid_to: string;
  status: string;
  service_name: string;
}

export interface APIParams {
  subid: string;
  productcode: string;
}
