import { walletClient1, walletClient2, zeroAddress, wallet1, wallet2 } from './config.js'

export const resetAuthorizations = async () => {
    console.log("Resetting authorizations...")
    
    // Reset authorization for user1
    const auth = await walletClient2.signAuthorization({
        contractAddress: zeroAddress,
        account: wallet2
    })
    console.log("Reset Authorization:", auth)

    const tx = await walletClient1.sendTransaction({
        to: zeroAddress,
        authorizationList: [auth]
    })
    console.log("Reset transaction sent:", tx)
} 