import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import Admin from '../Admin'
import User from '../User'

import './index.css'

class LoginForm extends Component {
  state = {
    email: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
    userList: [],
  }

  onChangeUsername = event => {
    this.setState({email: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    })
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {email, password} = this.state
    const userDetails = {email, password}
    const url = `https://bursting-gelding-24.hasura.app/api/rest/get-user-id?email=${email}&password=${password}`
    const options = {
      headers: {
        'content-type': 'application/json',
        'x-hasura-admin-secret':
          'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
        'x-hasura-role': 'admin',
      },
      method: 'POST',
    }
    const response = await fetch(url, options)
    // console.log(response)
    const data = await response.json()
    console.log(data)
    const updatedData = data.get_user_id
    console.log(updatedData[0])

    if (response.ok === true) {
      // console.log('Success')
      this.setState({userList: updatedData[0].id})
      if (updatedData[0].id === 3) {
        console.log("Yes it's Admin")
        return <Admin />
      }

      // this.onSubmitSuccess(data.jwt_token)
    } else {
      // console.log('Failure')
      ;<User />
      // this.onSubmitFailure(data.error_msg)
    }
    return null
  }

  renderPasswordField = () => {
    const {password} = this.state

    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="password-input-field"
          value={password}
          onChange={this.onChangePassword}
          placeholder="Password"
        />
      </>
    )
  }

  renderUsernameField = () => {
    const {email} = this.state

    return (
      <>
        <label className="input-label" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          className="username-input-field"
          value={email}
          onChange={this.onChangeUsername}
          placeholder="Username"
        />
      </>
    )
  }

  renderFormView = () => {
    const {showSubmitError, errorMsg, userList} = this.state
    return (
      <div className="login-form-container">
        <h1>Money Matters</h1>
        <form className="form-container" onSubmit={this.submitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
            className="login-website-logo-desktop-img"
            alt="website logo"
          />
          <div className="input-container">{this.renderUsernameField()}</div>
          <div className="input-container">{this.renderPasswordField()}</div>
          <button type="submit" className="login-button">
            Login
          </button>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        </form>
      </div>
    )
  }

  render() {
    const {showSubmitError, errorMsg, userList} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    const length = userList === 3

    return <>{length ? this.renderFormView() : <User userId={userList} />}</>
  }
}

export default LoginForm
