import React, { Component } from 'react';
import axios from 'axios';


class App extends Component {
  constructor(props){
    super(props);
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

    // Prepare upload to S3
    console.log("Preparing the upload...");
    if (fileType !== "csv") {
      alert("File must be a CSV.")
    } else {
      this.form.current.reset()
      // Below depends on AWS
      axios.post("http://localhost:3001/sign_s3",{
        fileName : fileName,
        fileType : fileType
      })
      .then(response => {
        var signedRequest = response.data.data;
        console.log("Recieved a signed request " + signedRequest);
        
      // Put the fileType in the headers for the upload
        var options = {
          headers: {
            'Content-Type': fileType
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
      <div className="App">
        <p>
          Please select and upload a CSV file (must have the .csv file extension, not .xlsx) to 
          the form below. The CSV must have the following column headers: Student ID, School Name, 
          First Name, Last Name, Gender, Ethnicity, Grade Level, Enrollment Status, # of Absences, 
          Days in Attendance, GPA.
        </p>
        <form onSubmit={this.handleSubmit} ref={this.form}>
          <label>Upload file:
            <input ref={this.fileInput} type="file" accept=".csv"/>
          </label>
          <br/>
          <button type="submit">Upload</button>
        </form>
      </div>
    );
  }
}

export default App;
