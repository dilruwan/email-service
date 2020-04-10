module.exports = {
    error: function(statusCode, message = "") {
        return {
            error: true,
            statusCode: statusCode,
            message: message
        }
    },
    success: function(statusCode, data, message = "") {
        return {
            error: false,
            statusCode: statusCode,
            data: data,
            message: message
        }
    }
};