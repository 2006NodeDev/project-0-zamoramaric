/*
The Reimbursement model is used to represent a single
reimbursement that an employee would submit
*/

import { ReimbursementStatus } from "./ReimbursementStatus"
import { ReimbursementType } from "./ReimbursementType"


export class Reimbursement{
  reimbursementId: number
  author: number
  amount: number 
  date_submitted: Date
  date_resolved: Date 
  description: string
  resolver: number
  status: ReimbursementStatus 
  type: ReimbursementType 
}
