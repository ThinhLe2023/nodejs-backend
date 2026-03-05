const AWS = require('aws-sdk')
const path = require('path');

const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const multer = require('multer');
const dotenv = require('dotevn')
const app = express();
dotenv.config();

//Set up AWS S3 bucket configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.YOUR_ACCESS_KEY,
  secretAccessKey: process.env.YOUR_SECRET_KEY,
  region: process.env.YOUR_BUCKET_REGION,
  useAccelerateEndpoint: true,
});
const bucketName = process.env.YOUR_BUCKET_NAME;

// Set up bodyParser to parse incoming requests
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

//Initial multipart upload and return uploadId
app.post('/initiateUpload', async (req, res) => {
  try {
    const {fileName} = req.body;
    const params = {
      Bucket: bucketName,
      Key: fileName,
    };
    const upload = await s3.createMultipartUpload(params).promise();
    res.json({uploadId: upload.UploadId});
  } catch (error) {
    console.log(error);
    res.status(500).json({success:false, message: 'Error initiating upload' });
  }
});

//Receive chunk and write it to S3 bucket
app.post('/upload', upload.single("file"), (req, res) => {
  const { index, fileName } = req.body;
  const file = req.file;

  const s3Params = {
    Bucket: bucketName,
    Key: fileName,
    Body: file.buffer,
    PartNumber: Number(index) + 1,
    UploadId: req.query.uploadId
  };

  s3.uploadPart(s3Params, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({success: false, message: 'Error uploading chunk'});
    }

    return res.json({success: true, message: 'Chunk uploaded successfully.'});
  })
});

// Complete multipart upload
app.post('/completeUpload', (req, res) => {
  const { fileName } = req.query;
  const s3Params = {
    Bucket: bucketName,
    Key: fileName,
    UploadId: req.query.uploadId,
  };

  s3.listParts(s3Params, (err, data) => {
    if(err) {
      console.log(err);
      return res.status(500).json({success: false, message: 'Error listing parts.'});
    }

    const parts = [];
    data.Parts.forEach(part => {
      parts.push({
        Etag: part.ETag,
        PartNumber:  part.PartNumber,
      });
    });
    
    s3Params.MultipartUpload = {
      Parts: parts
    };

    s3.completeMultipartUpload(s3Params, (err, data) => {
      if(err) {
        console.log(err);
        return res.status(500).json({success: false, message: 'Error Completing upload.'});
      }

      console.log('data', data)
      return res.json({success: true, message: 'Upload complete', data: data.Location});
    });
  });
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    'mongodb+srv://maximilian:9u4biljMQc4jjqbe@cluster0-ntrwp.mongodb.net/messages?retryWrites=true'
  )
  .then(result => {
    app.listen(8080);
  })
  .catch(err => console.log(err));
