const fs = require('node:fs')
const path = require('node:path')

const { app, BrowserWindow } = require('electron')

const { miscConstants } = require(path.resolve('src/modules/constants/misc'))
const { paths } = require(path.resolve('src/modules/constants/paths'))
const { dbHelper } = require(path.resolve('src/modules/db/db_helper'))
const { aesjs } = require(path.resolve('src/modules/encryption/aes'))
const { fsHelper } = require(path.resolve('src/modules/helpers/fs'))

fsHelper.createFolderIfNonExisting(path.join(paths.folders.userHome, paths.folders.appFolder))

const { settingsDB } = require(path.resolve('src/modules/db/settings_db'))


const settiDb = settingsDB.getDb()
//if (!db.isDbFileCreated()) db.setupDb() //check this for remote access

//db.restore()

const key = aesjs.generateKey()

const passwd = aesjs.getEncPasswdToHex("my password", key)
const decrPasswd = aesjs.getDecPasswdFromHex(passwd, key)

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

const remoteParams = { key: 'myKey', value: 'myValue' }
dbHelper.insRemoteParams(settiDb, remoteParams)
console.log(dbHelper.getAll(settiDb, miscConstants.entityTypes.remoteParams))

//db.insPassword(password)
//db.insCategory(category)
//
//console.log(db.getOne('passwords', 1))
//
//console.log(db.getAll('passwords'))
//
dbHelper.close([settiDb])

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
