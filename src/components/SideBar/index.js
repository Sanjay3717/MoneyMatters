import {Component} from 'react'
import {Link} from 'react-router-dom'
import {
  AiFillHome,
  AiOutlineTransaction,
  AiOutlineUser,
  AiOutlineUserAdd,
  AiOutlineLogout,
  AiOutlinePlus,
} from 'react-icons/ai'

import './index.css'

class SideBar extends Component {
  onTransactionClicked = () => console.log()

  render() {
    return (
      <div className="left-container">
        <div className="left-logo-container">
          <h1>Money Matters</h1>
        </div>
        <div className="left-content-container">
          <button type="button" className="icon-name-container">
            <AiFillHome className="icon-style" />
            <h1>Dashboard</h1>{' '}
          </button>
          <button
            type="button"
            className="icon-name-container"
            onClick={this.onTransactionClicked}
          >
            <AiOutlineTransaction className="icon-style" />
            <h1>Transactions</h1>
          </button>
          <button type="button" className="icon-name-container">
            <AiOutlineUser className="icon-style" />
            <h1>Profile</h1>{' '}
          </button>
        </div>
        <div className="left-bottom-container">
          <div className="user-logo">
            <AiOutlineUserAdd className="icon-style" />
          </div>
          <div className="left-bottom-user-details">
            <div className="left-bottom-name">
              <p>User Name</p>
              <AiOutlineLogout />
            </div>
            <p>User mail</p>
          </div>
        </div>
      </div>
    )
  }
}
export default SideBar
