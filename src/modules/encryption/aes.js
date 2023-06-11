const aesjs = require('aes-js')

const { randomBytes, scryptSync } = require('node:crypto')

// need to add more, see doc

function getKey() {
    return generateRandomKey()
}

function getRandomBuffer() {
    return randomBytes(128)
}

function generateRandomKey() {
    const randomBufferPassword = getRandomBuffer()
    const randomBufferSalt = getRandomBuffer()

    return scryptSync(randomBufferPassword, randomBufferSalt, 32)
}

function textToBytes(text) {
    return aesjs.utils.utf8.toBytes(text)
}

function getCounter(key) {
    return new aesjs.ModeOfOperation.ctr(key)
}

function getEncBytes(textBytes, key) {
    const aesjsCtr = getCounter(key)
    
    return aesjsCtr.encrypt(textBytes)
}

function getEncBytesToHex(encBytes) {
    return aesjs.utils.hex.fromBytes(encBytes)
}

function getEncPasswordToHex(passwd, key='') {
    const textBytes = textToBytes(passwd)

    const encBytes = getEncBytes(textBytes, key)

    return getEncBytesToHex(encBytes)
}

function getEncBytesFromHex(hex) {
    return aesjs.utils.hex.toBytes(hex)
}

function getDecrBytes(encBytes, key) {
    const aesjsCtr = getCounter(key)
    
    return aesjsCtr.decrypt(encBytes)
}

function textFromBytes(decrBytes) {
    return aesjs.utils.utf8.fromBytes(decrBytes)
}

function getDecPasswordFromHex(hex, key='') {
    const encBytes = getEncBytesFromHex(hex)

    const decrBytes = getDecrBytes(encBytes, key)

    return textFromBytes(decrBytes)
}
