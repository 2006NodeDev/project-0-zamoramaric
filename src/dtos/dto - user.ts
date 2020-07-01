  
// this is going to be a representation of the book data we get from the database
// not what we send to the user, this is the database version

  
export class UserDTO {
    user_id:number
    username:string
	password:string
	firstname: string
	lastname:string
    email:string
	role:string
    role_id:number
}
