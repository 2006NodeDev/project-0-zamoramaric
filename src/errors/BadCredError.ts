import { HttpError } from "./HttpError";

export class BadCredentError extends HttpError{
    constructor(){
        super(400, 'Please Include a Username and Password')
    }
}

//returning this error when the user is entering the incorrect password and username