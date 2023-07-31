import {Component} from 'react'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import {AiOutlineDelete} from 'react-icons/ai'
import {FiEdit2} from 'react-icons/fi'
import SideBar from '../SideBar'
import './index.css'

class Transaction extends Component {
  state = {
    allTransactions: [],
    isLoading: false,
    debitTransactions: [],
    creditTransactions: [],
    all: false,
    debit: false,
    credit: false,
  }

  componentDidMount() {
    this.getFullTransactionsList()
  }

  getFullTransactionsList = async () => {
    this.setState({isLoading: true, debit: false})
    const apiUrl =
      'https://bursting-gelding-24.hasura.app/api/rest/all-transactions?limit=200&offset=1'
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
        allTransactions: formattedData,
        isLoading: false,
        all: true,
      })
    }
  }

  getDebitDetails = async () => {
    this.setState({isLoading: true, all: false})
    const apiUrl =
      'https://bursting-gelding-24.hasura.app/api/rest/all-transactions?type:debit'
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
        debitTransactions: formattedData,
        isLoading: false,
        debit: true,
      })
    }
  }

  render() {
    const {
      allTransactions,
      isLoading,
      all,
      debit,
      debitTransactions,
    } = this.state
    return (
      <>
        {isLoading ? (
          <div className="products-loader-container">
            <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
          </div>
        ) : (
          <div className="transaction-app-container">
            <SideBar />
            <div className="transaction-container">
              <div className="transaction-header">
                <h1>Transaction</h1>
                <div className="transaction-details">
                  <button
                    type="button"
                    className="transaction-type-btn"
                    onClick={this.getFullTransactionsList}
                  >
                    All Transactions
                  </button>
                  <button
                    type="button"
                    className="transaction-type-btn"
                    onClick={this.getDebitDetails}
                  >
                    Debit
                  </button>
                  <button type="button" className="transaction-type-btn">
                    Credit
                  </button>
                </div>
              </div>
              {all ? (
                <div className="last-transaction-container">
                  {allTransactions.map(eachItem => (
                    <div className="last-three-transactions-item">
                      <p className="transaction-item">
                        {eachItem.transactionName}
                      </p>
                      <p>{eachItem.category}</p>
                      <p>{eachItem.date}</p>

                      {eachItem.type === 'debit' ? (
                        <p>-${eachItem.amount}</p>
                      ) : (
                        <p>+${eachItem.amount}</p>
                      )}
                      <FiEdit2 />
                      <AiOutlineDelete />
                    </div>
                  ))}
                </div>
              ) : null}
              {debit ? (
                <div className="last-transaction-container">
                  {debitTransactions.map(eachItem => (
                    <div className="last-three-transactions-item">
                      <p className="transaction-item">
                        {eachItem.transactionName}
                      </p>
                      <p>{eachItem.category}</p>
                      <p>{eachItem.date}</p>

                      {eachItem.type === 'debit' ? (
                        <p>+${eachItem.amount}</p>
                      ) : (
                        <p>-${eachItem.amount}</p>
                      )}
                      <FiEdit2 />
                      <AiOutlineDelete />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </>
    )
  }
}

export default Transaction
