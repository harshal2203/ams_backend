"use strict";

import Sequelize from "sequelize";
import dbHelper from '../common/dbHelper';
import { userRoles, commonStatuses } from '../common/appConstants';

export default (sequelize, DataTypes) => {
    var categoryDetails = sequelize.define("categoryDetails", {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        
        category_name: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: { msg: "category name is required" },
                isUnique: dbHelper.isUnique("categoryDetails", "category_name", {
                    msg: "category name is already in use"
                })
            }
        },
        
        status: {
            type: Sequelize.INTEGER,
            defaultValue: commonStatuses.INACTIVE.id
        },
        
    }, {
        tableName: "Categories",
        updatedAt: "updated_at",
        createdAt: "created_at"
    });


   // Modal associations
   categoryDetails.associate = function (models) {
    // modal associations goes here...
    models.categoryDetails.hasOne(models.ProductDetails,{
        foreignKey: "category_id"
    });
    
    /* models.categoryDetails.hasOne(models.allocationDetails,{
        foreignKey: "category_id"
    }); */
};

    return categoryDetails;
};
