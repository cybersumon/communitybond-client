
/**
 * API Types
 *
 * PURPOSE:
 * Describe the JSON response returned by
 * our Express.js backend.
 */

/**
 * Response containing multiple records.
 */
export interface ApiListResponse<T> {
  success: boolean;
  count: number;
  data: T[];
}

/**
 * Response containing one record.
 */
export interface ApiItemResponse<T> {
  success: boolean;
  data: T;
}
