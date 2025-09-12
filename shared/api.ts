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

// Client -> Server: update current location using navigator.geolocation
export interface LocationUpdateRequest {
  lat: number;
  lon: number;
}

// Server -> Client ack
export interface LocationUpdateResponse {
  ok: boolean;
  received?: { lat: number; lon: number };
  error?: string;
}
