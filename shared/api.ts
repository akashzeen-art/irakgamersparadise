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
 * Gamers Paradise subscription API configuration
 */
export const PORTAL_URL = 'http://gamerpardise.com/content/url';
export const CONTENT_DOMAIN = 'http://gamerpardise.com';
export const CONTENT_PORTAL_PATH = '/content/url';
export const SUBSCRIPTION_API_BASE = 'http://142.93.209.116/adpoke/cnt';
export const SUBSCRIPTION_PROXY_BASE = '/api/subscription';
export const DEFAULT_SUBID = '0';
export const DEFAULT_PRODUCTCODE = 'ZIQGP';
export const SESSION_SUBID_KEY = 'gp_subid';

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

export function isSubscribedStatus(status: string | number | undefined): boolean {
  return String(status) === '1';
}

export function parseSubscriptionStatus(data: { status?: string | number }): 0 | 1 {
  return isSubscribedStatus(data.status) ? 1 : 0;
}

/** Iraqi MSISDN for API subid — local digits only (e.g. 7876143154) */
export function formatPhoneForSubid(input: string): string {
  let digits = input.replace(/\D/g, '').replace(/^0+/, '');
  if (digits.startsWith('964')) {
    digits = digits.slice(3);
  }
  return digits;
}
