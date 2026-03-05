const path = require('path');

const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const multer = require('multer');
const dotenv = require('dotenv');
const { Upload } = require('@aws-sdk/lib-storage')
const { S3Client } = require('@aws-sdk/client-s3')
const app = express();
dotenv.config();

//Set up AWS S3 bucket configuration
const s3 = new S3Client({
  region: process.env.YOUR_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.YOUR_ACCESS_KEY,
    secretAccessKey: process.env.YOUR_SECRET_KEY,
  },
  useAccelerateEndpoint: true,
});
const bucketName = process.env.YOUR_BUCKET_NAME;

// Set up bodyParser to parse incoming requests
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// Set up CORS
app.use(cors());

//set up header
const upload = multer();

// Receive large file and write in chunks to S3 bucket
app.post('/uploadParallel', upload.single("file"), (req, res) => {
  const file = req.file
  const params = {
    Bucket: bucketName,
    Key: `${Date.now().toString()}_${file.originalName}`,
    Body: file.buffer
  }

  try {
    // upload file to s3 parallelly in chunks, it supports min 5 MB of file size
    const uploadParallel = new Upload({
      client: s3,
      queueSize: 4, // optional concurrency configuration
      partSize: 5542880, // optional size of each part, ex: 5MB
      leavePartsOnError: false, // optional manually handle  dropped parts
      params,
    })

    // checking progress of upload
    uploadParallel.on("httpUploadProgress", progress =>  {
      console.log(progress);
    })

    // after completion of upload
    uploadParallel.done().then(data => {
      console.log("upload completed!", {data})
      return res.json({success: true, data: data.Location})
    })
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    })
  }
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
