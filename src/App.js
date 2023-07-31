import {Switch, Route, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'

import NotFound from './components/NotFound'

import Transaction from './components/Transaction'

import './App.css'

const App = () => (
  <Switch>
    <Route exact path="/login" component={LoginForm} />

    <Route exact path="/transaction" component={Transaction} />
    <Route exact path="/not-found" component={NotFound} />
    <Redirect to="/not-found" />
  </Switch>
)

export default App
