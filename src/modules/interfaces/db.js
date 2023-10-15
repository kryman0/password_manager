const path = require('node:path')

const dbHelper = require(path.resolve('src/modules/db/db_helper'))

const { dataDB } = require(path.resolve('src/modules/db/data_db'))
const { settingsDB } = require(path.resolve('src/modules/db/settings_db'))

const db = {
    // databases
    dataDB: dataDB,
    settingsDB: settingsDB,    
    // db operations
    close: dbHelper.close,
    getAll: dbHelper.getAll,
    insertRemoteHeader: this.dbHelper.insRemoteHeader,
    insertRemoteParameter: dbHelper.insRemoteParam,
    update: dbHelper.update,
}

exports.db = db
