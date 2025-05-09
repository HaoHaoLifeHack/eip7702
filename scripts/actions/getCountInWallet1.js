import { publicClient, walletClient1, counterAbi } from './config.js'

export const getCountInWallet1 = async () => {
    const count = await publicClient.readContract({
        address: walletClient1.account.address,
        abi: counterAbi,
        functionName: 'getCount',
    })
    console.log("Count in wallet1:", count)
} 