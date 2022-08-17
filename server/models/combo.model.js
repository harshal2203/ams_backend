"use strict";

import Sequelize from "sequelize";
import dbHelper from '../common/dbHelper';
import { commonStatuses } from '../common/appConstants';


export default (sequelize, DataTypes) => {
    var comboDetails = sequelize.define("comboDetails", {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },

        allocation_id: {
            type: Sequelize.INTEGER,
            validate: {
                notEmpty: { msg: "allocation id is required" },
            }
        },
        product_id: {
            type: Sequelize.INTEGER,
            validate: {
                notEmpty: { msg: "product_id is required" },
                isUnique: dbHelper.isUnique("comboDetails", "product_id", {
                    msg: "product_id is already in use"
                })
            }
        },
       
        status: {
            type: Sequelize.INTEGER,
            defaultValue: commonStatuses.INACTIVE.id
        },

    }, {
        tableName: "combo",
        updatedAt: "updated_at",
        createdAt: "created_at"
    });
    

    // Modal associations
    comboDetails.associate = function (models) {
        // modal associations goes here...
       
        models.comboDetails.belongsTo(models.allocationDetails, {
            foreignKey: "allocation_id"
        });

        models.comboDetails.belongsTo(models.ProductDetails, {
            foreignKey: "product_id"
        });
    };

    return comboDetails;
};
