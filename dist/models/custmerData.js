"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../util/database"));
class Customer extends sequelize_1.Model {
}
Customer.init({
    userId: {
        type: sequelize_1.DataTypes.STRING(12),
        allowNull: false,
        field: "user_id",
    },
    lifeInsurance: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "life_insurance",
    },
    generalInsurance: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "general_insurance",
    },
    termInsurance: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "term_insurance",
    },
    endowment: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "endowment",
    },
    unitlinked: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "unitlinked",
    },
    pension: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "pension",
    },
    motorInsurance: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "motor_insurance",
    },
    healthInsurance: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "health_insurance",
    },
    travelInsurance: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "travel_insurance",
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: "is_active",
    },
}, {
    tableName: "customer_data",
    sequelize: database_1.default,
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ["user_id"],
        },
    ],
});
exports.default = Customer;
