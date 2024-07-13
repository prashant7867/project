class ApiResponse{
    constructor(statusCode,data,message="Success"){
        this.statsCode=statusCode
        this.data=data
        this.message=message
        this.success= statusCode < 400
    }
}