class apiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong!",
    ) {
        super(message);
        this.statusCode = statusCode;
    }
}

export { apiError };
