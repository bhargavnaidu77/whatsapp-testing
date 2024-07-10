"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../util/database"));
const custmerData_1 = __importDefault(require("./custmerData"));
class TermInsurance extends sequelize_1.Model {
}
TermInsurance.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        field: "id",
    },
    userId: {
        type: sequelize_1.DataTypes.STRING(12),
        allowNull: false,
        field: "user_id",
        references: {
            model: custmerData_1.default,
            key: "user_id",
        },
    },
    gender: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: true,
        field: "gender",
    },
    dob: {
        type: sequelize_1.DataTypes.STRING(15),
        allowNull: true,
        field: "dob",
    },
    income: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        field: "income",
    },
    smoker: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: true,
        field: "smoker",
    },
    contactNo: {
        type: sequelize_1.DataTypes.STRING(15),
        allowNull: true,
        field: "contact_no",
    },
    email: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
        field: "email",
    },
    sumInsured: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
        field: "sum_insured",
    },
    premiumPayingTerm: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
        field: "premium_paying_term",
    },
    PayingTerm: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
        field: "paying_term",
    },
    currentPath: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "welcome_section",
        field: "current_path",
    },
    submit: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "submit",
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: "is_active",
    },
}, {
    tableName: "term_insurance_data",
    sequelize: database_1.default,
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ["user_id"],
        },
    ],
});
exports.default = TermInsurance;
