

//import { Request, Response, NextFunction } from "express";
//import {AuthFailureError} from "../errors/AuthFailError"
import { Request, Response, NextFunction } from "express"
//import { AuthFailureError } from "../errors/AuthFailError"


export function authorizationMiddleware(roles:string[]){// build a middleware function
    return (req:Request, res:Response, next:NextFunction) => {
        let isAuthorized = false
        //console.log(req.session.user.role)
        if(req.session.user){
            for(let role of roles){
                if(role === req.session.user.role){
                    isAuthorized = true
                    next()
                }
                if(!isAuthorized){
                    res.status(401).send("The incoming token has expired")
                }
            }
        }else{
            res.status(401).send("The incoming token has expired")
        }

    }
}

// allow admin+manager

//allow only admin

//allow user + manage + admin

//allow user + admin