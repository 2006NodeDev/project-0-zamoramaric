import { HttpError } from "./HttpError";

export class AuthFailureError extends HttpError {
    constructor(){
        super(401, 'Incorrect Username or Password')
    }
}

//using this when logging in and responding
// to the user that the useranem and pw submitted is incorrect