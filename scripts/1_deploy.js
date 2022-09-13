async function main() {
  const Token = await ethers.getContractFactory("Token");
  const Exchange = await ethers.getContractFactory("Exchange");

  const accounts = await ethers.getSigners()

  const tkn = await  Token.deploy('My Token', 'TKN', '1000000')
  await tkn.deployed();
  console.log(`TKN deploy to : ${tkn.address}`)

  const mETH = await  Token.deploy('Mock ETH', 'mETH', '1000000')
  await mETH.deployed();
  console.log(`mETH deploy to : ${mETH.address}`)

  const mDAI = await  Token.deploy('Mock DAI', 'mDAI', '1000000')
  await mDAI.deployed();
  console.log(`mDAI deploy to : ${mDAI.address}`)

  const exchange = await Exchange.deploy(accounts[1].address, 10)
  await exchange.deployed()
  console.log(`Exchange deploy to : ${exchange.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
