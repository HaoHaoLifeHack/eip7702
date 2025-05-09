import { walletClient1, counterAbi, counterAddress, wallet1 } from './config.js'

export const authorizeWithInit = async () => {
    console.log("Executing transaction 1 (initialize)...")

    // 1. Authorize designation of the Contract onto the EOA
    const authorization = await walletClient1.signAuthorization({
        executor: 'self',
        contractAddress: counterAddress,
    })
    console.log("Authorization:", authorization)

    // 2. Designate the Contract on the EOA, and invoke the initialize function
    const hash = await walletClient1.writeContract({
        abi: counterAbi,
        address: wallet1.address,
        authorizationList: [authorization],
        functionName: 'initialize',
        args: [1n]
    })
    console.log("Initialization transaction hash:", hash)
} 