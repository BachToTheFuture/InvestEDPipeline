import React, { Component } from 'react';
//import UploadForm from './components/UploadForm';
//<UploadForm/>
      </div>

class App extends Component {
  render() {
    return (

      <div className="App">
        <p>
          Please select and upload a CSV file (must have the .csv file extension, not .xlsx) to 
          the form below. The CSV must have the following column headers: student_id, school_name, 
          first_name, last_name, gender, ethnicity, grade, enrollment_status, absences, 
          days_in_attendance, gpa.
        </p>
        <form onSubmit={this.handleSubmit} ref={this.form}>
          <label>Upload file:
            <input ref={this.fileInput} type="file" accept=".csv"/>
          </label>
          <br/>
          <button type="submit">Upload</button>
        </form>

      <div>
        
    );
  }
}

export default App;
