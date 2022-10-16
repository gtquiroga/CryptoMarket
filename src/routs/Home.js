import { Link } from 'react-router-dom';


const Home = () => {
    return (
        <div className='landing'>
            <h1>Welcome to the Crypto Exchange</h1>
            <p>This is a test aplication where you can trade mock tokens (mTKN, mDai and mEth) on the Goerli testnet.</p>
            <p>To use the Exchage you have to connect your Metamask wallet and claim the free mock tokens on the tokens section.</p>
            <div className='landing_buttons'>
                <Link className='landing__button' to="/exchange">Go to Exchange</Link>
                <Link className='landing__button' to="/tokens">Claim Tokens</Link>
            </div>
            <p className='disclaimer'>This is not ment to be used with real tokens or on any other network.Make 
                sure your metamask is connected to the Goerli network and don't use your main account.</p>
        </div>
    );
}

export default Home;