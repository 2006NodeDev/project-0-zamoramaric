  
import { HttpError } from "./HttpError";

export class UserIdInputError extends HttpError{
    constructor(){
        super(400, 'Id must be a number')
    }
}

//error thrown to user when they enter a none integar when trying to access a user using Id