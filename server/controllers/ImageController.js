import FroalaEditor from 'wysiwyg-editor-node-sdk/lib/froalaEditor';

const ImageController = {
  upload: (req, res) => {
    FroalaEditor.Image.upload(req, '../public/images/', function (err, data) {
      if (err) {
        return res.send(JSON.stringify(err));
      }
      res.send({
        link: 'http://localhost:30303' + data.link.split('public')[1],
      });
    });
  },
  delete: (req, res) => {
    FroalaEditor.File.delete(req.body.src, function (err) {
      if (err) {
        return res.send(JSON.stringify(err));
      }
      return res.end();
    });
  }
}

export default ImageController;
