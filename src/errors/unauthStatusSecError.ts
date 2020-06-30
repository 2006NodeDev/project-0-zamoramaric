import { HttpError } from "./HttpError";

//a specific impl of HTTPError
export class unauthStatusSecError extends HttpError {
    constructor(){//has no params
        super(401, 'The incoming token has expired')
    }
}
//authorized status error 