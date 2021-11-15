# InvestED Upload Portal

This project contains the frontend (React.js) and backend (Node.js) support for InvestED's CSV file upload portal. 

## Setup

### Dependencies

In the project directory, open the Terminal and execute `npm install` to download the needed dependencies. 

Important packages that are used include `aws-sdk`, `cors`, `dotenv`, and `express` for the Node.js web server backend, and `react` and `axios` for the React.js frontend.

### Backend

Create a file named `.env` in the project directory with the contents below, replacing the given values with valid credentials:

    AWSAccessKeyId=AWSACCESSKEYID
    AWSSecretKey=AWSSECRETKEY
    Bucket=BUCKETNAME
    Region=REGIONNAME

## Development

### Frontend

`npm start`
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### Backend

`node app.js`
Starts the backend server. It will be started on `http://localhost:3001`. 

#### `POST /sign_s3`

The backend server's only API endpoint is the `POST /sign_s3` route. 

Request Parameters:
* `fileName` (String)
* `fileType` (String, should be `csv`)

Response Fields:

If the S3 presigned URL request completes successfully:
* `success` (Boolean). Should be `true`.
* `data` (String). The presigned S3 upload URL.

If the S3 presigned URL request encounters an error:
* `success` (Boolean). Should be `false`.
* `error` (String). The error that AWS returned when handling the request for a presigned URL.
