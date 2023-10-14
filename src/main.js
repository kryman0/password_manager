const fs = require('node:fs')
const path = require('node:path')

const { app, BrowserWindow, net } = require('electron')

const { miscConstants } = require(path.resolve('src/modules/constants/misc'))
const { paths } = require(path.resolve('src/modules/constants/paths'))
const { dbHelper } = require(path.resolve('src/modules/db/db_helper'))
const { aesjs } = require(path.resolve('src/modules/encryption/aes'))
const { fsHelper } = require(path.resolve('src/modules/helpers/fs'))

fsHelper.createFolderIfNonExisting(path.join(paths.folders.userHome, paths.folders.appFolder))

const { dataDB } = require(path.resolve('src/modules/db/data_db'))
const { settingsDB } = require(path.resolve('src/modules/db/settings_db'))


//const dataDb = dataDB.getDb()
const dataDb = dataDB.restoreDb()
const settingsDb = settingsDB.getDb()
//if (!db.isDbFileCreated()) db.setupDb() //check this for remote access

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

const remoteParams = [
    { key: 'sp', value: 'racwdl' },
    { key: 'st', value: '2023-07-16T08:27:31Z' },
    { key: 'se', value: '2023-07-16T16:27:31Z' },
    { key: 'spr', value: 'https' },
    { key: 'sv', value: '2022-11-02' },
    { key: 'sr', value: 'c' },
    { key: 'sig', value: 'CyXmlUI9ose7oGVbSv3dEOpT9coU72cRGvEpsNN%2FWX0%3D' },
]

const settings = dbHelper.getAll(settingsDb, miscConstants.entityTypes.settings)

const remoteHeaders = [ { key: 'x-ms-blob-type', value: 'AppendBlob' } ]
const fullURL = 'https://krystianmanczak.blob.core.windows.net/test?sp=racwdl&st=2023-10-08T08:49:57Z&se=2023-10-08T16:49:57Z&spr=https&sv=2022-11-02&sr=c&sig=AYsw5%2BT5wsf3Kl9%2FLMZP%2BDLfCQRFZgR7ovWExGrHgOY%3D'
const url = 'https://krystianmanczak.blob.core.windows.net/test/test_file2?comp=appendblock'

dbHelper.update(settingsDb, miscConstants.entityTypes.settings, 'path_remote_db', fullURL) // add constants for columns too
dbHelper.update(settingsDb, miscConstants.entityTypes.settings, 'remote_http_method', 'PUT')
dbHelper.insRemoteParam(settingsDb, remoteParams)
dbHelper.insRemoteHeader(settingsDb, remoteHeaders)
//dbHelper.deleteAll(settingsDb, miscConstants.entityTypes.remoteParams)

//dbHelper.insPassword(dataDb, password)
//dbHelper.insCategory(dataDb, category)
//dbHelper.insPasswordCategory(dataDb, 1, category)
////console.log(db.getOne('passwords', 1))
console.log(dbHelper.getAll(settingsDb, miscConstants.entityTypes.remoteParams))
//console.log(dbHelper.getAll(dataDb, miscConstants.entityTypes.categories))
//console.log(dbHelper.getAll(dataDb, miscConstants.entityTypes.passwordsCategories))


const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile(path.join(__dirname, 'windows/index.html'))
}


app.whenReady().then(() => {
    //createWindow()

    //app.on('activate', () => {
    //    if (BrowserWindow.getAllWindows().length === 0) createWindow()
    //})
    
    const settings = dbHelper.getAll(settingsDb, miscConstants.entityTypes.settings)[0]
    console.log('settings', settings)
    
    const request = net.request({
        method: settings.remote_http_method,
        url:    settings.path_remote_db
    })
    //request.setHeader('x-ms-date', new Date().toUTCString())
    //request.setHeader('Authorization', '="SharedKey krystianmanczak.blob.core.windows.net:2%2FLNHROZRs7gjN5dpHsinUXVWiN2Mpy5EtZoDOmyKGQ%3D"')
    //request.setHeader('x-ms-version', '2022-11-02')

    request.write('\nanother line from electron')
    request.setHeader('x-ms-blob-type', 'AppendBlob')
    request.on('response', (response) => {
        response.on('end', () => console.log('no more data'))
        response.on('data', (chunk) => {
            console.log(chunk.toString())
        })
    })
    request.end()
    

    dbHelper.close([settingsDb, dataDb])
})


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
