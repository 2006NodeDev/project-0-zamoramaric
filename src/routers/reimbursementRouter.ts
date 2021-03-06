
import express, { Request, Response, NextFunction } from 'express'
import { authenticationMiddleware } from '../middleware/authent-middleware'
        //import { getReimburByStatus } from '../daos/dao - reimbursements'
//import { reimbursInputError } from '../errors/ReimbursUserInputError'
import { Reimbursement } from '../models/Reimbursement'
//import { UserIdInputError } from '../errors/UserIdInputError'
//import {submitReimbursement} from '../daos/dao - reimbursements'
//import {authorizMiddleware} from '../middleware/authoriz-middleware'
//import { UserUserInputError } from '../errors/UserUserInputError'
//import { User } from '../models/User'
import {getReimburByStatus,getReimburByUserId} from "../daos/dao - reimbursements"
import {reimbursInputError} from "../errors/ReimbursUserInputError"
import {authorizationMiddleware} from '../middleware/authoriz-middleware'
import{saveNewReimbur} from "../daos/dao - reimbursements"
export const reimbursementRouter = express.Router() //creating the userRouter variable to use as a router 

reimbursementRouter.use(authenticationMiddleware)

//find by status id
reimbursementRouter.get('/status/:status_id',authorizationMiddleware(['admin', 'Finanical Manager']), async (req: Request, res: Response, next: NextFunction) => {
   //, authorizMiddleware(['Admin', 'Financial Manager'])
    let { status_id } = req.params
    if (isNaN(+status_id)) {
        // responding with a 400 error:"Id needs to be a number"
        res.status(400).send('Id needs to be a number')
    } else {
        try {
            let statId = await getReimburByStatus(+status_id)
            res.json(statId)
        } catch (e) {
            next(e)
        }
    }
})
//find my user id
reimbursementRouter.get('/author/userId/:userId',authorizationMiddleware(['admin','Finanical Manager']), async (req: Request, res: Response, next: NextFunction) => {
    //, authorizMiddleware(['Admin', 'Financial Manager'])
     let { userId } = req.params
     if (isNaN(+userId)) {
         // responding with a 400 error:"Id needs to be a number"
         res.status(400).send('Id needs to be a number')
     } else {
         try {
             let uId = await getReimburByUserId(+userId)
             res.json(uId)
         } catch (e) {
             next(e)
         }
     }
 })
 

//Create new reimbursementc
reimbursementRouter.post('/', authorizationMiddleware(['admin', 'Finanical Manager', 'User']),  async (req: Request, res: Response, next: NextFunction) => {
   //authorizationMiddleware(['Admin']),
    // get input from the user
    let {author, amount, date_resolved, description, resolver, status, type} = req.body
    if(!author || !amount || !description || !status || !type){
        //ensure all that must be not null, are filled
        next(new reimbursInputError)

    } else {
        
        let newReimb: Reimbursement = {
            reimbursementId: 0,
            author,
            amount,
            date_submitted:null,
            date_resolved,
            description,
            resolver,
            status,
            type
        }
        //new users default to User role

        try{
            if (isNaN(amount) || isNaN(status) || isNaN (type)){
                throw new Error ('Enter numbers for amount, status and type')
            } else {
                let savedReimb = await saveNewReimbur(newReimb)
                //won't let me set status, only send? why?
                res.json(savedReimb)


            }
            
        } catch (err) {
            next (err)
        }
        
    }

})

//update reimbursement information

//update user record
/*
reimbursementRouter.patch('/', authorizationMiddleware(['admin']), async (req: Request, res: Response, next: NextFunction) => {
    //
    // get input from the user
    let { userId,username, password,firstName,lastName, email, role } = req.body// destructuring
   
    if (!username || !password || !role) {     //Checking for the users input
        next(new UserNewInputError)
    } else {
        let NewUserUpdate: User = {
            userId,
            username,
            password,
            firstName,
            lastName,
            role,
            email
        }
        NewUserUpdate.email = email || null
        try {
             await UpdatesToUser(NewUserUpdate)

            res.send('The User Changes Were Processed Successfully')
        } catch (e) {
            next(e)
        }
    }
})


*/

















//create new reimbursement example
   /* console.log(req.body);
    let { 
        author,
        amount,
        date_submitted,
        date_resolved,
        description,
        type } = req.body
    if(author && amount && date_submitted && description && type) {
        let newReim: Reimbursement = {
            reimbursementId: 0,
            author,
            amount,
            date_submitted:Date.now(),
            date_resolved, //since it's new and will eventually have an update in the date
            description,
            resolver: null, //since it's new and has not been resolved yet as a part of the new reimbu submission
            status,
            type
        }
        newReim.type = type || null
        try {
            let savedReim = await saveNewReimbur(newReim)
            res.json(savedReim)
        } catch (e) {
            next(e)
        }
    }
    else {
        throw new reimbursInputError()
    }

})
//updating Reimbur


*/
