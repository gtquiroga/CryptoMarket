const { ethers } = require('hardhat')
const config = require('../src/config.json')

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

const wait = (seconds) => {
    const milliseconds = seconds * 1000
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}


async function main() {
    const accounts = await ethers.getSigners()

    // Fetch network
    const { chainId } = await ethers.provider.getNetwork()
    console.log("using chainId:", chainId)

    // Fetch deployes tokens
    const TKN = await ethers.getContractAt('Token', config[chainId].TKN.address)
    console.log(`TKN Token fetched: ${TKN.address}\n`)

    const mETH = await ethers.getContractAt('Token', config[chainId].mETH.address)
    console.log(`mETH Token fetched: ${mETH.address}\n`)

    const mDAI = await ethers.getContractAt('Token', config[chainId].mDAI.address)
    console.log(`mDAI Token fetched: ${mDAI.address}\n`)

    // Fetch deployed exchange
    const exchange = await ethers.getContractAt('Exchange', config[chainId].exchange.address)
    console.log(`Exchange fetched: ${exchange.address}\n`)

    // Give tokens to accounts[1]
    const sender = accounts[0]
    const receiver = accounts[1]
    let amount = tokens(10000)

    let transaction, result
    transaction = await mETH.connect(sender).transfer(receiver.address, amount)
    console.log(`Transder ${amount} tokens from ${sender.address} to ${receiver.address}\n`)

    //Setup exchange user
    const user1 = accounts[0]
    const user2 = accounts[1]
    amount = tokens(10000)

    // User1 approved 10,000 TKN
    transaction = await TKN.connect(user1).approve(exchange.address, amount)
    await transaction.wait()
    console.log(`Approve ${amount} TKN tokens from ${user1.address}\n`)

    // User1 deposit 10,000 TKN
    transaction = await exchange.connect(user1).depositToken(TKN.address, amount)
    await transaction.wait()
    console.log(`Deposit ${amount} TKN tokens from ${user1.address}\n`)

    // User2 approved 10,000 mETH
    transaction = await mETH.connect(user2).approve(exchange.address, amount)
    await transaction.wait()
    console.log(`Approve ${amount} mETH tokens from ${user2.address}\n`)

    // User2 deposit 10,000 mETH
    transaction = await exchange.connect(user2).depositToken(mETH.address, amount)
    await transaction.wait()
    console.log(`Deposit ${amount} mETH tokens from ${user2.address}\n`)

    //////////////////////////////////////////////////////////////////////////////////
    // Seed cancelled order

    // User1 makes order
    let orderId
    transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(100), TKN.address, tokens(5))
    result = await transaction.wait()
    console.log(`made order from  ${user1.address}\n`)

    // User1 cancels order
    orderId = result.events[0].args.id
    transaction = await exchange.connect(user1).cancelOrder(orderId)
    result = await transaction.wait()
    console.log(`Cancelled order from  ${user1.address}\n`)

    await wait(1)

    //////////////////////////////////////////////////////////////////////////////////
    // Seed Filled order

    // User1 makes order
    transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(100), TKN.address, tokens(10))
    result = await transaction.wait()
    console.log(`Made order from  ${user1.address}\n`)

    // User2 filled order
    orderId = result.events[0].args.id
    transaction = await exchange.connect(user2).fillOrder(orderId)
    result = await transaction.wait()
    console.log(`Fillled order from  ${user2.address}\n`)

    await wait(1)

    // User1 makes another order
    transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(50), TKN.address, tokens(15))
    result = await transaction.wait()
    console.log(`Made order from  ${user1.address}\n`)

    // User2 filled another order
    orderId = result.events[0].args.id
    transaction = await exchange.connect(user2).fillOrder(orderId)
    result = await transaction.wait()
    console.log(`Fillled order from  ${user2.address}\n`)

    await wait(1)

    // User1 makes another order
    transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(200), TKN.address, tokens(20))
    result = await transaction.wait()
    console.log(`Made order from  ${user1.address}\n`)

    // User2 filled another order
    orderId = result.events[0].args.id
    transaction = await exchange.connect(user2).fillOrder(orderId)
    result = await transaction.wait()
    console.log(`Fillled order from  ${user2.address}\n`)

    await wait(1)

    //////////////////////////////////////////////////////////////////////////////////
    // Seed open order

    // User1 make 10 orders
    for(let i = 1; i <= 10 ; i++){
        transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(10 * i), TKN.address, tokens(10))
        result = await transaction.wait()
        console.log(`Make order from  ${user1.address}\n`)

        await wait(1)
    }

    // User2 make 10 orders
    for(let i = 1; i <= 10 ; i++){
        transaction = await exchange.connect(user2).makeOrder(TKN.address, tokens(10 * i), mETH.address, tokens(10))
        result = await transaction.wait()
        console.log(`Make order from  ${user2.address}\n`)

        await wait(1)
    }

  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
