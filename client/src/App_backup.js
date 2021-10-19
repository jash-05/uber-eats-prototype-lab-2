import React, {useEffect, useState} from 'react';
import Axios from 'axios';
import './App.css';

function App() {
  console.log("sfsd")
  const [nameReg, setNameReg] = useState('')
  const [emailReg, setEmailReg] = useState('')
  const [passwordReg, setPasswordReg] = useState('')
  const [loginStatus, setLoginStatus] = useState("");

  Axios.defaults.withCredentials = true;
  
  const register = () => {
    Axios.post('http://localhost:3001/register', {
      first_name: nameReg,
      email_id: emailReg,
      pass: passwordReg
    }).then((response) => {
      console.log(response);
    })
  }

  const login = () => {
    Axios.get('http://localhost:3001/login', {
      first_name: nameReg,
      email_id: emailReg,
      pass: passwordReg
    }).then((response) => {
      console.log(response);
    })
  }

  useEffect(() => {
    Axios.get('http://localhost/login').then((response) => {
      console.log("Login status:")
      console.log(response.data);
    })
  }, []);

  return (
    <div className="App">
      <h1>Uber Eats Application</h1>
      <div className="signup">
          <label> Name </label>
          <input type="text" onChange={ (e) => setNameReg(e.target.value)} />
          <br />
          <br />
          <label> Email ID </label>
          <input type="email" onChange={ (e) => setEmailReg(e.target.value)} />
          <br />
          <br />
          <label> Password </label>
          <input type="text" onChange={ (e) => setPasswordReg(e.target.value)} />
          <br/>
          <br/>
          <button onClick={register}> Sign up </button>
          <br/>
          <br/>
          <button onClick={login}> Login </button>
          <br/>
          <br/>
          <h1> {loginStatus} </h1>
      </div>
    </div>
  );
}

export default App;
