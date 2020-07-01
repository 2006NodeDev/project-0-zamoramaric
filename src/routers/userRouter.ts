import express, { Request, Response, NextFunction } from 'express'
import { authenticationMiddleware } from '../middleware/authent-middleware'
import { getUserById,getAllUsers } from '../daos/dao - user'
//import {authorizMiddleware} from '../middleware/authoriz-middleware'

//import { UserUserInputError } from '../errors/UserUserInputError'
//import { User } from '../models/User'

export const userRouter = express.Router() //creating the userRouter variable to use as a router 

userRouter.use(authenticationMiddleware)

//get by id - using the get verb to find a user through an id
userRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    let { id } = req.params
    if (isNaN(+id)) {
        // responding with a 400 error:"Id needs to be a number"
        res.status(400).send('Id needs to be a number')
    } else {
        try {
            let user = await getUserById(+id)
            res.json(user)
        } catch (e) {
            next(e)
        }
    }
})
//authorizMiddleware([//get

//get all users
userRouter.get('/', async (req:Request, res:Response, next:NextFunction)=>{

try {
    let allUsers = await getAllUsers()
    res.json(allUsers)
}catch(e){
    next(e)
}

})