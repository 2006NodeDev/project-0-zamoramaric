import { PoolClient } from "pg";
import { connectionPool } from ".";
import { UserDTOtoUserConver } from "../utils/UserDTOUserConvertor";
import { UserNotFoundError } from "../errors/UserNotFoundError";
import { User } from "../models/User";
import { AuthFailureError} from '../errors/AuthFailError'
//import { UserInputError } from "../errors/UserUserInputError";
//import {UpdatingUserInfoError} from "../errors/UserUpdateError"
import {UserInputError} from "../errors/UserInputError"

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

//UPDATING USER INFO
export async function UpdatesToUser(updatedUserInfo:User):Promise<User> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')

        if(updatedUserInfo.username) {
            await client.query(`update ersapi.users set "username" = $1 
                                    where "user_id" = $2;`, 
                                    [updatedUserInfo.username, updatedUserInfo.userId])
        }
        if(updatedUserInfo.password) {
            await client.query(`update ersapi.users set "password" = $1 
                                    where "user_id" = $2;`, 
                                    [updatedUserInfo.password, updatedUserInfo.userId])
        }
        if(updatedUserInfo.firstName) {
            await client.query(`update ersapi.users set "firstName" = $1 
                                    where "user_id" = $2;`, 
                                    [updatedUserInfo.firstName, updatedUserInfo.userId])
        }
        if(updatedUserInfo.lastName) {
            await client.query(`update ersapi.users set "lastName" = $1 
                                    where "user_id" = $2;`, 
                                    [updatedUserInfo.lastName, updatedUserInfo.userId])
        }
        if(updatedUserInfo.email) {
            await client.query(`update ersapi.users set "email" = $1 
                                    where "user_id" = $2;`, 
                                    [updatedUserInfo.email, updatedUserInfo.userId])
        }
        if(updatedUserInfo.role) {
            let roleId = await client.query(`select r."role_id" from ersapi.roles r 
                                        where r."role" = $1`,
                                        [updatedUserInfo.role])
            if(roleId.rowCount === 0) {
                throw new Error('Role Not Found')
            }
            roleId = roleId.rows[0].role_id
            await client.query(`update ersapi.users set "role" = $1 
                                    where "user_id" = $2;`, 
                                    [roleId, updatedUserInfo.userId])
        }

        await client.query('COMMIT;')
        return updatedUserInfo
    } catch (e) {
        client && client.query('ROLLBACK;')
        if(e.message === 'Role Not Found') {
            throw new UserInputError()
        }
        console.log(e);
        throw new Error('Unhandled Error')
    } finally {
        client && client.release()
    }
}

































/*
export async function UpdatesToUser(NewUserUpdate: User) {
    let client: PoolClient;
    try {
        client = await connectionPool.connect();
        client.query('BEGIN');

        await client.query('update ersapi.users set "username" = $1, "password" = $2, "firstName" = $3, "lastName" = $4, "email" = $5, "role" = $6 where "user_id" = $7',
            [NewUserUpdate.username, NewUserUpdate.password, NewUserUpdate.firstName, NewUserUpdate.lastName, NewUserUpdate.email, NewUserUpdate.role.roleId, NewUserUpdate.userId]);    
       
            client.query('COMMIT');
    } catch (e) {
        client.query('ROLLBACK');
        console.log(e)
        throw UpdatingUserInfoError;
    } finally {
        client && client.release();
    }
}
*/