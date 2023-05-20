export class ApiError extends Error {
    status: number
    operational: boolean
    constructor(message: string, status: number) {
        super(message)
        this.status = status
        this.operational = true
    }
}