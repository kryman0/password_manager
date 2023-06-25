const { app, BrowserWindow } = require('electron')
const fs = require('node:fs')
const path = require('node:path')

const { aesjs } = require('./modules/encryption/aes')
const { db } = require('./modules/db/sqlite')

// setupDb should only be run if the file has not been created
// need to change logic in the db module
console.log(db.isDbFileCreated())
//if (!db.isDbFileCreated()) db.setupDb() //check this for remote access

db.restore()

const key = aesjs.generateKey()
console.log("key:", key)

const passwd = aesjs.getEncPasswdToHex("my password", key)
const decrPasswd = aesjs.getDecPasswdFromHex(passwd, key)
console.log("enc", passwd, "decr", decrPasswd)

const password = {
    title: 'test title',
    username: 'user1',
    password: passwd,
    url: 'https://www.account1.com',
    description: '',
    encId: 2,
    key: null
}

const category = 'google'

const getPasswdSql = 'select * from passwords where title = "test title";'

db.insPassword(password)
db.insCategory(category)

console.log(db.getOne('passwords', 1))

console.log(db.getAll('passwords'))

db.close()

//const createWindow = () => {
//    const win = new BrowserWindow({
//        width: 800,
//        height: 600,
//        webPreferences: {
//            preload: path.join(__dirname, 'preload.js')
//        }
//    })
//
//    win.loadFile(path.join(__dirname, 'windows/index.html'))
//}
//
//
//app.whenReady().then(() => {
//    createWindow()
//
//    app.on('activate', () => {
//        if (BrowserWindow.getAllWindows().length === 0) createWindow()
//    })
//})
//
//
//app.on('window-all-closed', () => {
//    if (process.platform !== 'darwin') app.quit()
//})
