import { body } from "express-validator";
import { get, isEmpty } from "lodash";

const _ = { get, isEmpty };

/**
* Copany 
*
*/

export const createCombo = () => {
    return [
        body("allocation_id")
            .not().isEmpty().withMessage("allocation id is required"),

        body("product_id")
            .not().isEmpty().withMessage("product id is required"),

    ]
}


export default { createCombo }