/**
 * Centralized utility to format raw backend error messages into user-friendly strings.
 * Handles Spring Boot's common verbose exception payloads and SQL constraints.
 */
export function formatBackendError(error) {
  if (!error) return 'An unexpected error occurred';

  const status = error.response?.status;
  const data = error.response?.data;
  const rawMessage = data?.message || data?.error || error.message || '';

  // 1. Handle common status code defaults
  if (status === 401) return 'Session expired. Please log in again.';
  if (status === 403) return 'You do not have permission to perform this action.';
  if (status === 404) return 'The requested resource was not found.';

  // 2. Handle Unique Constraint Violations (SQL)
  // Example log: "Detail: Key (license_plate)=(TN01AB1243) already exists."
  if (rawMessage.includes('unique constraint') || rawMessage.includes('already exists')) {
    if (rawMessage.includes('license_plate') || rawMessage.includes('licensePlate')) {
      return 'A truck with this license plate is already registered.';
    }
    if (rawMessage.includes('email')) {
      return 'An account with this email already exists.';
    }
    if (rawMessage.includes('userId') || rawMessage.includes('user_id')) {
      return 'This User ID is already taken.';
    }
    return 'This record already exists in our system.';
  }

  // 3. Handle Validation Errors (400 Bad Request maps)
  // If data is a simple object mapping { field: message }
  if (status === 400 && data && typeof data === 'object' && !data.message) {
    const firstError = Object.values(data)[0];
    if (typeof firstError === 'string') return firstError;
  }

  // 4. Handle Custom Business Exceptions (if they have clean messages)
  // If the backend has already tried to be clean (usually doesn't contain "could not execute statement")
  if (rawMessage && !rawMessage.includes('statement') && !rawMessage.includes('Exception')) {
    return rawMessage;
  }

  // 5. Fallback for 500s or unexpected errors
  if (status >= 500) {
    return 'Server error. Our team has been notified. Please try again later.';
  }

  return 'Something went wrong. Please check your input and try again.';
}
