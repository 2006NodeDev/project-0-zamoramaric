
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
reimbursementRouter.get('/status/:status_id',authorizationMiddleware(['Admin', 'Finance Manager']), async (req: Request, res: Response, next: NextFunction) => {
   //, authorizMiddleware(['Admin', 'Finance Manager'])
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
reimbursementRouter.get('/author/userId/:userId',authorizationMiddleware(['Finance Manager']), async (req: Request, res: Response, next: NextFunction) => {
    //, authorizMiddleware(['Admin', 'Finance Manager'])
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
 

//Create new reimbursement
reimbursementRouter.post('/', authorizationMiddleware(['Admin', 'Finance Manager', 'User']),  async (req: Request, res: Response, next: NextFunction) => {
   //authorizationMiddleware(['Admin']),
    // get input from the user
    console.log(req.body);
    let { 
        author,
        amount,
        date_submitted,
        description,
        type } = req.body
    if(author && amount && date_submitted && description && type) {
        let newReim: Reimbursement = {
            reimbursementId: 0,
            author,
            amount,
            date_submitted,
            date_resolved: null, //since it's new and will eventually have an update in the date
            description,
            resolver: null, //since it's new and has not been resolved yet as a part of the new reimbu submission
            status: 
                {
                    status: 'Pending', //Setting tp pending as a start status
                    statusId: 1
                },
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

/*
//update usreimbursement record
reimbursementRouter.patch('/', authorizationMiddleware(['Admin']), async (req: Request, res: Response, next: NextFunction) => {
    //
    let {reimbursementId, author, amount, date_submitted, date_resolved, description, resolver, status, type } = req.body
    let ColumnstoUpdate:Reimbursement = {reimbursementId:reimbursementId, author:author, amount:amount, 
        date_submitted:date_submitted, 
    date_resolved:date_resolved,
     description:description, 
     resolver:resolver, 
     status:status, 
     type:type}
    try{
        let updatedReimbursement = await updateReimbursement(ColumnstoUpdate)
        let [newReimbursement] = updatedReimbursement
        res.json(newReimbursement)
    }catch(e){
        console.log(e)
    }
})
*/