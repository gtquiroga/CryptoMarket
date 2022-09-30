import { useState, useRef } from 'react'
import { makeBuyOrder, makeSellOrder } from '../store/interactions'
import { useSelector, useDispatch } from 'react-redux';


const Order = () => {
    const [amount, setAmount] = useState('')
    const [price, setPrice] = useState('')
    const [isBuy, setIsBuy] = useState(true)

    const buyRef = useRef(null)
    const sellRef = useRef(null)

    const exchange = useSelector(state => state.exchange.contract)
    const tokens = useSelector(state => state.tokens.contracts)
    const provider = useSelector(state => state.provider.connection)

    const dispatch = useDispatch()

    const tabHandler = (e) => {
        if(e.target.className !== buyRef.current.className) {
            e.target.className = 'tab tab--active'
            buyRef.current.className = 'tab'
            setIsBuy(false)
        } else {
            e.target.className = 'tab tab--active'
            sellRef.current.className = 'tab'
            setIsBuy(true)
        }
    }

    const buyHandler = (e) => {
        e.preventDefault()
        makeBuyOrder(provider, exchange, tokens, {amount, price}, dispatch)
        setAmount('')
        setPrice('')

    }

    const sellHandler = (e) => {
        e.preventDefault()
        makeSellOrder(provider, exchange, tokens, {amount, price}, dispatch)
        setAmount('')
        setPrice('')

    }

    return (
      <div className="component exchange__orders">
        <div className='component__header flex-between'>
            <h2>New Order</h2>
            <div className='tabs'>
                <button onClick={tabHandler} ref={buyRef} className='tab tab--active'>Buy</button>
                <button onClick={tabHandler} ref={sellRef} className='tab'>Sell</button>
            </div>
        </div>
  
        <form onSubmit={isBuy ? buyHandler : sellHandler}>
            {isBuy ? 
                <label htmlFor='amount'>Buy Amount</label>
                :
                <label htmlFor='amount'>Sell Amount</label>
            }
            <input value={amount} type="text" id='amount' placeholder='0.0000' onChange={(e) => setAmount(e.target.value)}/>
            {isBuy ? 
                <label htmlFor='price'>Buy Price</label>
                :
                <label htmlFor='price'>Sell Price</label>
            }
    
            <input value={price} type="text" id='price' placeholder='0.0000' onChange={(e) => setPrice(e.target.value)}/>
    
            <button className='button button--filled' type='submit'>
                {isBuy ? 'Buy Order' : 'Sell Order'}
          </button>
        </form>
      </div>
    );
  }
  
  export default Order;