import { useEffect } from 'react';
import config from '../config.json';
import { useDispatch } from 'react-redux';

import { 
  loadProvider,
  loadNetwork,
  loadAccount,
  loadTokens,
  loadExchange
} from '../store/interactions.js'


function App() {

  const dispatch = useDispatch()

  const laodBlockchainData = async () => {
    
    const provider = loadProvider(dispatch)
    const chainId = await loadNetwork(provider, dispatch)
    
    await loadAccount(provider, dispatch)
    await loadTokens(provider, [config[chainId].TKN.address, config[chainId].mETH.address], dispatch)

    await loadExchange(provider, config[chainId].exchange.address, dispatch)
  }

  useEffect(() => {
    laodBlockchainData()
  })

  
  return (
    <div>

      {/* Navbar */}

      <main className='exchange grid'>
        <section className='exchange__section--left grid'>

          {/* Markets */}

          {/* Balance */}

          {/* Order */}

        </section>
        <section className='exchange__section--right grid'>

          {/* PriceChart */}

          {/* Transactions */}

          {/* Trades */}

          {/* OrderBook */}

        </section>
      </main>

      {/* Alert */}

    </div>
  );
}

export default App;