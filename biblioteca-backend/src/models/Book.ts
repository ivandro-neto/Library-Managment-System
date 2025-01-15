import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

// Interface para atributos do modelo
interface IBookAttributes {
  id: string;
  title: string;
  author: string;
  isbn: string;
  status: string;
  description: string;
  quantity: number;
  releaseDate: Date;
}

// Interface para criação parcial (sem `id`, gerado automaticamente)
interface IBookCreationAttributes extends Optional<IBookAttributes, "id"> {}

class Book extends Model<IBookAttributes, IBookCreationAttributes> {}

Book.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "The title cannot be empty" },
        len: { args: [3, 255], msg: "The title must be between 3 and 255 characters" },
      },
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "The author cannot be empty" },
        len: { args: [3, 255], msg: "The author name must be between 3 and 255 characters" },
      },
    },
    isbn: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "The ISBN cannot be empty" },
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "available"
    },
    description: {
      type: DataTypes.TEXT, // Alterado para TEXT para suportar descrições maiores
      allowNull: false,
      validate: {
        notEmpty: { msg: "The description cannot be empty" },
      },
    },
    quantity: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        notNull : { msg : "The quantity cannot be null."},
      }
    },
    releaseDate: {
      type: DataTypes.DATEONLY, // Use DATEONLY para trabalhar apenas com data (sem horário)
      allowNull: false,
      validate: {
        isDate: { msg: "The release date must be a valid date", args: false },
      },
    },
  },
  {
    sequelize,
    tableName: "books",
    modelName: "book",
    timestamps: true, // Adiciona createdAt e updatedAt
  }
);

export default Book;
