import { UserDTO } from "../dtos/dto - user";
import { User } from "../models/User";

//declaring the user model variables for conversion
export function UserDTOtoUserConver(udto: UserDTO): User{
    return {
        userId: udto.user_id,
        username: udto.username,
        password: udto.password,
        firstName: udto.firstname,
        lastName: udto.lastname,
        email: udto.email,
        role: {
            role: udto.role,
            roleId: udto.role_id
        }
    }
}

/*
//import { UserDTO } from "../dtos/dao-user";
import {UserDTO} from "../dtos/dto - user";
import { User } from "../models/User";
//import { Role } from "../models/Role";
//import { Genre } from "../models/Genre";

// works perfectly with the map function
export function UserDTOtoUserConvertor(udto:UserDTO):User{
   // let role:Role[] = [];
   // for(const r of bto.roles){
      //  role.push({roleId:0, role:r})// this si a problem to solve in the future
    
    return {
        userId:udto.userId,
        username: udto.username, // not null, unique
        password: udto.password, // not null
        firstName: udto.firstName, // not null
        lastName: udto.lastName, // not null
        email: udto.email, // not null
        role:{
            role: udto.role,
            roleId: udto.roleId
        }
    }
}*/
