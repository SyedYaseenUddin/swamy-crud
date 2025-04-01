// Class representing the response data
class ResponseData {
    constructor(data = null, error = null) {
        this.data = data;
        this.error = error;
    }
}

// Builder class for ResponseData
class ResponseDataBuilder {
    constructor() {
        this.data = null;
        this.error = null;
    }

    static builder() {
        return new ResponseDataBuilder();
    }

    setData(data) {
        this.data = data;
        return this;
    }

    setError(error) {
        this.error = error;
        return this;
    }

    build() {
        return new ResponseData(this.data, this.error);
    }
}

// Class representing the full response
class Response {
    constructor(status = null, response = null) {
        this.status = status;
        this.response = response;
    }
}

// Builder class for Response
class ResponseBuilder {
    constructor() {
        this.status = null;
        this.response = null;
    }

    static builder() {
        return new ResponseBuilder();
    }

    setStatus(status) {
        this.status = status;
        return this;
    }

    setResponse(data = undefined, error = undefined) {
        this.response = ResponseDataBuilder.builder()
            .setData(data)
            .setError(error)
            .build();
        return this;
    }

    build() {
        return new Response(this.status, this.response);
    }
}

// Exporting the classes
module.exports = { Response, ResponseBuilder };