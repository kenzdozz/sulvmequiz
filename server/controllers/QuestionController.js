import Question from "../database/Question";
import Response from "../helpers/Response";
import codes from "../helpers/statusCode";
import { Op } from 'sequelize';


const QuestionController = {
  getOne: async (req, res) => {
    let { id } = req.params;
    id = isNaN(parseInt(id, 10)) ? 1 : parseInt(id, 10);

    try {
      const question = await Question.findByPk(id);
      if (!question) return new Response.send(res, codes.notFound, {
        error: 'Question not found.',
      });
      return new Response.send(res, codes.success, {
        data: question,
      });
    } catch (error) { console.log(error); return new Response.handleError(res, error); }
  },

  getByNumber: async (req, res) => {
    const { category, level } = req.params;
    let { number } = req.params;
    number = isNaN(parseInt(number, 10)) ? 1 : parseInt(number, 10);

    try {
      const question = await Question.findOne({
        where: { number, category, level },
      });
      if (!question) return new Response.send(res, codes.notFound, {
        error: 'Question not found.',
      });
      return new Response.send(res, codes.success, {
        data: question,
      });
    } catch (error) { console.log(error); return new Response.handleError(res, error); }
  },

  create: async (req, res) => {
    const { category, level } = req.params;
    const {
      number, question, answer, option_a, option_b, option_c, option_d, option_e
    } = req.body;

    try {
      const newQuestion = await Question.create({
        number, question, answer, option_a,
        option_b, option_c, option_d, option_e,
        category, level,
      });
      return new Response.send(res, codes.success, {
        data: newQuestion
      });
    } catch (error) {
      const err = error.name === 'SequelizeUniqueConstraintError' ? 'Number already exists.' : error;
      return new Response.handleError(res, err); 
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const {
      number, question, answer, option_a, option_b, option_c, option_d, option_e
    } = req.body;

    try {
      const newQuestion = await Question.update({
        number, question, answer, option_a,
        option_b, option_c, option_d, option_e,
      },
      {returning: true, where: { id } });
      return new Response.send(res, codes.success, {
        data: newQuestion
      });
    } catch (error) { 
      const err = error.name === 'SequelizeUniqueConstraintError' ? 'Number already exists.' : error;
      return new Response.handleError(res, err); 
    }
  },

  getAll: async (req, res) => {
    let { goto: gotoId, page, limit } = req.query;
    const { category, level } = req.params;
    
    limit = isNaN(parseInt(limit, 10)) ? 50 : parseInt(limit, 10);
    page = isNaN(parseInt(page, 10)) ? 1 : parseInt(page, 10);

    const offset = (page - 1) * limit;

    let number = { [Op.gt]: 0 };
    if (gotoId) {
      gotoId = gotoId.split(' ');
      number = { [Op.in]: gotoId };
    }

    try {
      const questions = await Question.findAndCountAll({
        where: { category, level, number },
        limit, offset
      });
      return new Response.send(res, codes.success, {
        data: questions.rows,
        count: questions.rows.length,
        pageCount: Math.ceil(questions.count / limit),
      });
    } catch (error) { console.log(error); return new Response.handleError(res, error); }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    try {
      await Question.destroy({
        where: { id }
      });
      return new Response.send(res, codes.success, {
        message: 'Deleted successfully.',
      });
    } catch (error) { return new Response.handleError(res, error); }
  }
}

export default QuestionController;
