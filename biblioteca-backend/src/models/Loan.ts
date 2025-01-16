import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";
import Book from "./Book";

// Interface para atributos do modelo
interface ILoanAttributes {
  id: string;
  bookId: string;
  userId: string;
  status: "reserved" | "returned" | "late";
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
      defaultValue: "reserved",
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
      unique: true
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


async function generateUniqueDeliveryCode(): Promise<number> {
  let codigo: number;
  let isUnique = false;

  while (!isUnique) {
    codigo = Math.floor(100000 + Math.random() * 900000);

    // Verifica no banco de dados se o código já existe
    const existingLoan = await Loan.findOne({ where: { code: codigo } });
    if (!existingLoan) {
      isUnique = true;
    }
  }

  return codigo;
}

// Hook para gerar código único antes de criar um empréstimo
Loan.beforeValidate(async (loan) => {
  if (!loan.code) {
    loan.code = await generateUniqueDeliveryCode();
  }
});
export default Loan;
