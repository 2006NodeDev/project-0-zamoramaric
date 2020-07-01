import { HttpError } from "./HttpError";

export class AuthFailureError extends HttpError {
    constructor(){
        super(401, 'The incoming token has expired')
    }
}

//using this when logging in and responding
// to the user that the useranem and pw submitted is incorrect