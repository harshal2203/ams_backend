"use strict";

import Sequelize from "sequelize";
import dbHelper from '../common/dbHelper';
import { userRoles, commonStatuses } from '../common/appConstants';

export default (sequelize, DataTypes) => {
    var UserDetails = sequelize.define("UserDetails", {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        user_role_id: {
            type: Sequelize.INTEGER,
            // defaultValue: userRoles.VENDOR_ROLE.id,
            validate: {
                notEmpty: { msg: "User role is Required" },
            },
        },
        token: {
            type: Sequelize.TEXT,
            defaultStatus: null
          },
          email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: { msg: "Valid email address is required" },
                notEmpty: { msg: "Email is required" },
                /* isUnique: dbHelper.isUnique("UserDetails", "email", {
                    msg: "email is already in use"
                }) */
            }
        },
        password: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: { msg: "Password is required" },
            }
        },
        first_name: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: { msg: "First name is required" },
            }
        },
        last_name: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: { msg: "Last name is required" },
            }
        },
        phone: {
            type: Sequelize.STRING,
            /* unique: true, */
            validate: {
                notEmpty: { msg: "phone number is required" },
                /* isUnique: dbHelper.isUnique("UserDetails", "phone", {
                    msg: "Phone number is already in use"
                }) */
            }
        },
        dob: {
            type: Sequelize.DATEONLY,
            defaultStatus: null,
            validate: {
                notEmpty: { msg: "birth-Date is required" }
            }
        },
        status: {
            type: Sequelize.INTEGER,
            defaultValue: commonStatuses.INACTIVE.id
        },
        email_verified: {
            type: Sequelize.INTEGER,
            defaultValue: 0
          },
          email_verified_at: {
            type: Sequelize.DATE,
            defaultValue: null
          },
          email_verification_code: {
            type: Sequelize.STRING,
            defaultValue: null
          },
        updated_by: {
            type: Sequelize.STRING,
            defaultValue: null
        },
        created_by: {
            type: Sequelize.STRING,
            defaultValue: null
        }
    }, {
        tableName: "user_details",
        updatedAt: "updated_at",
        createdAt: "created_at"
    });


    // Modal associations
    UserDetails.associate = function (models) {
        models.UserDetails.belongsTo(models.User_roles, {
            foreignKey: "user_role_id"
        });

        models.UserDetails.hasOne(models.allocationDetails,{
            foreignKey: "employee_id"
        });
    };

    return UserDetails;
};
