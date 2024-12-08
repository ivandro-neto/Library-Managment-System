import {Sequelize} from 'sequelize'

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './src/config/database.sqlite',
  logging: console.log,
})

export default sequelize
