export default {

    /**
     * 
     * Maintain the Attributes  i.e. user, company, employee, etc... if any
     * 
     */


    // User Attributes
    user: ["id", "email"],
    userRole: ["first_name", "last_name", "user_role_id"],
    userDeatail: ["id", "user_role_id", "email", "first_name", "last_name", "phone", "dob", "status"],


    //Category Attributes
    category: ["id"],
    categoryDeatail: ["id", "category_name", "status"],
    category_List: [ "id","category_name","status"],


    //Product Attributes
    product: ["id"],
    productDeatail: ["id","category_id", "product_name", "purchase_date","product_description","product_cost","status",],
    product_List: ["id", "product_name"],
    
    // Employee Attributes
    employee: ["id", "first_name", "last_name", "status"],
    combo: ["product_id", ],
    product: ["category_id","product_name"]
}
