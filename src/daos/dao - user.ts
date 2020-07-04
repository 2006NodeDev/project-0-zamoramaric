import { PoolClient } from "pg";
import { connectionPool } from ".";
import { UserDTOtoUserConver } from "../utils/UserDTOUserConvertor";
import { UserNotFoundError } from "../errors/UserNotFoundError";
import { User } from "../models/User";
import { AuthFailureError} from '../errors/AuthFailError'
//import { UserInputError } from "../errors/UserUserInputError";

// this is going to contain all the functions that interact wit hthe book table

///GET USER BY ID
export async function getUserById(id: number):Promise<User> {
    let client: PoolClient
    try {
        //get a connection
        client = await connectionPool.connect()
        //send the query
        let results = await client.query(`select u."user_id", 
        u ."username", 
        u."password", 
        u."firstName" ,
        u."lastName" ,
        u."email",
        r."role_id", 
        r."role" 
     from ersapi.users u 
    join ersapi.roles r 
     on u."role" = r."role_id" 
       where u."user_id"= $1;`, [id])// this is a parameterized query. In the query itself we use $1 to specify a parameter, then we fill in a value using an array as the second arg of the query function
                // pg library automatically sanitizes input for these params, [id]
        if(results.rowCount === 0){
            throw new Error('User Not Found')
        }
        return UserDTOtoUserConver(results.rows[0])//there should only ever be one row
    } catch (e) {
        if(e.message === 'User Not Found'){
            throw new UserNotFoundError()
        }
        //if we get an error we don't know 
        console.log(e)
        throw new Error('Unhandled Error Occured')
    } finally {
        //let the connectiopn go back to the pool
        client && client.release()
    }
}

//login 
export async function getUserByUsernameAndPassword(username:string, password:string):Promise<User>{
    let client: PoolClient
    try {
        //get a connection
        client = await connectionPool.connect()
        //send the query
        let results = await client.query(`select u."user_id", 
                u."username" , 
                u."password" ,                 
                u."email" ,
                r."role_id" , 
                r."role" 
                from ersapi.users u left join ersapi.roles r on u."role" = r.role_id 
                where u."username" = $1 and u."password" = $2;`,
            [username, password])// this is a parameterized query. In the query itself we use $1 to specify a parameter, then we fill in a value using an array as the second arg of the query function
                // pg library automatically sanitizes input for these params
        if(results.rowCount === 0){
            throw new Error('User Not Found')
        }
        return UserDTOtoUserConver(results.rows[0])//there should only ever be one row
    } catch (e) {
        if(e.message === 'User Not Found'){
            throw new AuthFailureError()
        }
        //if we get an error we don't know 
        console.log(e)
        throw new Error('Unhandled Error Occured')
    } finally {
        //let the connectiopn go back to the pool
        client && client.release()
    }
}

//GETALLUSERS
export async function getAllUsers():Promise<User[]> {
    //first thing is declare a client
    let client: PoolClient
    try {
        //get a connection
        client = await connectionPool.connect()
        //send the query
        let results = await client.query(`select u."user_id", 
        u."username", 
        u."password", 
        u."firstName",
        u."lastName",
        u."email",
        r."role_id", 
        r."role" 
        from ersapi.users u left join ersapi.roles r on u."role" = r.role_id;`)
        return results.rows.map(UserDTOtoUserConver)//return the rows
       // return UserDTOtoUserConver(results.rows[0])//there should only ever be one row
    } catch (e) {
        //if we get an error we don't know 
        console.log(e)
        throw new Error('Unhandled Error Occured')
    } finally {
        //let the connectiopn go back to the pool
        client && client.release()
    }
}

