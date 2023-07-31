import {Component} from 'react'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
} from 'recharts'

import {
  AiFillHome,
  AiOutlineTransaction,
  AiOutlineUser,
  AiOutlineUserAdd,
  AiOutlineLogout,
  AiOutlinePlus,
} from 'react-icons/ai'

import Transaction from '../Transaction'
import SideBar from '../SideBar'

import './index.css'

const apiStatus = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  initial: 'INITIAL',
}

class User extends Component {
  state = {
    lastThreeTransactions: [],
    totalDebitAndCredit: [],
    lastSevenDaysTransaction: [],
    status: apiStatus.initial,
    isLoading: false,
  }

  componentDidMount() {
    const {userId} = this.props
    this.getLastThreeTransaction()
    this.getTotalDebitAndCredit()
    this.getLastSevenDaysTransaction()
  }

  getLastThreeTransaction = async () => {
    this.setState({status: apiStatus.inProgress, isLoading: true})
    const apiUrl =
      'https://bursting-gelding-24.hasura.app/api/rest/all-transactions?limit=3&offset=1'
    const options = {
      headers: {
        'x-hasura-user-id': 1,
        'x-hasura-role': 'user',
        'x-hasura-admin-secret':
          'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()

      const formattedData = data.transactions.map(eachItem => ({
        amount: eachItem.amount,
        date: new Date(eachItem.date).toDateString(),
        id: eachItem.id,
        transactionName: eachItem.transaction_name,
        type: eachItem.type,
        userId: eachItem.user_id,
        category: eachItem.category,
      }))

      this.setState({
        lastThreeTransactions: formattedData,
        status: apiStatus.success,
        isLoading: false,
      })
    } else {
      this.setState({status: apiStatus.failure, isLoading: false})
    }
  }

  getTotalDebitAndCredit = async () => {
    this.setState({status: apiStatus.inProgress, isLoading: true})
    const apiUrl =
      'https://bursting-gelding-24.hasura.app/api/rest/credit-debit-totals'
    const options = {
      headers: {
        'x-hasura-user-id': 1,
        'x-hasura-role': 'user',
        'x-hasura-admin-secret':
          'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      this.setState({
        totalDebitAndCredit: data.totals_credit_debit_transactions,
        status: apiStatus.success,
      })
    } else {
      this.setState({status: apiStatus.failure})
    }
  }

  /* function getDayName(dateStr, locale = 'en-US')  {
    const date = new Date(dateStr)
    return date.toLocaleDateString(locale, {weekday: 'long'})
  } */

  getLastSevenDaysTransaction = async () => {
    this.setState({status: apiStatus.inProgress, isLoading: true})
    const apiUrl =
      ' https://bursting-gelding-24.hasura.app/api/rest/daywise-totals-7-days'
    const options = {
      headers: {
        'x-hasura-user-id': 1,
        'x-hasura-role': 'user',
        'x-hasura-admin-secret':
          'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const formattedData = data.last_7_days_transactions_credit_debit_totals.map(
        eachItem => ({
          // date: new Date(eachItem.date).getDayName(),
          date: eachItem.date.toLocaleString(),
          sum: eachItem.sum,
          type: eachItem.type,
        }),
      )

      console.log(formattedData)
      this.setState({
        lastSevenDaysTransaction: formattedData,
        status: apiStatus.success,
        isLoading: false,
      })
    } else {
      this.setState({status: apiStatus.failure, isLoading: false})
    }
  }

