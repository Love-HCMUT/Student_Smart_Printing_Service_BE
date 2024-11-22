export function createResponse(status, message, data = undefined, errors = undefined) {
    const response = {
        status,
        message,
        ...(data !== undefined && { data }),
        ...(errors !== undefined && { errors }),
        timestamp: new Date().toISOString(),
    };

    return response;
}
