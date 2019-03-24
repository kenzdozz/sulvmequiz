import Quiz from "../database/Quiz";
import Response from "../helpers/Response";
import codes from "../helpers/statusCode";


const QuizController = {
  create: async (req, res) => {
    const { category, level, questions, timer } = req.body;

    try {
      const newQuiz = await Quiz.create({
        category, level, questions, timer,
      });
      return new Response.send(res, codes.success, {
        data: newQuiz
      });
    } catch (error) {
      return new Response.handleError(res, error); 
    }
  },

  endQuiz: async (req, res) => {
    const { id } = req.params;

    try {
      const newQuiz = await Quiz.update({ status: false },
      {returning: true, where: { id } });
      return new Response.send(res, codes.success, {
        data: newQuiz
      });
    } catch (error) {
      return new Response.handleError(res, error); 
    }
  },

  setAnswer: async (req, res) => {
    const { id } = req.params;
    const { numbers: answered_numbers } = req.body;
    
    console.log(answered_numbers);
    
    try {
      const newQuiz = await Quiz.update({ answered_numbers },
      {returning: true, where: { id } });
      console.log(newQuiz)
      return new Response.send(res, codes.success, {
        data: newQuiz
      });
    } catch (error) {
      return new Response.handleError(res, error); 
    }
  },

  getLatest: async (req, res) => {
    try {
      const quiz = await Quiz.findOne({
        where: { status: true },
        order: [[ 'id', 'DESC' ]],
      });
      return new Response.send(res, codes.success, {
        data: quiz,
      });
    } catch (error) { console.log(error); return new Response.handleError(res, error); }
  },

  getOne: async (req, res) => {
    let { id } = req.params;
    id = isNaN(parseInt(id, 10)) ? 1 : parseInt(id, 10);

    try {
      const quiz = await Quiz.findByPk(id);
      if (!quiz) return new Response.send(res, codes.notFound, {
        error: 'Quiz not found.',
      });
      return new Response.send(res, codes.success, {
        data: quiz,
      });
    } catch (error) { console.log(error); return new Response.handleError(res, error); }
  },

  getAll: async (req, res) => {
    let { goto: gotoId, page } = req.query;
    const limit = 50;
    page = isNaN(parseInt(page, 10)) ? 1 : parseInt(page, 10);
    const offset = (page - 1) * limit;

    if (gotoId) {
      gotoId = gotoId.split(' ');
    }

    try {
      const quizes = await Quiz.findAndCountAll({
        limit, offset
      });
      return new Response.send(res, codes.success, {
        data: quizes.rows,
        count: Math.ceil(quizes.count / limit),
      });
    } catch (error) { console.log(error); return new Response.handleError(res, error); }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    try {
      await Quiz.destroy({
        where: { id }
      });
      return new Response.send(res, codes.success, {
        message: 'Deleted successfully.',
      });
    } catch (error) { return new Response.handleError(res, error); }
  }
}

export default QuizController;
