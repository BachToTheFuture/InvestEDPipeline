var aws = require('aws-sdk');

require('dotenv').config(); // Configure dotenv to load in the .env file

// Configure aws with your accessKeyId and your secretAccessKey
aws.config.update({
  region: process.env.Region, // Put your aws region here
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretKey
});

const S3_BUCKET = process.env.Bucket;
// Now lets export this function so we can call it from somewhere else
exports.sign_s3 = (req,res) => {
  const s3 = new aws.S3();  // Create a new instance of S3
  const fileName = req.body.fileName;
  const fileType = req.body.fileType;
// Set up the payload of what we are sending to the S3 api
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    ContentType: fileType,
  };
// Make a request to the S3 API to get a signed URL which we can use to upload our file
s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      res.json({success: false, error: err});
    }
    // Data payload includes the URL of the signedRequest
    res.json({success: true, data: data});
  });
}

