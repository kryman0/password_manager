function logDbTransaction(transType='From database', transLog='') {
    // add some logging
    console.log(`${transType} ${transLog}`)
}


exports.logging = {
    logDbTransaction: logDbTransaction
}
