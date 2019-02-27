import Sequelize from 'sequelize';

const sequelize = new Sequelize('database', null, null, {
  host: 'localhost',
  dialect: 'sqlite',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },

  storage: './storage.sqlite',
});

export { Sequelize, sequelize };
