import os from 'os';
import multer from 'multer';
import path from 'path';

const multerUpload = field => async (request, response, next) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, os.homedir() + '/.sulvme/public/images')
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now().toString()}${path.extname(file.originalname)}`);
    }
  });

  const fileFilter = (req, file, cb) => {
    const filetypes = ['image/png', 'image/jpeg'];
    const mimetype = filetypes.includes(file.mimetype);
    if (mimetype) return cb(null, true);
    req.body[file.fieldname] = 'invalid';
    return cb(null, false);
  };

  const upload = multer({ storage, fileFilter }).single(field);
  upload(request, response, (err) => {
    console.log(err, request.file)
    if (err) {
      request.body[field] = 'invalid';
    } else {
      const filePath = request.file && request.file.filename 
        ? 'images/' + request.file.filename : 'invalid';
      request.body[field] = filePath;
    }
    return next();
  });
};

export default multerUpload;
