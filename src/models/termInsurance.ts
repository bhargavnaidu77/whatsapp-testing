import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../util/database";
import Customer from "./custmerData";

interface TermInsuranceAttributes {
  id: number;
  userId: string;
  gender?: string;
  dob?: string;
  income?: number;
  smoker?: string;
  contactNo?: string;
  email?: string;
  sumInsured?: string;
  premiumPayingTerm?: string;
  PayingTerm?: string;
  currentPath?: string;
  submit?: boolean;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type TermInsuranceCreationAttributes = Optional<TermInsuranceAttributes, "id">;

class TermInsurance
  extends Model<TermInsuranceAttributes, TermInsuranceCreationAttributes>
  implements TermInsuranceAttributes
{
  public id!: number;
  public userId!: string;
  public gender?: string;
  public dob?: string;
  public income?: number;
  public smoker?: string;
  public contactNo?: string;
  public email?: string;
  public sumInsured?: string;
  public premiumPayingTerm?: string;
  public PayingTerm?: string;
  public currentPath?: string;
  public submit?: boolean;
  public isActive?: boolean;
  public createdAt?: Date;
  public updatedAt?: Date;
}

TermInsurance.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      field: "id",
    },
    userId: {
      type: DataTypes.STRING(12),
      allowNull: false,
      field: "user_id",
      references: {
        model: Customer,
        key: "user_id",
      },
    },
    gender: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "gender",
    },
    dob: {
      type: DataTypes.STRING(15),
      allowNull: true,
      field: "dob",
    },
    income: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "income",
    },
    smoker: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "smoker",
    },
    contactNo: {
      type: DataTypes.STRING(15),
      allowNull: true,
      field: "contact_no",
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "email",
    },
    sumInsured: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "sum_insured",
    },
    premiumPayingTerm: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "premium_paying_term",
    },
    PayingTerm: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "paying_term",
    },
    currentPath: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "welcome_section",
      field: "current_path",
    },
    submit: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "submit",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active",
    },
  },
  {
    tableName: "term_insurance_data",
    sequelize,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["user_id"],
      },
    ],
  }
);

export default TermInsurance;
