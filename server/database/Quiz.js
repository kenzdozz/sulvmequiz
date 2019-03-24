import { sequelize, Sequelize } from './sequelize';

const Quiz = sequelize.define('quizzes', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  answered_numbers: Sequelize.STRING,
  category: Sequelize.TEXT,
  level: Sequelize.INTEGER,
  timer: Sequelize.INTEGER,
  questions: Sequelize.STRING,
  status: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  }
});

export default Quiz;
