import { body } from "express-validator";
import { get, isEmpty } from "lodash";

const _ = { get, isEmpty };

/**
* Copany 
*
*/

export const createCategory = () => {
    return [
        body("category_name")
            .not().isEmpty().withMessage("Category name is required"),   
    ]
}


export default { createCategory }