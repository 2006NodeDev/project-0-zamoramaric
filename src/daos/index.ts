import {Pool} from 'pg'


//Creating pool connection connect to Google Cloud SQL 
export const connectionPool:Pool = new Pool ({    
    host: process.env['LB_Host'],
    user:  process.env['LB_User'],
    password:  process.env['LB_PW'],
    database:  process.env['LB_DB'],
    port:5432,
    max:5
})