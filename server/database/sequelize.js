import Sequelize from 'sequelize';
import os from 'os';

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

  storage: os.homedir() + '/.sulvme/storage.sqlite',
});

export { Sequelize, sequelize };
