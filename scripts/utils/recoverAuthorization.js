import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { recoverAuthorizationAddress, verifyAuthorization } from 'viem/utils'
import dotenv from 'dotenv'

dotenv.config()

const privateKey = '0x' + process.env.USER1_PRIVATE_KEY
const wallet = privateKeyToAccount(privateKey)
console.log(`Original wallet address: ${wallet.address}`)

// setup sepolia chain
const sepolia = {
    id: 11155111,
    name: 'Sepolia',
    rpcUrls: {
        default: {
            http: ['https://eth-sepolia.g.alchemy.com/v2/skSSwajFv3eJH3DG25u0Q6OSrzMGl9sc'],
        },
    },
    nativeCurrency: {
        name: 'Sepolia',
        symbol: 'ETH',
        decimals: 18,
    },
    blockExplorerUrls: {
        default: {
            name: 'Sepolia',
            url: 'https://sepolia.etherscan.io',
        },
    },
}

const walletClient = createWalletClient({
    account: wallet,
    chain: sepolia,
    transport: http(),
})

const main = async () => {
    const counterAddress = '0xdc2a23f9b65Bf4FD22Ee3287CC87dd414d1001Aa'

    // Test 1: Basic authorization recovery
    console.log("\nTest 1: Basic authorization recovery")
    const authorization1 = await walletClient.signAuthorization({
        account: wallet,
        contractAddress: counterAddress,
    })
    console.log("Authorization:", authorization1)

    const recoveredAddress1 = await recoverAuthorizationAddress({
        authorization: authorization1,
    })
    console.log("Recovered address:", recoveredAddress1)
    console.log("Addresses match:", recoveredAddress1.toLowerCase() === wallet.address.toLowerCase())

    // Test 2: Authorization with specific parameters
    console.log("\nTest 2: Authorization with specific parameters")
    const authorization2 = await walletClient.signAuthorization({
        account: wallet,
        contractAddress: counterAddress,
        chainId: sepolia.id,
        nonce: 0,
    })
    console.log("Authorization:", authorization2)

    const recoveredAddress2 = await recoverAuthorizationAddress({
        authorization: authorization2,
    })
    console.log("Recovered address:", recoveredAddress2)
    console.log("Addresses match:", recoveredAddress2.toLowerCase() === wallet.address.toLowerCase())

    // Test 3: Authorization with empty address
    console.log("\nTest 3: Authorization with empty address")
    const emptyAddress = '0x0000000000000000000000000000000000000000'
    const authorization3 = await walletClient.signAuthorization({
        account: wallet,
        contractAddress: emptyAddress,
    })
    console.log("Authorization:", authorization3)

    const recoveredAddress3 = await recoverAuthorizationAddress({
        authorization: authorization3,
    })
    console.log("Recovered address:", recoveredAddress3)
    console.log("Addresses match:", recoveredAddress3.toLowerCase() === wallet.address.toLowerCase())

    // Test 4: Test verifyAuthorization
    console.log("\nTest 4: Test verifyAuthorization")

    const valid = await verifyAuthorization({
        address: wallet.address,
        authorization: authorization1,
    }) 
    console.log("IsValid:", valid)
}

main().catch(console.error) 