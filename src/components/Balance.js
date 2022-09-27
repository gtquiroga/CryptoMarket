import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import { loadBalances, transferTokens } from '../store/interactions';

import dapp from '../assets/dapp.svg';
import eth from '../assets/eth.svg';


const Balance = () => {
    const dispatch = useDispatch()
    const [isDeposit, setIsDeposit] = useState(true)
    const [toke1TransferAmount, setToke1TransferAmount] = useState('')
    const [toke2TransferAmount, setToke2TransferAmount] = useState('')
    const depositRef = useRef(null)
    const withdrawRef = useRef(null)

    const exchange = useSelector(state => state.exchange.contract)
    const tokens = useSelector(state => state.tokens.contracts)
    const account = useSelector(state => state.provider.account)
    const symbols = useSelector(state => state.tokens.symbols)
    const provider = useSelector(state => state.provider.connection)

    const tokenBalances = useSelector(state => state.tokens.balances)
    const exchangeBalances = useSelector(state => state.exchange.balances)
    const transferInProgress = useSelector(state => state.exchange.transferInProgress)


    useEffect(() => {
        if(exchange && tokens[0] && tokens[1] && account){
            loadBalances(exchange, tokens, account, dispatch)
        }
    }, [exchange, tokens, account, transferInProgress])

    const amountHandler = (e, token) => {
        if(token.address === tokens[0].address){
            setToke1TransferAmount(e.target.value)
        }else if(token.address === tokens[1].address){
            setToke2TransferAmount(e.target.value)
        }
    }

    const depositHandler = (e, token) => {
        e.preventDefault()
        if(token.address === tokens[0].address){
            transferTokens(provider, exchange, 'deposit', token, toke1TransferAmount, dispatch)
            setToke1TransferAmount('')
        } else if(token.address === tokens[1].address){
            transferTokens(provider, exchange, 'deposit', token, toke2TransferAmount, dispatch)
            setToke2TransferAmount('')
        }
    }

    const tabHandler = (e) => {
        if(e.target.className !== depositRef.current.className) {
            e.target.className = 'tab tab--active'
            depositRef.current.className = 'tab'
            setIsDeposit(false)
        } else {
            e.target.className = 'tab tab--active'
            withdrawRef.current.className = 'tab'
            setIsDeposit(true)
        }
    }

    return (
      <div className='component exchange__transfers'>
        <div className='component__header flex-between'>
          <h2>Balance</h2>
          <div className='tabs'>
            <button onClick={tabHandler} ref={depositRef} className='tab tab--active'>Deposit</button>
            <button onClick={tabHandler} ref={withdrawRef} className='tab'>Withdraw</button>
          </div>
        </div>
  
        {/* Deposit/Withdraw Component 1 (DApp) */}
  
        <div className='exchange__transfers--form'>
          <div className='flex-between'>
            <p><small>Token</small><br /><img src={dapp} alt="Token Logo" />{symbols && symbols[0]}</p>
            <p><small>Wallet</small><br />{tokenBalances && tokenBalances[0]}</p>
            <p><small>Exchange</small><br />{exchangeBalances && exchangeBalances[0]}</p>
          </div>
  
          <form onSubmit={(e) => depositHandler(e, tokens[0])}>
            <label htmlFor="token0">{symbols && symbols[0]} Amount</label>
            <input 
                value={toke1TransferAmount}
                type="text"
                id='token0'
                placeholder='0.0000'
                onChange={(e) => amountHandler(e, tokens[0])}
            />
  
            <button className='button' type='submit'>
              <span>{isDeposit ? 'Deposit' : 'Withdraw'}</span>
            </button>
          </form>
        </div>
  
        <hr />
  
        {/* Deposit/Withdraw Component 2 (mETH) */}
  
        <div className='exchange__transfers--form'>
          <div className='flex-between'>
            <p><small>Token</small><br /><img src={eth} alt="Token Logo" />{symbols && symbols[1]}</p>
            <p><small>Wallet</small><br />{tokenBalances && tokenBalances[1]}</p>
            <p><small>Exchange</small><br />{exchangeBalances && exchangeBalances[1]}</p>
  
          </div>
  
          <form onSubmit={(e) => depositHandler(e, tokens[1])}>
            <label htmlFor="token1"></label>
            <input 
                value={toke2TransferAmount}
                type="text"
                id='token1'
                placeholder='0.0000'
                onChange={(e) => amountHandler(e, tokens[1])}
            />
  
            <button className='button' type='submit'>
              <span>{isDeposit ? 'Deposit' : 'Withdraw'}</span>
            </button>
          </form>
        </div>
  
        <hr />
      </div>
    );
  }
  
export default Balance;