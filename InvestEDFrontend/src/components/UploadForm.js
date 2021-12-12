import React, { Component } from 'react';
import axios from 'axios';


class UploadForm extends Component {
  constructor(props){
    super(props);
    this.yearInput = React.createRef();
    this.termInput = React.createRef();
    this.fileInput = React.createRef();
    this.form = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Perform the upload
  handleSubmit(event) {
    event.preventDefault();
    let file = this.fileInput.current.files[0];
    // Split the filename to get the name and type
    let fileParts = file.name.split('.');
    let fileName = fileParts[0];
    let fileType = fileParts[1];
    let academicYear = this.yearInput.current.value;
    let academicTerm = this.termInput.current.value;

    // Prepare upload to S3
    console.log("Preparing the upload...");
    if (fileType !== "csv") {
      alert("File must be a CSV.")
    } else {
      this.form.current.reset()
      // Below depends on AWS
      axios.post("http://localhost:3001/sign_s3",{
        fileName: fileName,
        fileType: fileType,
        academicYear: academicYear,
        academicTerm: academicTerm,
      })
      .then(response => {
        var signedRequest = response.data.data;
        console.log("Recieved a signed request " + signedRequest);
        
      // Put the fileType in the headers for the upload
        var options = {
          headers: {
            'Content-Type': fileType,
            'x-amz-meta-academic-year': academicYear,
            'x-amz-meta-academic-term': academicTerm
          }
        };
        axios.put(signedRequest, file, options)
        .then(_ => {
          alert("Upload successful.");
        })
        .catch(_ => {
          alert("Upload failed. Check console logs for details.");
        })
      })
      .catch(_ => {
        alert("Upload failed. Check console logs for details.");
      })
    }
  }
  
  render() {
    return (
      <div>
        <p>
          Please select and upload a CSV file (must have the .csv file extension, not .xlsx) to 
          the form below. The CSV must have the following column headers: student_id, school_name, 
          first_name, last_name, gender, ethnicity, grade, enrollment_status, absences, 
          days_in_attendance, GPA.
        </p>
        <form onSubmit={this.handleSubmit} ref={this.form}>
          <label>Academic Year:
            <select ref={this.yearInput} name="year" id="year" required>
              <option value="2021-2022">2021-2022</option>
              <option value="2020-2021">2020-2021</option>
              <option value="2019-2020">2019-2020</option>
              <option value="2018-2019">2018-2019</option>
            </select>
          </label>
          <br/>
          <label>Academic Term:
            <select ref={this.termInput} name="term" id="term" required>
              <option value="full_year-1">Full Year </option>
              <option value="semester-1">Semester 1</option>
              <option value="semester-2">Semester 2</option>
              <option value="trimester-1">Trimester 1</option>
              <option value="trimester-2">Trimester 2</option>
              <option value="trimester-3">Trimester 3</option>
              <option value="quarter-1">Quarter 1</option>
              <option value="quarter-2">Quarter 2</option>
              <option value="quarter-3">Quarter 3</option>
              <option value="quarter-4">Quarter 4</option>
            </select>
          </label>
          <br/>
          <label>Upload file:
            <input ref={this.fileInput} type="file" accept=".csv" required/>
          </label>
          <br/>
          <button type="submit">Upload</button>
        </form>
      </div>
    );
  }
}

export default UploadForm;
