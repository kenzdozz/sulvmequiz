import codes from '../helpers/statusCode';

const ImageController = {
  upload: (req, res) => {
    if (req.body.image != 'invalid') return res.status(codes.created).send({
      link: 'http://localhost:3030/' + req.body.image,
    });
    res.status(codes.serverError).send({ error: 'cannot upload.' });
  }
}

export default ImageController;
