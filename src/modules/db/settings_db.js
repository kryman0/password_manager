const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')

const Database = require('better-sqlite3')

const { paths } = require(path.resolve('src/modules/constants/paths'))
const { getOrCreateDb, isDbCreated, setupDbSchema } = require(path.resolve('src/modules/db/db_helper'))
const { logging } = require(path.resolve('src/modules/logging/db_logging'))


const settingsDB = (function() {
    console.log('how many times have I been called?', paths.db.settingsDB)

    let instance = isDbCreated(paths.db.settingsDB)

    return {
        getDb: function() {
            if (!instance) {
                instance = getOrCreateDb(paths.db.settingsDB)

                setupDbSchema(paths.db.schemaSettingsDB, instance)

                insertDefaultLocalPathToDB(instance)
            } else {
                instance = getOrCreateDb(paths.db.settingsDB)
            }

            return instance
        }
    }
})()

function insertDefaultLocalPathToDB(db) {
    console.log(paths.db.settingsDB)
    const sql = `insert into settings (path_local_db) values ('${paths.db.settingsDB.toString()}');`

    try {
        const stmt = db.prepare(sql)
        stmt.run()

        const logMsg = 'inserted default local database path into settings'

        logging.logDbTransaction(logMsg)
    } catch (ex) {
        const logErrMsg = 'error inserting default local path into settings db'

        logging.logDbTransaction(logErrMsg, ex)
    }
}


exports.settingsDB = settingsDB

