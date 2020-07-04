import { ReimbursementDTO } from "../dtos/dtos - reimbursement";
import { Reimbursement } from "../models/Reimbursement";

//ReimbursementDTO takes objects in database format and converts it to Reimbursement model object
export function ReimbDTOtoReimbConverter(reimbursDTO: ReimbursementDTO): Reimbursement {
    return {
        reimbursementId: reimbursDTO.reimbursement_id,
        author: reimbursDTO.author,
        amount: reimbursDTO.amount,
        date_submitted: new Date(reimbursDTO.date_submitted), 
        date_resolved: new Date(reimbursDTO.date_resolved),
        description: reimbursDTO.description,
        resolver: reimbursDTO.resolver,
        status: {
            status: reimbursDTO.status,
            statusId: reimbursDTO.status_id
        },
        type: {
            type: reimbursDTO.type,
            typeId: reimbursDTO.type_id
        }
    }
}