import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import AddTodo from './components/add-todo';
import TodosList from './components/todos-list';
import AddPadoms from './components/add-padoms';
import PadomsList from './components/padoms-list';

import Login from './components/login';
import Signup from './components/signup';
import Data from './components/data';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Navbar';
import TodoDataService from './services/todos';


function App() {
  const [user, setUser] = React.useState(null);
  const [token, setToken] = React.useState(null);
  const [error, setError] = React.useState('');

  async function login(user = null){ // default user to null
    TodoDataService.login(user)
      .then(response =>{        
        setToken(response.data.token);     
        setUser(user.username);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', user.username);
        setError('');
      })
      .catch( e =>{
        console.log('login', e);
        setError(e.toString());       
      });
  }

  async function logout(){
    setToken('');
    setUser('');
    localStorage.setItem('token', '');
    localStorage.setItem('user', ''); 
  }

  async function signup(user = null){ // default user to null
    TodoDataService.signup(user)
      .then(response =>{
        setToken(response.data.token);
        setUser(user.username);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', user.username);
      })
      .catch( e =>{
        console.log(e);
        setError(e.toString());
      })
  }

  return (
    <div className="App">
      <Navbar bg="primary" variant="dark">
        <div className="container-fluid">
          <Navbar.Brand>TodosAndris</Navbar.Brand>
          <Nav className="me-auto">
            <Container>
              { user ? ( 
                <>
              <Link className="nav-link" onClick={logout}>Logout({user})</Link>
              <Link className="nav-link" to={"/signup"}>Create user</Link>
              <Link className="nav-link" to={"/data"}>Data</Link>
              <Link className="nav-link" to={"/suggest"}>Suggestions</Link>
              <Link className="nav-link" to={"/todo"}>Todo</Link>
                </> 
              ):(
                <>
                  <Link className="nav-link" to={"/login"}>Login</Link>
                  <Link className="nav-link" to={"/signup"}>Sign Up</Link>
                  <Link className="nav-link" to={"/data"}>Data</Link>
                  <Link className="nav-link" to={"/suggest"}>Suggestions</Link>
                </>
              )}
            </Container>
          </Nav>
        </div>
      </Navbar>
      
      <div className="container mt-4">
        <Switch>	
          <Route exact path={["/", "/suggest"]} render={(props) =>
            <PadomsList {...props} token={token} />
          }></Route>
          <Route path="/suggest/create" render={(props)=> 
            <AddPadoms {...props} token={token} />
          }></Route>
          <Route path="/suggest/:id/" render={(props)=> 
            <AddPadoms {...props} token={token} />
          }></Route>
          <Route path="/todo/create" render={(props)=> 
            <AddTodo {...props} token={token} />
          }></Route>
          <Route path="/todo/:id/" render={(props)=> 
            <AddTodo {...props} token={token} />
          }></Route>
          <Route exact path={["/", "/todo"]} render={(props) =>
            <TodosList {...props} token={token} />
          }></Route>
          <Route path="/login" render={(props)=> 
            <Login {...props} login={login} />
          }>
          </Route>
          <Route path="/signup" render={(props)=> 
            <Signup {...props} signup={signup} />
          }>
          </Route>
          <Route path="/data" render={(props)=> 
            <Data {...props} token={token} />
          }>
          </Route>
        </Switch>
      </div>
      
      <footer className="text-center text-lg-start 
        bg-light text-muted mt-4">
        <div className="text-center p-4">
          © Uzrakstīja pēc grāmatas - <a 
            target="_blank" 
            className="text-reset fw-bold text-decoration-none" 
            href="https://intellify.lv"
          >
            Andris Krūmiņš
          </a> - <a 
            target="_blank" 
            className="text-reset fw-bold text-decoration-none" 
            href="https://lafivents.lv"
          >
            Grāmatas autors Greg Lim
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
