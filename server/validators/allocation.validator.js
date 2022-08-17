import { body } from "express-validator";
import { get, isEmpty } from "lodash";

const _ = { get, isEmpty };

/**
* Allocation 
*
*/

export const createAllocation = () => {
    return [
        body("employee_id")
            .not().isEmpty().withMessage("employee_id is required"),   
    ]
}


export default { createAllocation }