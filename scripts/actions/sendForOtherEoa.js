import { walletClient1, walletClient2, counterAddress, wallet2, wallet1 } from './config.js'

export const sendForOtherEoa = async () => {
    console.log("help another eoa to send authorization transaction...")
    const auth = await walletClient2.signAuthorization({
        contractAddress: counterAddress,
        account: wallet2
    })

    const tx = await walletClient1.sendTransaction({
        to: wallet1.address,
        value: 0n,
        authorizationList: [auth]
    })
    console.log("tx hash:", tx)
} 