const aes = require('aes')

const key;

function textToBytes(text) {
    return aes.utils.utf8.toBytes(text)
}

function getCounter(key) {
    return new aes.ModeOfOperation.ctr(key)
}

function getEncBytes(textBytes) {
    getCounter(key).encrypt(textBytes)
}

function getEncHex(passwd) {
    const passwdBytes = textToBytes(passwd)
    const aesCt
    const aesCtrr
    const encBytes = getEncBytes()
}
