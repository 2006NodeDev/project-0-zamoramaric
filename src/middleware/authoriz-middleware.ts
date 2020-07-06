

//import { Request, Response, NextFunction } from "express";
//import {AuthFailureError} from "../errors/AuthFailError"
import { Request, Response, NextFunction } from "express"
//import { AuthFailureError } from "../errors/AuthFailError"


export function authorizationMiddleware(roles:string[]){// build a middleware function to enable authorization based on role
    return (req:Request, res:Response, next:NextFunction) => {
        let isAuthorized = false
        //console.log(req.session.user.role)
        //if(req.session.user){
            for(const role of roles){
                if(role === req.session.user.role.role){
                    isAuthorized = true
                    next()
                }
                else if (role==='Current'){
                    let userID = req.url.substring(1)
                    console.log(`Session Id: ${req.session.user.userId}`);
                    console.log((`Request Id: ${userID}`));
                    if(req.session.user.userId == userID){
                        isAuthorized = true
                        next()
                    }
                    }
                }
                if(!isAuthorized){
                    res.status(401).send("The incoming token has expired")
                }
            }
        }