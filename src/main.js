const { app, BrowserWindow } = require('electron')
const path = require('node:path')
const fs = require('node:fs')

const { db } = require('./modules/db/sqlite')

// setupDb should only be run if the file has not been created
// need to change logic in the db module
console.log(db.isDbFileCreated())
//if (!db.isDbFileCreated()) db.setupDb() //check this for remote access

db.restore()

const password = {
    title: 'test title',
    username: 'user1',
    password: 'pass1',
    url: 'https://www.account1.com',
    description: '',
    encId: 2,
    key: "my super long key"
}

const getPasswdSql = 'select * from passwords where title = "test title";'

db.insPasswd(password)
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
