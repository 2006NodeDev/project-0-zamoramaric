import { HttpError } from "./HttpError";

//a specific impl of HTTPError
export class reimbursInputError extends HttpError {
    constructor(){//has no params
        super(401, 'reimbursInputError: Incorrect Reimbursement Input')
    }
}
//authorized status error 