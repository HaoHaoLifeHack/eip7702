import { createWalletClient, http, parseAbi, createPublicClient } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import dotenv from 'dotenv'

dotenv.config()

export const wallet1 = privateKeyToAccount('0x' + process.env.USER1_PRIVATE_KEY)
export const wallet2 = privateKeyToAccount('0x' + process.env.USER2_PRIVATE_KEY)
export const wallet3 = privateKeyToAccount('0x' + process.env.USER3_PRIVATE_KEY)
export const zeroAddress = "0x0000000000000000000000000000000000000000"

// setup sepolia chain
export const sepolia = {
    id: 11155111,
    name: 'Sepolia',
    rpcUrls: {
        default: {
            http: ['https://eth-sepolia.g.alchemy.com/v2/KErFWYZVQjEODM04dmGp3eZWrr-KgPg1'],
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

// setup holesky chain
export const holesky = {
    id: 17000,
    name: 'Holesky',
    rpcUrls: {
        default: {
            http: ['https://eth-holesky.g.alchemy.com/v2/skSSwajFv3eJH3DG25u0Q6OSrzMGl9sc'],
        },
    },
    nativeCurrency: {
        name: 'Holesky',
        symbol: 'ETH',
        decimals: 18,
    },
    blockExplorerUrls: {
        default: {
            name: 'Holesky',
            url: 'https://holesky.etherscan.io',
        },
    },
}

export const walletClient1 = createWalletClient({
    account: wallet1,
    chain: sepolia,
    transport: http()
})

export const walletClient2 = createWalletClient({
    account: wallet2,
    chain: sepolia,
    transport: http()
})

export const walletClient3 = createWalletClient({
    account: wallet3,
    chain: sepolia,
    transport: http()
})

export const publicClient = createPublicClient({
    chain: sepolia,
    transport: http()
})

// Counter contract interface
export const counterAbi = parseAbi([
    'function initialize(uint256) external',
    'function add(uint256) external',
    'function getCount() external view returns (uint256)'
])

export const counterAddress = "0xdc2a23f9b65Bf4FD22Ee3287CC87dd414d1001Aa" 
export const counterAddressHolesky = "0xdd6FC9880233a397e0De7c1110F8E2bCAa0956f3"