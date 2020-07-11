import { PoolClient, QueryResult } from "pg"; //, QueryResultimport { QueryResult } from "pg"; //, QueryResult

import { connectionPool } from ".";
//import { UserDTOtoUserConver } from "../utils/UserDTOUserConvertor";
import {ReimbDTOtoReimbConverter} from "../utils/ReimbursDTOReimbursConvertor";
//import { UserNotFoundError } from "../errors/UserNotFoundError";
//mport { User } from "../models/User";
import { Reimbursement } from "../models/Reimbursement";
//import {ReimbursNotFoundError} from "../errors/ReimbursNotFound"
//import {reimbursInputError} from "../errors/ReimbursUserInputError"

// this is going to contain all the functions that interact wit hthe book table

//find reimbursemnt by status
export async function getReimburByStatus(status: number):Promise<Reimbursement[]> {
    let client: PoolClient
    try {
        //get a connection
        client = await connectionPool.connect()
        let results = await client.query(`select r."reimbursement_id", 
        r."author", 
        r."amount", 
        r."date_submitted",
        r."date_resolved",
        r."description",
        r."resolver",
        rs."status_id", 
        rs."status",
        rt."type_id",
        rt."type"
            from ersapi.reimbursement r 
    left join ersapi.reimbursementstatus rs
        on r."status" = rs."status_id" 
    left join ersapi.reimbursementtype rt
        on r."type" = rt."type_id"
            where r."status" = $1
    order by r.date_submitted;`,[status] )
    return results.rows.map(ReimbDTOtoReimbConverter)
} catch (e) {
    console.log(e)
    throw new Error('Unhandled Error Occured')
} finally {
    client && client.release()
}
}
//find reimbursemnt by user ID
export async function getReimburByUserId(userId: number):Promise<Reimbursement[]> {
    let client: PoolClient
    try {
        //get a connection
        client = await connectionPool.connect()
        let results = await client.query(`select r."reimbursement_id", 
        r."author", 
        r."amount", 
        r."date_submitted",
        r."date_resolved",
        r."description", 
        r."resolver",
        rs."status_id",
        rs."status",
        rt."type_id", 
        rt."type"
        from ersapi.reimbursement r 
        left join ersapi.reimbursementstatus rs
        on r."status" = rs."status_id" 
        left join ersapi.reimbursementtype rt
        on r."type" = rt."type_id"
    left join ersapi.users u 
        on r."author" = u."user_id"
            where u."user_id" = $1
    order by r.date_submitted;`, [userId])
    return results.rows.map(ReimbDTOtoReimbConverter)
} catch (e) {
    console.log(e)
    throw new Error('Unhandled Error Occured')
} finally {
    client && client.release()
}
}

//save a new reimbursement

export async function saveNewReimbur(newReimbur:Reimbursement):Promise<Reimbursement>{
   // export async function submitNewReimb(newReimb: Reimbursement) : Promise <Reimbursement>{
        let client:PoolClient
        console.log(newReimbur)
    
        try{
            client = await connectionPool.connect() //gives you a promise, so you take it out of the stack to prevent blocking
            
            let result:QueryResult = await client.query(`insert into ersapi."reimbursement" ("author", "amount", "date_submitted", "date_resolved", "description", "resolver", "status", "type")
                                                            values ($1, $2, '$3', '$4', '$5', $6, $7, $8) returning "reimbursement_id"`, 
                                                            [newReimbur.author, newReimbur.amount, newReimbur.date_submitted, newReimbur.date_resolved, 
                                                                newReimbur.description, newReimbur.resolver, newReimbur.status, newReimbur.type])   
        newReimbur.reimbursementId = result.rows[0].reimbursement_id
            return newReimbur  
        }catch (err){    
            console.log(err)
            throw new Error('Unimplimented id error')     
        }finally{
            client && client.release()
        }
    }
    
    /*
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        //if you have multiple querys, you should make a transaction
        await client.query('BEGIN;')//start a transaction
        let roleId = await client.query(`select r."role_id" from lightlyburning.roles r where r."role" = $1`, [newReimbur.role])
        if(roleId.rowCount === 0){
            throw new Error('Role Not Found')
        }
        roleId = roleId.rows[0].role_id
        let results = await client.query(`insert into lightlyburning.users ("username", "password","email","role")
                                            values($1,$2,$3,$4) returning "user_id" `,//allows you to return some values from the rows in an insert, update or delete
                                            [newReimbur.username, newReimbur.password, newReimbur.email, roleId])
                                            newReimbur.userId = results.rows[0].user_id
        await client.query('COMMIT;')//ends transaction
        return newReimbur

    }catch(e){
        client && client.query('ROLLBACK;')//if a js error takes place, undo the sql
        if(e.message === 'Role Not Found'){
            throw new reimbursInputError()// role not found error
        }
        //if we get an error we don't know 
        console.log(e)
        throw new Error('Unhandled Error Occured')
    }finally{
        client && client.release();
    }
}

*/






















/*
export async function saveNewReimbur(newImburs:Reimbursement):Promise<Reimbursement>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        //make a transaction
        await client.query('BEGIN;')
        let typeId = await client.query(`select r."type_id" from ersapi.reimbursementtype ty where ty."type" = $1;`, [newImburs.type])
        if(typeId.rowCount === 0){
            throw new Error('This Type Was  Not Found')
        }
        typeId = typeId.rows[0].type_id
        let results = await client.query(`insert into ersapi.reimbursement ("author", "amount","date_submitted","description", "status", "type")
                                            values($1,$2,$3,$4,$5,$6) returning "reimbursement_id";`,
                                            [newImburs.author, newImburs.amount, newImburs.date_submitted,newImburs.description,newImburs.status.statusId, typeId])
        newImburs.reimbursementId = results.rows[0].reimbursement_id
        await client.query('COMMIT;')
        return newImburs

    }catch(e){
        client && client.query('ROLLBACK;')
        if(e.message === 'This Type Was Not Found' || e.message === 'This Status Was Not Found'){
            throw new reimbursInputError()
        }
        console.log(e)
        throw new Error('Unhandled Error Occured')
    }finally{
        client && client.release();
    }
}



*/