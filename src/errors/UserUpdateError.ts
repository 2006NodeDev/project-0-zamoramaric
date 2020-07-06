import { HttpError } from "./HttpError";

export class UpdatingUserInfoError extends HttpError{
    constructor(){
        super(500, 'Error Updating The User Information')
    }
}