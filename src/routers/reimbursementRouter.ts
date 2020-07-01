
import express, { Request, Response, NextFunction } from 'express'
//import { authenticationMiddleware } from '../middleware/authent-middleware'
import { getReimburByStatus } from '../daos/dao - reimbursements'
//import {authorizMiddleware} from '../middleware/authoriz-middleware'

//import { UserUserInputError } from '../errors/UserUserInputError'
//import { User } from '../models/User'

export const reimbursementRouter = express.Router() //creating the userRouter variable to use as a router 

//reimbursementRouter.use(authenticationMiddleware)

reimbursementRouter.get('status/:id', async (req: Request, res: Response, next: NextFunction) => {
    let { id } = req.params
    if (isNaN(+id)) {
        // responding with a 400 error:"Id needs to be a number"
        res.status(400).send('Id needs to be a number')
    } else {
        try {
            let user = await getReimburByStatus(+id)
            res.json(user)
        } catch (e) {
            next(e)
        }
    }
})


