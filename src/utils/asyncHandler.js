const asyncHandler = (requestHandler) => {
    return async (req, res, next) => {
        try {
            await requestHandler(req, res, next);
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message,
            });
            next(error);
        }
    };
};

export { asyncHandler };
