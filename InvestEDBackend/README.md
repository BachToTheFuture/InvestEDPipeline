# InvestED Backend Lambda Function

This project contains the support for delivering uploaded student data from S3 to the Heroku-hosted PostgreSQL database that Hasura tracks. This is implemented as an AWS Lambda function that listens to the S3 bucket to which the upload portal sends data. 

## AWS Lambda

### Overview

The Lambda function itself is implemented in Python 3.7 on the x86_64 architecture. The script can be found in `sentToHasura.py`. It makes use of the `boto3`, `pandas`, and `sqlalchemy` libraries. It should live on the same instance as the S3 bucket that receives the CSV file from the upload portal.

### Triggers

This Lambda function listens to the S3 bucket and is triggered by an `ObjectCreated` event. This can be configured on setup, or by navigating to the Lambda function > "Configuration" > "Triggers".

### Layers

The `sendToHasura.py` script makes use of the `pandas` and `sqlalchemy` Python libraries, which AWS does not automatically provide (`boto3` is pre-installed). To use these libraries, we create a Lambda layer for each. For your convenience, these layers are pre-prepared in the `python.zip` files found in each of the `/layers/sqlalchemy` and `/layers/pandas` directories.

To add these layers to AWS Lambda, navigate to the general Lambda dashboard > under "Additional resources", select "Layers" > "Create layer". Give the layer an appropriate name, such as `pandas` or `sqlalchemy`,  upload the respective `python.zip` file, select `x86_64` as the compatible architecture, and choose `Python 3.7` as the compatible runtime.

To apply these layers to the Lambda function, for each of `pandas` and `sqlalchemy`, navigate to the Lambda function > scroll down to "Layers" > "Add a layer" > "Custom layers" > select the latest version of the appropriate layer.

Although not recommended, to build these layers directly from the wheel files, navigate to the appropriate library directory (either `/layers/sqlalchemy` or `/layers/pandas`), delete the existing `python.zip` file, and then execute the following commands:

    python3.7 -m pip install *.whl --target python
    zip -r python.zip python

### Environment Variables

The environment variables below must be configured for the Lambda function to properly interact with the PostgreSQL database. They can be updated by navigating to the Lambda function > "Configuration" > "Environment variables"

    HASURA_SCHEMA=students
    HASURA_TABLE=students
    HASURA_URL=postgresql://<ENTER POSTGRESQL DATABASE URL>

The PostgreSQL URL can be found on Hasura via the following steps: navigate to project details (cog icon in project overview) > "General" > "Env vars" > "PG_DATABASE_URL".

Note that the PostgreSQL URL from Hasura may be prefixed with `postgres` rather than `postgresql`. The former prefix is deprecated and no longer functional. This URL should be updated in-place to use the `postgresql` prefix.

## Hasura/Heroku

### Database Schema
This Lambda function expects the PostgreSQL URL to point to a database with a `students` schema and a `students` table within this schema. The `students` table should have the following fields, none of which may be null:
* `student_id`: integer, unique
* `school_name`: text
* `first_name`: text
* `last_name`: text
* `gender`: text
* `ethnicity`: text
* `grade`: smallint
* `enrollment_status`: text
* `absences`: integer
* `days_in_attendance`: integer
* `gpa`: numeric
* `id`: integer, primary key, unique