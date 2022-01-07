import React, { Component } from 'react';
import UploadForm from './components/UploadForm';
import ErrorMessage from './components/ErrorMessage';


class App extends Component {
  render() {
    return (
      <div>
        <UploadForm/>
        <ErrorMessage/>
      </div>
    );
  }
}

export default App;
