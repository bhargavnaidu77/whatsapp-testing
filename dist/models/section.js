"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../util/database"));
class Section extends sequelize_1.Model {
}
Section.init({
    sectionId: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        field: 'section_id',
    },
    sectionName: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
        field: 'section_name',
    },
}, {
    tableName: 'sections',
    sequelize: database_1.default,
    underscored: true,
});
exports.default = Section;
