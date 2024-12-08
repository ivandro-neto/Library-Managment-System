import { DataTypes, Model, Optional } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../config/db";

interface IUserAttributes {
  id: string;
  username: string;
  email: string;
  password: string;
  roles: number[];
}

interface IUserCreationAttributes extends Optional<IUserAttributes, "id" | "roles"> {}

class User extends Model<IUserAttributes, IUserCreationAttributes> {
  // Método para verificar a senha
  public async checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "The username field cannot be empty." },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "The emial field cannot be empty." },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "The password field cannot be empty." },
      },
    },
    roles: {
      type: DataTypes.JSON,
      allowNull: false,
      },
  },
  {
    sequelize,
    tableName: "users",
    modelName: "user",
    hooks: {
      // Antes de salvar, hash a senha
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
    timestamps: true, // Inclui createdAt e updatedAt
  }
);

export default User;
