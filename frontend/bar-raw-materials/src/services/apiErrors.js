// Extracts a user-facing message from an axios error.
// The backend answers either a plain string or a {errorKey: message} map.
export const getErrorMessage = (error, fallback = 'Có lỗi xảy ra') => {
    const data = error?.response?.data;
    if (typeof data === 'string' && data) {
        return data;
    }
    if (data && typeof data === 'object') {
        const message = Object.values(data).find((value) => typeof value === 'string' && value);
        if (message) {
            return message;
        }
    }
    return fallback;
}

// HTTP 409: another request changed the same stock row; the backend already rolled back
export const isConflictError = (error) => error?.response?.status === 409;
