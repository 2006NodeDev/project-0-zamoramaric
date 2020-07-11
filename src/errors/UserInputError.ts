import { HttpError } from "./HttpError";

export class UserInputError extends HttpError{
    constructor(){
        super(400, 'User Information Submitted Is Invalid')
    }
}