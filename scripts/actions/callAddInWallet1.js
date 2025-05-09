import { encodeFunctionData } from 'viem'
import { walletClient1, walletClient2, counterAbi } from './config.js'

export const callAddInWallet1 = async () => {
    const addData = encodeFunctionData({
        abi: counterAbi,
        functionName: 'add',
        args: [2n]
    })
    const tx4 = await walletClient2.sendTransaction({
        to: walletClient1.account.address,
        data: addData,
    })

    console.log("Add transaction sent:", tx4)
} 