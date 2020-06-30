import { Role } from "./Role"

   export class User{
      userId: number // primary key
      username: string // not null, unique
      password: string // not null
      firstName: string // not null
      lastName: string // not null
      email: string // not null
      role: Role // not null
  }

  /* //testing dummy data
   let users: User[] = [
    {
        userId: 10000, // primary key
        username: 'smithB1', // not null, unique
        password: 'password@10', // not null
        firstName: 'Bob',// not null
        lastName: 'Smith', // not null
        email: 'bobsmith@google.com', // not null
        role: { roleId : 500, // primary key
        role : 'employee' // not null
        } 
    },
    {
        userId: 10001, // primary key
        username: 'maryAdams', // not null, unique
        password: 'passAdams1', // not null
        firstName: 'Mary',// not null
        lastName: 'Adams', // not null
        email: 'maryAdams@gmail.com', // not null
        role: { roleId : 1000, // primary key
        role : 'finanical manager'
        }
    },

    {
        userId: 10003, // primary key
        username: 'johndoe', // not null, unique
        password: 'doeabc123$', // not null
        firstName: 'John',// not null
        lastName: 'Doe', // not null
        email: 'johnnyboys@gmail.com', // not null
        role: { roleId : 2000, // primary key
        role : 'admin'
        }
    }
    
]
*/