  renderSuccessView = () => {
    const {
      totalDebitAndCredit,
      lastThreeTransactions,
      lastSevenDaysTransaction,
    } = this.state
    const {type, sum} = totalDebitAndCredit
    console.log(lastSevenDaysTransaction)
    const totalDebitCreditSumColor =
      totalDebitAndCredit.type === 'debit' ? 'total-debit' : 'total-credit'

    return (
      <>
        <div className="app-container">
          <SideBar />
          <div className="content-container">
            <div className="content-header-container">
              <h1>Accounts</h1>
              <div className="add-transaction-button-container">
                <AiOutlinePlus />
                <button type="button" className="add-transaction-button">
                  Add Transaction
                </button>
              </div>
            </div>
            <div className="content-bottom-container">
              <div className="content-total-container">
                {totalDebitAndCredit.map(eachItem => (
                  <div className="debit-credit-container">
                    <h1 className={totalDebitCreditSumColor}>
                      ${eachItem.sum}
                    </h1>
                    <p className="credit-debit-type">{eachItem.type}</p>
                  </div>
                ))}
              </div>
              <div className="last-transaction-container">
                <h1>Last Transaction</h1>
                {lastThreeTransactions.map(eachItem => (
                  <div className="last-three-transactions-item">
                    <p className="transaction-item">
                      {eachItem.transactionName}
                    </p>
                    <p>{eachItem.category}</p>
                    <p>{eachItem.date}</p>

                    {eachItem.type === 'debit' ? (
                      <p>-{eachItem.amount}</p>
                    ) : (
                      <p>+{eachItem.amount}</p>
                    )}
                  </div>
                ))}
              </div>
              <div className="debit-credit-chart-container">
                <h1>Debit & Credit Overview</h1>
                <BarChart
                  width={1000}
                  height={250}
                  data={lastSevenDaysTransaction}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                  barSize={20}
                >
                  <XAxis dataKey="date" />
                  <YAxis datakey="sum" />

                  <Legend />
                  <Bar dataKey="Debit" fill="#8884d8" />
                  <Bar dataKey="Credit" fill="#82ca9d" />
                </BarChart>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  renderLoadingView = () => {
    console.log()
    return (
      <div className="products-loader-container">
        <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
      </div>
    )
  }

  renderOutput = () => {
    const {isLoading} = this.state
    return <>{isLoading ? this.renderLoader() : this.renderSuccessView()}</>
  }

  render() {
    const {
      totalDebitAndCredit,
      lastThreeTransactions,
      lastSevenDaysTransaction,
      isLoading,
    } = this.state
    const {type, sum} = totalDebitAndCredit
    console.log(lastSevenDaysTransaction)
    const totalDebitCreditSumColor =
      totalDebitAndCredit.type === 'debit' ? 'total-debit' : 'total-credit'
    return (
      <>
        {isLoading ? (
          <div className="products-loader-container">
            <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
          </div>
        ) : (
          <div className="app-container">
            <div className="left-container">
              <div className="left-logo-container">
                <h1>Money Matters</h1>
              </div>
              <div className="left-content-container">
                <button className="icon-name-container">
                  <AiFillHome className="icon-style" />
                  <p>Dashboard</p>{' '}
                </button>
                <button className="icon-name-container">
                  <AiOutlineTransaction className="icon-style" />
                  <p>Transactions</p>
                </button>
                <button className="icon-name-container">
                  <AiOutlineUser className="icon-style" />
                  <p>Profile</p>{' '}
                </button>
              </div>

              <div className="left-bottom-container">
                <button className="user-logo">
                  <AiOutlineUserAdd className="icon-style" />
                </button>
                <div className="left-bottom-user-details">
                  <div className="left-bottom-name">
                    <p>User Name</p>
                    <AiOutlineLogout />
                  </div>
                  <p>User mail</p>
                </div>
              </div>
            </div>

            <div className="content-container">
              <div className="content-header-container">
                <h1>Accounts</h1>
                <div className="add-transaction-button-container">
                  <AiOutlinePlus />
                  <button type="button" className="add-transaction-button">
                    Add Transaction
                  </button>
                </div>
              </div>
              <div className="content-bottom-container">
                <div className="content-total-container">
                  {totalDebitAndCredit.map(eachItem => (
                    <div className="debit-credit-container">
                      <h1 className={totalDebitCreditSumColor}>
                        ${eachItem.sum}
                      </h1>
                      <p className="credit-debit-type">{eachItem.type}</p>
                    </div>
                  ))}
                </div>
                <div className="last-transaction-container">
                  <h1>Last Transaction</h1>
                  {lastThreeTransactions.map(eachItem => (
                    <div className="last-three-transactions-item">
                      <p className="transaction-item">
                        {eachItem.transactionName}
                      </p>
                      <p>{eachItem.category}</p>
                      <p>{eachItem.date}</p>

                      {eachItem.category === 'debit' ? (
                        <p>+{eachItem.amount}</p>
                      ) : (
                        <p>-{eachItem.amount}</p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="debit-credit-chart-container">
                  <h1>Debit & Credit Overview</h1>
                  <BarChart
                    width={1000}
                    height={250}
                    data={lastSevenDaysTransaction}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                    barSize={20}
                  >
                    <XAxis dataKey="date" />
                    <YAxis datakey="sum" />

                    <Legend />
                    <Bar dataKey="Debit" fill="#8884d8" />
                    <Bar dataKey="Credit" fill="#82ca9d" />
                  </BarChart>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }
}

export default User
