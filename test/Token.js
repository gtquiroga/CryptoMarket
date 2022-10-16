const { ethers } = require('hardhat');
const { expect } = require('chai');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Token', () => {
    let token, accounts, deployer, receiver

    beforeEach(async () => {
        const Token = await ethers.getContractFactory('Token')
        token = await Token.deploy('My Token', 'TKN', '1000000')
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        receiver = accounts[1]
        exchange = accounts[2]
    })

    describe('Deployment', () => {
        const name = 'My Token'
        const symbol = 'TKN'
        const decimals = '18'
        const totalSupply = tokens(1000000)
        const amount = tokens(1000)
        const contractAmount = tokens(999000)

        it('has correct name', async () => {
            expect(await token.name()).to.equal(name)
        })
    
        it('has correct symbol', async () => {
            expect(await token.symbol()).to.equal(symbol)
        })
    
    
        it('has correct decimals', async () => {
            expect(await token.decimals()).to.equal(decimals)
        })
    
        it('has correct totalSupply', async () => {
            expect(await token.totalSupply()).to.equal(totalSupply)
        })

        it('assing totalSupply/1000 to deployer', async () => {
            expect(await token.balanceOf(deployer.address)).to.equal(amount)
        })

        it('assing correct supply to contrat', async () => {
            expect(await token.balanceOf(token.address)).to.equal(contractAmount)
        })
    })

    describe('Claim free tokens', async () => {
        let amount, transaction, result

        describe('Success', () => {
            beforeEach(async () => {
                token_balance = await token.balanceOf(token.address)
                receiver_balance = await token.balanceOf(receiver.address)
                token_balance = BigInt(token_balance) - BigInt(tokens(100))
                receiver_balance =  BigInt(receiver_balance) + BigInt(tokens(100)) 
            })
    
            it('Balance change correctly', async () => {
                expect(await token.freeTokensClaimed(receiver.address)).to.equal(false)

                transaction = await token.connect(receiver).freeTokens()
                result = await transaction.wait()

                expect(await token.freeTokensClaimed(receiver.address)).to.equal(true)
                expect(await token.balanceOf(token.address)).to.equal(token_balance)
                expect(await token.balanceOf(receiver.address)).to.equal(receiver_balance)
            })
    
           
        })

        describe('Failure', () => {
            beforeEach(async () => {
                transaction = await token.connect(receiver).freeTokens()
                result = await transaction.wait()
            })

            it('Cannont claim free tokens twice', async () => {
                expect(await token.freeTokensClaimed(receiver.address)).to.equal(true)

                await expect(token.connect(receiver).freeTokens()).to.be.reverted
            })
           
        })

        
    })

    describe('Sending tokens', async () => {
        let amount, transaction, result

        describe('Success', () => {
            beforeEach(async () => {
                amount = tokens(100)
                transaction = await token.connect(deployer).transfer(receiver.address, amount)
                result = await transaction.wait()
            })
    
            it('transfer token balance', async () => {
                expect(await token.balanceOf(deployer.address)).to.equal(tokens('900'))
                expect(await token.balanceOf(receiver.address)).to.equal(amount)
            })
    
            it('emits transfer event', async () => {
                const event = result.events[0]
                expect(event.event).to.equal('Transfer')
    
                const args = event.args
                expect(args.from).to.equal(deployer.address)
                expect(args.to).to.equal(receiver.address)
                expect(args.value).to.equal(amount)
            })
        })

        describe('Failure', () => {
            it('reject insufficient balance', async () => {
                const invalidAmount = tokens(1000000000000)
                await expect(token.connect(deployer).transfer(receiver.address, invalidAmount)).to.be.reverted

            })

            it('reject invalid recipient', async () => {
                const amount = tokens(100)
                await expect(token.connect(deployer).transfer('0x0000000000000000000000000000000000000000', amount)).to.be.reverted

            })
        })

        
    })

    describe('Approving tokens', () => {
        let amount, transaction, result

        beforeEach(async () => {
            amount = tokens(100)
            transaction = await token.connect(deployer).approve(exchange.address, amount)
            result = await transaction.wait()
        })

        describe('Success', () => {
            it('allocates an allowance for delegated token spending', async () => {
                expect(await token.allowance(deployer.address, exchange.address)).to.equal(amount)
            })

            it('emits Approval event', async () => {
                const event = result.events[0]
                expect(event.event).to.equal('Approval')
    
                const args = event.args
                expect(args.owner).to.equal(deployer.address)
                expect(args.spender).to.equal(exchange.address)
                expect(args.value).to.equal(amount)
            })
        })

        describe('Failure', () => {
            it('reject invalid spender', async () => {
                await expect(token.connect(deployer).approve('0x0000000000000000000000000000000000000000', amount)).to.be.reverted
            })
        })
    })

    describe('Delegate token transfer', () => {
        let amount, transaction, result

        beforeEach(async () => {
            amount = tokens(100)
            transaction = await token.connect(deployer).approve(exchange.address, amount)
            result = await transaction.wait()
        })

        describe('Success', () => {
            
            beforeEach(async () => {
                transaction = await token.connect(exchange).transferFrom(deployer.address, receiver.address, amount)
                result = await transaction.wait()
            })

            it('transfer balance tokens', async () => {
                expect(await token.balanceOf(deployer.address)).to.be.equal(tokens(900))
                expect(await token.balanceOf(receiver.address)).to.be.equal(amount)
            })

            it('reset the allowance', async () => {
                expect(await token.allowance(deployer.address, exchange.address)).to.be.equal(0)
            })

            it('emits Transfer event', async () => {
                const event = result.events[0]
                expect(event.event).to.equal('Transfer')
    
                const args = event.args
                expect(args.from).to.equal(deployer.address)
                expect(args.to).to.equal(receiver.address)
                expect(args.value).to.equal(amount)
            })

        })

        describe('Failure', () => {

            it('amount exced allowance', async () => {
                const invalidAmount = tokens(10000000)
                await expect(token.connect(exchange).transferFrom(deployer.address, receiver.address, invalidAmount)).to.be.reverted
            })

            it('doesn\'t have allowance', async () => {
                await expect(token.connect(exchange).transferFrom(exchange.address, receiver.address, amount)).to.be.reverted
            })
           
        })
    })

})