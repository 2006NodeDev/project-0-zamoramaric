import { ReimbursementDTO } from "../dtos/dtos - reimbursement";
import { Reimbursement } from "../models/Reimbursement";

//ReimbursementDTO takes objects in database format and converts it to Reimbursement model object
export function ReimbDTOtoReimbConverter(rdto: ReimbursementDTO): Reimbursement {
    return {
        reimbursementId: rdto.reimbursement_id,
        author: rdto.author,
        amount: rdto.amount,
        date_submitted: new Date(rdto.date_submitted), 
        date_resolved: new Date(rdto.date_resolved),
        description: rdto.description,
        resolver: rdto.resolver,
        status: {
            status: rdto.status,
            statusId: rdto.status_id
        },
        type: {
            type: rdto.type,
            typeId: rdto.type_id
        }
    }
}