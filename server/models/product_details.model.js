"use strict";

import Sequelize from "sequelize";
import dbHelper from '../common/dbHelper';
import { userRoles, commonStatuses } from '../common/appConstants';

export default (sequelize, DataTypes) => {
    var ProductDetails = sequelize.define("ProductDetails", {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        category_id: {
            type: Sequelize.INTEGER,
            // defaultValue: userRoles.VENDOR_ROLE.id,
            validate: {
                notEmpty: { msg: "category_id is Required" },
            },
        },
          product_name: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: { msg: "Product name is required" },
            }
        },
       
        purchase_date: {
            type: Sequelize.DATEONLY,
            defaultStatus: null,
            validate: {
                notEmpty: { msg: "Purchase date is required" }
            }
        },

       /*  product_qty: {
            type: Sequelize.INTEGER,
            validate: {
                notEmpty: { msg: "qty is Required" },
            },
        }, */
        product_description: {
            type: Sequelize.TEXT,
            validate: {
                notEmpty: { msg: "Product description is required" },
            }
        },

        product_cost: {
            type: Sequelize.INTEGER,
            // defaultValue: userRoles.VENDOR_ROLE.id,
            validate: {
                notEmpty: { msg: "assign to is Required" },
            },
        },

        status: {
            type: Sequelize.INTEGER,
            defaultValue: commonStatuses.INACTIVE.id
        },
       
    }, {
        tableName: "product_details",
        updatedAt: "updated_at",
        createdAt: "created_at"
    });


    // Modal associations
    ProductDetails.associate = function (models) {
        models.ProductDetails.belongsTo(models.categoryDetails, {
            foreignKey: "category_id"
        });

        models.ProductDetails.hasOne(models.comboDetails,{
            foreignKey: "product_id"
        })
    };


    return ProductDetails;
};
