"use strict";

import Sequelize from "sequelize";
import dbHelper from '../common/dbHelper';
import { commonStatuses } from '../common/appConstants';


export default (sequelize, DataTypes) => {
    var allocationDetails = sequelize.define("allocationDetails", {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },

        combo_id: {
            type: Sequelize.STRING,
            unique: true,
            validate: {
                notEmpty: { msg: "combo id is required" },
            },
            comment: '(combo id KOLI0001)'
        },
        employee_id: {
            type: Sequelize.INTEGER,
            validate: {
                notEmpty: { msg: "employee_id is required" },
                isUnique: dbHelper.isUnique("allocationDetails", "employee_id", {
                    msg: "employee_id is already in use"
                })
            }
        },
       
        status: {
            type: Sequelize.INTEGER,
            defaultValue: commonStatuses.INACTIVE.id
        },

    }, {
        tableName: "allocations",
        updatedAt: "updated_at",
        createdAt: "created_at"
    });


    // Modal associations
    allocationDetails.associate = function (models) {
        // modal associations goes here...
       
        models.allocationDetails.belongsTo(models.UserDetails, {
            foreignKey: "employee_id"
        });

        models.allocationDetails.hasOne(models.comboDetails,{
            foreignKey: "allocation_id"
        })
    };

    return allocationDetails;
};
