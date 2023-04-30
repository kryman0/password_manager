const { app, BrowserWindow } = require('electron')
const path = require('path')
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(path.join(__dirname, '..', 'sql/pm_db.sqlite'))
const fs = require('fs')
const EventEmitter = require('events')
class MyEvent extends EventEmitter {}
const myEv = new MyEvent()
myEv.on('error', (err) => {
    console.log("emitted some error:", err)
})

let ddl = fs.readFileSync(path.join(__dirname, '..', 'sql/setup.sqlite'), { encoding: 'utf8' })

db.serialize(function() {
    db.exec(ddl)

    db.run(
        'insert into users values ("kalle@test.com", "mypass");',
        function(res) {
            console.log("from inserting user", res)
        }
    )
    db.run(
        'insert into passwords values ("my first test", "kalle", "pass", "hello.com", "desc", "kalle@test.com");',
        function(res) {
            console.log("from inserting pass", res)
        }
    )
})

db.get(
    "select * from users;", function(err, row) {
        console.log(err, row)
})

db.get(
    "select * from passwords;", function(err, row) {
        console.log(err, row)
})

db.on('error', function(err) {
    console.log("from db err:", err)
})


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
