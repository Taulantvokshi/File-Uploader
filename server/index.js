const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const stream = require('stream');
const multer = require('multer');

app.use(express.json({ limit: '50mb' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '..', '/public')));

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
var type = upload.single('blob');

app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
  } else {
    next();
  }
});

app.post('/upload', type, (req, res, next) => {
  const writeStream = fs.createWriteStream(
    `./uploads/${new Date().getTime().toString()}.${
      req.file.mimetype.split('/')[1]
    }`
  );

  writeStream.on('error', () => {
    res
      .status(500)
      .json({ message: 'Something went wrong. Data is corrupted' });
  });
  var ReadableData = stream.Readable;
  var streamObj = new ReadableData();
  streamObj.push(req.file.buffer);
  streamObj.push(null);
  streamObj.pipe(writeStream);
  res.status(200).json({ message: 'File has been uploaded successfully' });
});

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public/index.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

app.listen(4000, () => {
  console.log('server');
});
