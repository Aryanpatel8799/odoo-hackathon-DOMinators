class apiResponse{
    constructor(statusCode, message, data = null) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = true;

    }
}

export default apiResponse;