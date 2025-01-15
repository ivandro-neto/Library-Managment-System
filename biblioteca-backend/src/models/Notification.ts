import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import User from "./User";
import Waitlist from "./WaitList";
import moment from 'moment'; // Para manipulação de datas
import Loan from "./Loan";

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


export const notifyWaitlist = async (bookId: number) => {
  try {
    // Pega a primeira pessoa da lista de espera
    const waitlistUser = await Waitlist.findOne({ 
      where: { bookId },
      order: [['createdAt', 'ASC']], // Primeiro na fila
    });

    if (waitlistUser) {
      const userId = waitlistUser?.userId;

      // Cria a notificação para o usuário
      await Notification.create({
        title: "Your book is available again!",
        userId,
        message: 'The book you were waiting for is now available! You have 12 hours to pick it up.',
      });

      // Envia notificação ao administrador
      const adminUsers = await User.findAll({ where: { role: 'admin' } });
      adminUsers.forEach(async (admin) => {
        await Notification.create({
          title: "A user has been notified",
          userId: admin.id,
          message: `A user has been notified about the availability of book ID ${bookId}.`,
        });
      });
    }
  } catch (error) {
    console.error('Error notifying waitlist users:', error);
  }
};


export const checkOverdueLoans = async () => {
  try {
    const today = moment().format('YYYY-MM-DD'); // Data de hoje

    // Pegando todos os empréstimos cujo vencimento foi ultrapassado
    const overdueLoans = await Loan.findAll({
      where: {
        dueDate: {
          [Op.lt]: today, // Date anterior à data de hoje
        },
        returned: false, // Não foi devolvido ainda
      },
    });

    for (const loan of overdueLoans) {
      const userId = loan.userId;

      // Notificando o usuário sobre o atraso
      await Notification.create({
        title: "Loan over Due!",
        userId,
        message: `Your loan for book ID ${loan.bookId} is overdue. Please return it as soon as possible.`,
      });

      // Notificando o administrador sobre o atraso
      const adminUsers = await User.findAll({ where: { role: 'admin' } });
      adminUsers.forEach(async (admin) => {
        await Notification.create({
          title: "Loan over Due!",
          userId: admin.id,
          message: `User ID ${userId} has an overdue loan for book ID ${loan.bookId}.`,
        });
      });
    }
  } catch (error) {
    console.error('Error checking overdue loans:', error);
  }
};

const sendReminderForWaitlistUser = async (userId: number, bookId: number) => {
  try {
    // Enviar um lembrete para o usuário 12 horas depois
    cron.schedule('0 12 * * *', async () => {
      await Notification.create({
        userId,
        message: `Reminder: You have 12 hours to pick up the book ID ${bookId} you were waiting for. The offer is about to expire.`,
      });
    });
  } catch (error) {
    console.error('Error sending reminder:', error);
  }
};


export default Notification;
