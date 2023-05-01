const { app, BrowserWindow } = require('electron')
const path = require('node:path')
const EventEmitter = require('node:events')
class MyEvent extends EventEmitter {}
const myEv = new MyEvent()
myEv.on('error', (err) => {
    console.log("emitted some error:", err)
})


//const db = require('modules/db/sqlite')
const { db } = require('./modules/db/sqlite')

console.log(db.initDb)
console.log(db.isDbInitialized)

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
