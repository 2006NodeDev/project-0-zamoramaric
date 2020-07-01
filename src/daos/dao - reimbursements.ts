import { PoolClient } from "pg";
import { connectionPool } from ".";
//import { UserDTOtoUserConver } from "../utils/UserDTOUserConvertor";
import {ReimbDTOtoReimbConverter} from "../utils/ReimbursDTOReimbursConvertor";
import { UserNotFoundError } from "../errors/UserNotFoundError";
//mport { User } from "../models/User";
import { Reimbursement } from "../models/Reimbursement";

// this is going to contain all the functions that interact wit hthe book table


export async function getReimburByStatus( status: number):Promise<Reimbursement> {
   //Reimbursement[]
    let client: PoolClient
    try {
        //get a connection
        client = await connectionPool.connect()
        //send the query
        let results = await client.query(         
                `select r."reimbursement_id", 
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
            order by r.date_submitted;`,[status])   
                if(results.rowCount === 0){
            throw new Error('User Not Found')
        }
        return ReimbDTOtoReimbConverter(results.rows[0])//there should only ever be one row
       // return results.rows.map(ReimbDTOtoReimbConverter);

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






