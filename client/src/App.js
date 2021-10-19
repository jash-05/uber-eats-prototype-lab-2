import React, { Component } from 'react';
import './App.css';
import Main from './components/main';
import {BrowserRouter} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          {/* App Component has a child component called main*/}
          <Main/>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;