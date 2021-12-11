import boto3
import os
import pandas as pd
import urllib.parse
from sqlalchemy import create_engine

print('Loading function')

s3 = boto3.client('s3')
engine = create_engine(os.environ["HASURA_URL"])

# Helper functions to perform checks on rows
def ethnicity_check(df):
    ethnicities = ['', 'american indian or alaskan native', 'asian or asian american', 'black or african american', 'hawaiian native or other pacific islander', 'hispanic', 'other', 'two or more races', 'white or caucasian']
    df['ethnicity'] = df['ethnicity'].apply(lambda x: x if pd.isna(x) else (x.lower() if x.lower() in ethnicities else 'error'))
    if 'error' in df['ethnicity'].values:
        return False
    return True

def gender_check(df):
    genders = ['', 'male', 'female', 'non-binary']
    df['gender'] = df['gender'].apply(lambda x: x if pd.isna(x) else (x.lower() if x.lower() in genders else 'error'))
    if 'error' in df['gender'].values:
        return False
    return True

def status_check(df):
    status = ['', 'active', 'not active']
    df['enrollment_status'] = df['enrollment_status'].apply(lambda x: x if pd.isna(x) else (x.lower() if x.lower() in status else 'error'))
    if 'error' in df['enrollment_status'].values:
        return False
    return True
    
# Main function
def lambda_handler(event, context):
    # Get the object from the event
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
    try:
        response = s3.get_object(Bucket=bucket, Key=key)
        df = pd.read_csv(response["Body"])
        print(df)
        
       # Format column headers for Postgres
        df.columns = [c.lower() for c in df.columns]
        # Drop column headers that are not in Postgres
        db_columns = ['student_id', 'school_name', 'first_name', 'last_name', 'gender', 
        'ethnicity', 'grade', 'enrollment_status', 'absences', 'days_in_attendance', 'gpa']
        for col in df.columns:
            if col not in db_columns:
                df = df.drop(columns=[col])
        # Add column headers that are not in CSV
        for db_col in db_columns:
            if db_col not in df.columns:
                df[db_col] = ''
            
        # Define different possible error messages
        ethnicity_e = "Invalid 'ethnicty' value. Ethnicity field should contain one of the following: American Indian or Alaskan Native, Asian or Asian American, Black or African American, Hawaiian Native or Other Pacific Islander, Hispanic, Other, Two or more Races, White or Caucasian."
        gender_e = "Invalid 'gender' value. Gender field should contain one of the following: Male, Female, Non-Binary."
        status_e = "Invalid 'enrollment_status' value. Enrollment status field should contain one of the following: Active, Not Active."
        grade_e = "Invalid 'grade' value. Grade field must be an integer."
        absences_e = "Invalid 'absences' value. Absences field must be an integer."
        attendance_e = "Invalid 'days_in_attendance' value. Days in attendance field must be an integer."
        gpa_e = "Invalid 'gpa' value. GPA field must be a number."
        
        # Perform checks
        error = ''
        if ethnicity_check(df) == False:
            error = ethnicity_e
        elif gender_check(df) == False:
            error = gender_e
        elif status_check(df) == False:
            error = status_e
        else:
            # Enforce data types for 'grade', 'absences', 'days_in_attendance', 'gpa'
            try:
                pd.to_numeric(df['grade'], downcast="integer")
            except Exception:
                error = grade_e
            try:
                pd.to_numeric(df['absences'], downcast="integer")
            except Exception:
                error = absences_e
            try:
                pd.to_numeric(df['days_in_attendance'], downcast="integer")
            except Exception:
                error = attendance_e
            try:
                pd.to_numeric(df['gpa'], downcast="float")
            except Exception:
                error = gpa_e
    
        # Add data to csv_uploads to log upload
        if error == '':
            d = {'filename': [key], 'formatted_properly': [True]}
            df.to_sql(os.environ["HASURA_TABLE"], engine, schema=os.environ["HASURA_SCHEMA"], if_exists = "append", index=False)
        else:
            d = {'filename': [key], 'formatted_properly': [False], 'error': [error]}
        error_df = pd.DataFrame(data=d)
        error_df.to_sql(os.environ["CSV_TABLE"], engine, schema=os.environ["HASURA_SCHEMA"], if_exists = "append", index=False)
        print("Uploaded to Hasura\n")
        
        
    except Exception as e:
        print(e)
        print('Error getting object {} from bucket {}..'.format(key, bucket))
        raise e
