// different users have different roles
// different roles allow you to do different things
// different endpoints require different roles
//before I allow someone to access an endpoint, I want to make sure they have a role that matches that endpoints allowed roles

import { Request, Response, NextFunction } from "express";
import {AuthFailureError} from "../errors/AuthFailError"

// utilize the factory pattern, we provide an array of accepted roles, and return a function that allows those roles through
// this function is a middleware factory
export function authorizMiddleware(roles:string[]){// build a middleware function
    return (req:Request, res:Response, next:NextFunction) => {
        let allowed = false
        for(const role of roles){
            if(req.session.user.role.role === role){
                //we found a matching role, allow them in
                allowed = true
                next()
            }
            else if (role === 'Current'){
                let id = req.url.substring(1)
                console.log('Id: ${req.session.user.user.Id}')
                console.log(('Request Id: ${id}' ))

                if(req.session.user.userId == id){
                    allowed = true
                    next()

                }
                // if they didn't have a matching role kick em out
                res.status(403).send('YOu have insufficent permissions for this endpoint')
            }
        }
        if(!allowed){
            throw new AuthFailureError()

        }
    }
        
    }




// allow admin+manager

//allow only admin

//allow user + manage + admin

//allow user + admin