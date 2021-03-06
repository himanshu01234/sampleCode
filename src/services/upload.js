const path = require('path');
const multer = require('multer');
const fs = require('fs');
var storeimage = multer.diskStorage({
  destination: function (req, file, next) {
    var dir;
    var pathToFile;
    dir = path.dirname(require.main.filename) + '/upload';
    pathToFile = 'upload';
    if (!fs.existsSync(dir)) {
      var dirName = path.dirname(require.main.filename);
      var filePathSplit = pathToFile.split('/');
      for (var index = 0; index < filePathSplit.length; index++) {
        dirName += '/' + filePathSplit[index];
        if (!fs.existsSync(dirName)) {
          fs.mkdirSync(dirName, '0777');
          fs.chmodSync(dirName, '777');
        }
      }
      next(null, dir);
    } else {
      next(null, dir);
    }
  },
  filename: function (req, file, next) {
    const ext = file.mimetype.split('/')[1];
    next(null, file.fieldname + '-' + Date.now() + '.' + ext);
  },
});

upload = multer({
  storage: storeimage,
});
module.exports = upload;
