import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import User from "./User";

interface INotificationAttributes {
  id: string;
  userId: string; // Relaciona com a tabela de usuários
  title: string; // Título ou assunto da notificação
  message: string; // Detalhe ou corpo da notificação
  type: string; // Tipo (ex.: "info", "warning", "success", "error")
  isRead: boolean; // Se o usuário já leu a notificação
  createdAt: Date; // Data de criação
  updatedAt?: Date; // Última atualização (se necessário)
}

class Notification extends Model<INotificationAttributes> {}

Notification.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true, // Exemplo: "info", "warning", etc.
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Inicia como não lida
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  },
  {
    sequelize,
    tableName: "notifications",
    modelName: "Notification",
  }
);
// Relacionamento: Um usuário pode ter várias notificações
User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

export default Notification;
