import { HttpError } from "./HttpError";

//a specific impl of HTTPError
export class UserLoginError extends HttpError {
    constructor(){//has no params
        super(400, 'Invalid Credentials')
    }
}

//