import { PoolClient } from "pg";
import { connectionPool } from ".";
//import { UserDTOtoUserConver } from "../utils/UserDTOUserConvertor";
import {ReimbDTOtoReimbConverter} from "../utils/ReimbursDTOReimbursConvertor";
//import { UserNotFoundError } from "../errors/UserNotFoundError";
//mport { User } from "../models/User";
import { Reimbursement } from "../models/Reimbursement";
//import {ReimbursNotFoundError} from "../errors/ReimbursNotFound"
import {reimbursInputError} from "../errors/ReimbursUserInputError"

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
    //if we get an error we don't know 
    console.log(e)
    throw new Error('Unhandled Error Occured')
} finally {
    //let the connectiopn go back to the pool
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
    //if we get an error we don't know 
    console.log(e)
    throw new Error('Unhandled Error Occured')
} finally {
    //let the connectiopn go back to the pool
    client && client.release()
}
}

//save a new reimbursement
export async function saveNewReimbur(newImburs:Reimbursement):Promise<Reimbursement>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        //if you have multiple querys, you should make a transaction
        await client.query('BEGIN;')//start a transaction
        let typeId = await client.query(`select r."type_id" from ersapi.reimbursementtypes ty where ty."type" = $1`, [newImburs.type])
        if(typeId.rowCount === 0){
            throw new Error('Role Not Found')
        }
        typeId = typeId.rows[0].type_id
        let results = await client.query(`insert into ersapi.reimbursement ("author", "amount","date_submitted","description", "status", "type")
                                            values($1,$2,$3,$4,$5,$6) returning "reimbursement_id";`,//allows you to return some values from the rows in an insert, update or delete
                                            [newImburs.author, newImburs.amount, newImburs.date_submitted,newImburs.description,newImburs.status.statusId, typeId])
        newImburs.reimbursementId = results.rows[0].reimbursement_id
        await client.query('COMMIT;')//ends transaction
        return newImburs

    }catch(e){
        client && client.query('ROLLBACK;')//if a js error takes place, undo the sql
        if(e.message === 'Type Not Found' || e.message === 'Status Not Found'){
            throw new reimbursInputError()// role not found error
        }
        //if we get an error we don't know 
        console.log(e)
        throw new Error('Unhandled Error Occured')
    }finally{
        client && client.release();
    }
}



