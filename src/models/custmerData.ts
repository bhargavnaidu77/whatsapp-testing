import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../util/database";

interface CustomerAttributes {
  userId: string;
  lifeInsurance?: boolean;
  generalInsurance?: boolean;
  termInsurance?: boolean;
  endowment?: boolean;
  unitlinked?: boolean;
  pension?: boolean;
  motorInsurance?: boolean;
  healthInsurance?: boolean;
  travelInsurance?: boolean;
  currentPath?: string | null;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

class Customer extends Model<CustomerAttributes> implements CustomerAttributes {
  public userId!: string;
  public lifeInsurance?: boolean;
  public generalInsurance?: boolean;
  public termInsurance?: boolean;
  public endowment?: boolean;
  public unitlinked?: boolean;
  public pension?: boolean;
  public motorInsurance?: boolean;
  public healthInsurance?: boolean;
  public travelInsurance?: boolean;
  public currentPath?: string | null;
  public isActive?: boolean;
  public createdAt?: Date;
  public updatedAt?: Date;
}

Customer.init(
  {
    userId: {
      type: DataTypes.STRING(12),
      allowNull: false,
      field: "user_id",
    },
    lifeInsurance: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "life_insurance",
    },
    generalInsurance: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "general_insurance",
    },
    termInsurance: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "term_insurance",
    },
    endowment: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "endowment",
    },
    unitlinked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "unitlinked",
    },
    pension: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "pension",
    },
    motorInsurance: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "motor_insurance",
    },
    healthInsurance: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "health_insurance",
    },
    travelInsurance: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "travel_insurance",
    },
    currentPath: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "current_path",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active",
    },
  },
  {
    tableName: "customer_data",
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

export default Customer;
