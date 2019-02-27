import { sequelize, Sequelize } from './sequelize';

const Question = sequelize.define('questions', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  number: { 
    type: Sequelize.INTEGER, 
    unique: 'unique_number_level',
  },
  question: Sequelize.STRING,
  option_a: Sequelize.TEXT,
  option_b: Sequelize.TEXT,
  option_c: Sequelize.TEXT,
  option_d: Sequelize.TEXT,
  option_e: Sequelize.TEXT,
  answer: Sequelize.TEXT,
  category: Sequelize.TEXT,
  level: { 
    type: Sequelize.INTEGER, 
    unique: 'unique_number_level',
  },
});

export default Question;
