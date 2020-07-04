
import express, { Request, Response, NextFunction } from 'express'
import { authenticationMiddleware } from '../middleware/authent-middleware'
        //import { getReimburByStatus } from '../daos/dao - reimbursements'
//import { reimbursInputError } from '../errors/ReimbursUserInputError'
//import { Reimbursement } from '../models/Reimbursement'
//import { UserIdInputError } from '../errors/UserIdInputError'
//import {submitReimbursement} from '../daos/dao - reimbursements'
//import {authorizMiddleware} from '../middleware/authoriz-middleware'

//import { UserUserInputError } from '../errors/UserUserInputError'
//import { User } from '../models/User'
import {getReimburByStatus} from "../daos/dao - reimbursements"
export const reimbursementRouter = express.Router() //creating the userRouter variable to use as a router 

reimbursementRouter.use(authenticationMiddleware)

reimbursementRouter.get('status/:status_id', async (req: Request, res: Response, next: NextFunction) => {
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

/* 
// for saving a new reimbursement
// this endpoint will run all the middleware functions one at a time
reimbursementRouter.post('/',authorizMiddleware(['Admin', ' Finance Manager','User']), async (req: Request, res: Response, next:NextFunction) => {
    console.log(req.body);//lets look at what the request body looks like
    let { author,
        amount,
        date_submitted,
        description,
        type} = req.body //this is destructuring
    // warning if data is allowed to be null or 0, or false, this check is not sufficient
    if (author && amount && date_submitted && description && type){
            let newReimbursement: Reimbursement = {
                reimbursementId: 0,
                author,
                amount,
                date_submitted,
                date_resolved:null,
                description,
                resolver:null,
                status:{
                    status:'Pending',
                    statusId:1
                },
                type
            }
           newReimbursement.type = type || null
            try {
                let recentNewReimb = await submitReimbursement(newReimbursement)
                res.json(recentNewReimb)
            }
            catch(e){
                next(e)
            }
    }
        else{
            throw new reimbursInputError()
        }
   }   })

        //(!series && typeof (series) === 'boolean' || series
        //books.push({ bookId, genre, authors, publisher, publishingDate, pages, chapters, title, series, numberInSeries, ISBN })
        //sendStatus just sents an empty response with the status code provided
      
        // .status sets the status code but deson't send res
        // .send can send a response in many different content-types
   
*/