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

import ExhangeNavbar from '../components/ExhangeNavbar';
import Markets from '../components/Markets';
import Balance from '../components/Balance';
import Order from '../components/Order';
import OrderBook from '../components/OrderBook';
import Trades from '../components/Trades';
import PriceChart from '../components/PriceChart';
import MyTransactions from '../components/MyTransactions';
import Alert from '../components/Alert';


const Exchange = () => {

  
  return (
    <div>
      <ExhangeNavbar />
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

export default Exchange;