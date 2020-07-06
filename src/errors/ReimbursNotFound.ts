import { HttpError } from "./HttpError";

export class ReimbursNotFoundError extends HttpError {
    constructor(){
        super(404, 'Reimbursement Not Found')
    }
}
