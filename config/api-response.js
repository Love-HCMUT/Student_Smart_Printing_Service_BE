export function createResponse(status, message, data = undefined) {
    const response = {
        status,
        message,
        ...(data !== undefined && { data }),
        timestamp: new Date().toISOString(),
    };

    return response;
}
