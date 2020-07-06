import { PoolClient } from "pg"; //, QueryResult
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
        //make a transaction
        await client.query('BEGIN;')
        let typeId = await client.query(`select r."type_id" from ersapi.reimbursementtypes ty where ty."type" = $1;`, [newImburs.type])
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


/*

export async function updateReimbursement(infoToChange:Reimbursement){
    let client:PoolClient;
    try{
        client = await connectionPool.connect()
        let result:QueryResult = await client.query(`set schema 'project0';`)
        result = await client.query(buildReimbursementUpdateQuery(infoToChange))
        result = await client.query(`select "reimbursement_id","amount", "date_submitted","date_resolved","description","status_id","status","type_id", "type", "username" from reimbursements r natural join reimbursement_types rt natural join status s inner join users u on r."author_id" = u.user_Id where r."reimbursement_id" = ${infoToChange.reimbursementId};`)
        return result.rows
    }catch(e){
        console.log(e)
        throw new Error('unimplemented error handling')
    }

}*/