const { app, BrowserWindow } = require('electron')
const path = require('node:path')
const fs = require('node:fs')

const { db } = require('./modules/db/sqlite')

console.log(db.isDbFileCreated())
if (!db.isDbFileCreated()) db.setupDb() //check this for remote access
console.log(db.isDbFileCreated())


const user = { email: 'user1@test.com', password: 'test' }

const password = {
    title: 'test title',
    username: 'user1',
    password: 'pass1',
    url: 'https://www.account1.com',
    description: '',
    userEmail: 'adam@test.com'
}

const getPasswdSql = 'select * from passwords where title = "test title";'
const getAllPasswdsSql = 'select * from passwords;'

//console.log(db.insertPassword(password))
//console.log(db.getEntity(getPasswdSql, 'select one'))
//db.getAllEntities(getAllPasswdsSql, [], 'select all')


const sql = `insert into passwords (\
    title,\
    username,\
    password,\
    url,\
    description,\
    user_email) values (\
    $title,\
    $username,\
    $password,\
    $url,\
    $descr,\
    $user_email);`

const params = { 
    title: password.title, 
    username: password.username, 
    password: password.password,
    url: password.url, 
    descr: password.description, 
    user_email: password.userEmail 
}

const insPwd = db.prepare(sql)
console.log(insPwd.run(params))

const sqlUsr = 'insert into users (email, password) values (?, ?);'
const insUsr = db.prepare(sqlUsr)
console.log(insUsr.run("adam@test.com", "pass1"))

const selUsr = db.prepare('select * from users;')
console.log(selUsr.all())

//const insPwd = db.prepare(sql)
//console.log(insPwd.run(params))

const select = db.prepare(getAllPasswdsSql)
console.log(select.all())

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
