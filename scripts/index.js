import dotenv from 'dotenv'
import readline from 'readline'
import { wallet1, wallet2, wallet3, counterAddress } from './actions/config.js'
import { authorizeWithInit } from './actions/authorizeWithInit.js'
import { sendForOtherEoa } from './actions/sendForOtherEoa.js'
import { resetAuthorizations } from './actions/resetAuthorizations.js'
import { callAddInWallet1 } from './actions/callAddInWallet1.js'
import { getCountInWallet1 } from './actions/getCountInWallet1.js'
import { sendMutipleAuthorization } from './actions/sendMutipleAuthorization.js'
import { send1000MutipleAuthorization } from './actions/send1000MutipleAuthorization.js'
dotenv.config()

// Function to handle user input
const getUserInput = () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question('Enter 1 for authorizeWithInit, 2 for sendForOtherEoa, or 3 to reset authorizations, 4 for add in wallet1, 5 for get count in wallet1, 6 for sendMutipleAuthorization, 7 for send1000MutipleAuthorization: ', (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

const main = async () => {
    console.log("User1 address:", wallet1.address)
    console.log("User2 address:", wallet2.address)
    console.log("User3 address:", wallet3.address)
    console.log("Using Counter at:", counterAddress)

    const choice = await getUserInput()
    
    switch(choice) {
        case '1':
            await authorizeWithInit()
            break
        case '2':
            await sendForOtherEoa()
            break
        case '3':
            await resetAuthorizations()
            break
        case '4':
            await callAddInWallet1()
            break
        case '5':
            await getCountInWallet1()
            break
        case '6':
            await sendMutipleAuthorization()
            break
        case '7':
            await send1000MutipleAuthorization()
            break
        default:
            console.log("Invalid choice. Please enter 1, 2, 3, 4, 5, 6, or 7.")
    }
}

main().catch(console.error) 