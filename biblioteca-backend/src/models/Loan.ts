import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";
import Book from "./Book";

// Interface para atributos do modelo
interface ILoanAttributes {
  id: string;
  bookId: string;
  userId: string;
  status: "Reserved" | "Returned" | "Late";
  dueDate: Date;
  code: number;
}

// Interface para criação parcial (sem `id`, gerado automaticamente)
interface ILoanCreationAttributes extends Optional<ILoanAttributes, "id" | "status"> {}

class Loan extends Model<ILoanAttributes, ILoanCreationAttributes> {}

Loan.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    bookId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Book,
        key: "id",
      },
      onDelete: "CASCADE", // Deleta os empréstimos relacionados se o livro for excluído
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notEmpty: { msg: "The userId cannot be empty" },
      },
    },
    status: {
      type: DataTypes.ENUM("reserved", "returned", "late"),
      allowNull: false,
      defaultValue: "Reserved",
      validate: {
        isIn: {
          args: [["reserved", "returned", "late"]],
          msg: "Invalid status. Allowed values: Reserved, Returned, Late",
        },
      },
    },
    dueDate: {
      type: DataTypes.DATEONLY, // Apenas data (sem horário)
      allowNull: false,
      validate: {
        isDate: { msg: "The due date must be a valid date" },
      },
    },
    code:{
      type: DataTypes.NUMBER,
      allowNull : false,
      autoIncrementIdentity: true 
    }
  },
  {
    sequelize,
    tableName: "loans",
    modelName: "loan",
    timestamps: true, // Adiciona createdAt e updatedAt
  }
);

// Estabelecendo relação entre Loan e Book
Loan.belongsTo(Book, { foreignKey: "bookId", as: "book" });

export default Loan;
