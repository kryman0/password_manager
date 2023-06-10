const aesjs = require('aes-js')

const { crypto } = require('node:crypto')

// need to add more, see doc

function getKey() {
    return generateRandomKey()
}

function getRandomBuffer() {
    return crypto.randomBytes(128)
}

function generateRandomKey() {
    const randomBufferPassword = getRandomBuffer()
    const randomBufferSalt = getRandomBuffer()

    return crypto.scryptSync(randomBufferPassword, randomBufferSalt, 32)
}

function textToBytes(text) {
    return aesjs.utils.utf8.toBytes(text)
}

function getCounter(key='') {
    return new aesjs.ModeOfOperation.ctr(key)
}

function getEncBytesToHex(encBytes) {
    return aesjs.utils.hex.fromBytes(encBytes)
}

function getEncPasswordToHex(passwd, key) {
    const textBytes = textToBytes(passwd)

    const aesjsCtr = getCounter(key)
    
    const encBytes = aesjsCtr.encrypt(textBytes)

    return getEncBytesToHex(encBytes)
}

// not done yet with decryption
function getEncBytesFromHex(hex) {
    return aesjs.utils.hex.toBytes(hex)
}

function getDecrBytes(encBytes, key) {
    const aesCtr = getCounter(key)
}
