import express, { Request, Response, NextFunction } from 'express'
import { authenticationMiddleware } from '../middleware/authent-middleware'
import { getUserById,getAllUsers,UpdatesToUser } from '../daos/dao - user'
import {UserNewInputError} from '../errors/NewUserInputError'
import {authorizationMiddleware} from '../middleware/authoriz-middleware'
import { User } from '../models/User'
export const userRouter = express.Router() //creating the userRouter variable to use as a router 

userRouter.use(authenticationMiddleware)

//get by id - using the get verb to find a user through an id
userRouter.get('/:id', authorizationMiddleware(['admin', 'Finanical Manager']), async (req: Request, res: Response, next: NextFunction) => {
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
userRouter.get('/',  authorizationMiddleware(['admin', 'Finanical Manager']),async (req:Request, res:Response, next:NextFunction)=>{
try { 
    let allUsers = await getAllUsers()
    res.json(allUsers)
}catch(e){
    next(e)
}

})

//update user record
userRouter.patch('/', authorizationMiddleware(['admin']), async (req: Request, res: Response, next: NextFunction) => {
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