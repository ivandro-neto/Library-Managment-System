import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";
import Book from "./Book";

interface IWaitlistAttributes {
  id: string;
  bookId: string;
  userId: string;
  status: "Waiting" | "Notified" | "Cancelled"; // Status da posição na lista de espera
  position: number;
  addedAt: Date; // Data em que o usuário foi adicionado à lista de espera
  notifiedAt?: Date | null; // Data em que o usuário foi notificado (opcional)
}

// Interface para criação parcial (sem `id` e campos opcionais)
interface IWaitlistCreationAttributes extends Optional<IWaitlistAttributes, "id" | "status" | "notifiedAt"> {}

class Waitlist extends Model<IWaitlistAttributes, IWaitlistCreationAttributes> {}

Waitlist.init(
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
      onDelete: "CASCADE", // Se o livro for deletado, remove a entrada na lista de espera
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notEmpty: { msg: "The userId cannot be empty" },
      },
    },
    status: {
      type: DataTypes.ENUM("Waiting", "Notified", "Cancelled"),
      allowNull: false,
      defaultValue: "Waiting",
      validate: {
        isIn: {
          args: [["Waiting", "Notified", "Cancelled"]],
          msg: "Invalid status. Allowed values: Waiting, Notified, Cancelled",
        },
      },
    },
    position:{
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true
    },
    addedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    notifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "waitlists",
    modelName: "waitlist",
    timestamps: true, // Inclui createdAt e updatedAt
  }
);

// Estabelecendo relação com o modelo Book
Waitlist.belongsTo(Book, { foreignKey: "bookId", as: "book" });

export default Waitlist;
