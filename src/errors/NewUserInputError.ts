import { HttpError } from "./HttpError";

export class UserNewInputError extends HttpError{
    constructor(){
        super(400, 'User Information Submitted Is Invalid')
    }
}