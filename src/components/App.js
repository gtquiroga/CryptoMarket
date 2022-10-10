import { useEffect } from 'react';
import config from '../config.json';
import { useDispatch } from 'react-redux';

import { 
  loadProvider,
  loadNetwork,
  loadAccount,
  loadTokens,
  loadExchange,
  subscribeToEvents,
  loadAllOrders
} from '../store/interactions.js'

import Navbar from './Navbar';
import Markets from './Markets';
import Balance from './Balance';
import Order from './Order';
import OrderBook from './OrderBook';
import Trades from './Trades';
import PriceChart from './PriceChart';
import MyTransactions from './MyTransactions';
import Alert from './Alert';



function App() {

  const dispatch = useDispatch()

  const laodBlockchainData = async () => {
    
    const provider = loadProvider(dispatch)
    const chainId = await loadNetwork(provider, dispatch)

    window.ethereum.on('chainChanged', () => {
      window.location.reload()
    })

    await loadAccount(provider, dispatch)

    window.ethereum.on('accountsChanged', () => {
      loadAccount(provider, dispatch)
    })
    
    
    await loadTokens(provider, [config[chainId].TKN.address, config[chainId].mETH.address], dispatch)

    const exchange = await loadExchange(provider, config[chainId].exchange.address, dispatch)

    loadAllOrders(provider, exchange, dispatch)

    subscribeToEvents(exchange, dispatch)
  }

  useEffect(() => {
    laodBlockchainData()
  })

  
  return (
    <div>

      {/* Navbar */}
      <Navbar />

      <main className='exchange grid'>
        <section className='exchange__section--left grid'>

          <Markets />

          <Balance />

          <Order />

        </section>
        <section className='exchange__section--right grid'>

          <PriceChart />

          <MyTransactions />

          <Trades />

          <OrderBook />

        </section>
      </main>
      <Alert />


    </div>
  );
}

export default App;