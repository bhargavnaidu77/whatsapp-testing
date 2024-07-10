import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../util/database';

interface SectionAttributes {
  sectionId: number;
  sectionName: string;
}

type SectionCreationAttributes = Optional<SectionAttributes, 'sectionId'>;

class Section extends Model<SectionAttributes, SectionCreationAttributes> implements SectionAttributes {
  public sectionId!: number;
  public sectionName!: string;
}

Section.init(
  {
    sectionId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      field: 'section_id',
    },
    sectionName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'section_name',
    },
  },
  {
    tableName: 'sections',
    sequelize,
    underscored: true,
  },
);

export default Section;
