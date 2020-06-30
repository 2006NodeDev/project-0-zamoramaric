import { PoolClient } from "pg";
import { connectionPool } from ".";
import { UserDTOtoUserConver } from "../utils/UserDTOUserConvertor";
import { UserNotFoundError } from "../errors/UserNotFoundError";
import { User } from "../models/User";
import { AuthFailureError} from '../errors/AuthFailError'
//import { UserInputError } from "../errors/UserUserInputError";


///GET USER BY ID
export async function getUserById(id: number):Promise<User> {
    let client: PoolClient
    try {
        //get a connection
        client = await connectionPool.connect()
        //send the query
        let results = await client.query(`select u."user_id", 
        u."username", 
        u."password", 
        u."first_name",
        u."last_name",
        u."email",
        r."role_id", 
        r."role" 
     from ersapi.users u 
   left join ersapi.roles r 
     on u."role" = r."role_id" 
       where u."user_id" = $1;`, [id])// this is a parameterized query. In the query itself we use $1 to specify a parameter, then we fill in a value using an array as the second arg of the query function
                // pg library automatically sanitizes input for these params
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
// this is a parameterized query. In the query itself we use $1 to specify a parameter, then we fill in a value using an array as the second arg of the query function
                // pg library automatically sanitizes input for these params
        //if(results.rowCount === 0){
          //  throw new Error('User Not Found')
       // }
      //  return UserDTOtoUserConver(results.rows[0])//there should only ever be one row
    //} catch (e) {
    //    if(e.message === 'User Not Found'){
    //        throw new AuthFailureError()
       // }
        //if we get an error we don't know 
       // console.log(e)
      
    // throw new Error('Unhandled Error Occured')
  //  } finally {
        //let the connectiopn go back to the pool
       // client && client.release()
  //  }
//}

///TESTING
/*//this is going to contain all the funcs that interact 
//with the user table

import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import { UserIdInputError } from "../errors/UserIdInputError";
//import { UserDTO } from "../dtos/UserDTOtoBookConvertor";
import {UserDTOtoUserConvertor} from "../utils/UserDToBookConvertor"

export async function findAllUsers(){

    let client:PoolClient;

try{
    client = await connectionPool.connect()
    let results = await client.query('select * from ersapi.users;')
    return results.rows
}catch(e){
   console.log(e)
    throw new Error('unimplemented error')

}
finally{
    client && client.release();
}
}


//function for finding a user by ID
export async function findUserById(id:number){

    let client:PoolClient;

    try{
        client = await connectionPool.connect()
        let results:QueryResult = await client.query('select * from users where users.user_id = ${id};')

        if (results.rowCount===0){
            throw new Error ('Not Found')
        }
        else{
            return UserDTOtoUserConvertor(results.rows[0])
        }

    } catch (e){ 
        if(e.message === 'Not Found'){
            throw new UserIdInputError()
        }
        console.log(e)
        throw new Error('unimplemented error')
    }
    finally{
        client && client.release();
    }
}


*/