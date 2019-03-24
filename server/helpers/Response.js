import codes from './statusCode';

class Response {
  static send(res, status, data) {
    res.status(status).send({
      status,
      ...data,
    });
  }

  static handleError(res, error = '') {
    // eslint-disable-next-line no-console
    console.log(error);
    return Response.send(res, codes.serverError, {
      error: error || 'Internal server error',
    });
  }
}

export default Response;
