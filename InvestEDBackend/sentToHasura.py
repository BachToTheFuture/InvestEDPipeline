import boto3
import os
import pandas as pd
import urllib.parse
from sqlalchemy import create_engine

print('Loading function')

s3 = boto3.client('s3')
engine = create_engine(os.environ["HASURA_URL"])

def lambda_handler(event, context):
    # Get the object from the event
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
    try:
        response = s3.get_object(Bucket=bucket, Key=key)
        df = pd.read_csv(response["Body"])
        print(df)
        # Clean and/or augment data (TODO)
        # Format column headers for Postgres
        df.columns = [c.lower() for c in df.columns]
        # Add data to the Postgres database that Hasura sits on
        df.to_sql(os.environ["HASURA_TABLE"], engine, schema=os.environ["HASURA_SCHEMA"], if_exists = "append", index=False)
        print("Uploaded to Hasura")
    except Exception as e:
        print(e)
        print('Error getting object {} from bucket {}..'.format(key, bucket))
        raise e
