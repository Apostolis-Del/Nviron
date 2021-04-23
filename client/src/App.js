import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

import MenuBar from './components/MenuBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { Container } from 'semantic-ui-react';

import {AuthProvider} from './context/auth';
import AuthRoute from './util/authRoute';
import SinglePost from './pages/SinglePost';
import SingleOrgPost from './pages/SingleOrgPost';
import SingleOrg from './pages/SingleOrg';

function App() {
  return (
    <AuthProvider>
    <Router>
      <Container>
      <MenuBar />
      <Route exact path='/' component={Home}/>
      <AuthRoute exact path='/login' component={Login}/>
      <AuthRoute exact path='/register' component={Register}/>
      <Route exact path='/posts/:postId' component={SinglePost}/>
      <Route exact path='/orgposts/:postId' component={SingleOrgPost}/>
      <Route exact path='/organizations/:orgId' component={SingleOrg}/>
      </Container>
    </Router>
    </AuthProvider>
  );
}

export default App;
