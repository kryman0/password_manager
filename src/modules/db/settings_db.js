const os = require('node:os')
const path = require('node:path')

const Database = require('better-sqlite3')

const { paths } = require(path.resolve('src/modules/constants/paths'))
const { getOrCreateDb, isDbCreated, setupDbSchema } = require(path.resolve('src/modules/db/db_helper'))
const { logDbTransaction } = require(path.resolve('src/modules/logging/db_logging'))


const settingsDB = (function() {
    console.log('how many times have I been called?', paths.db.settingsDB)

    var instance = isDbCreated(paths.db.settingsDB)

    return {
        getDb: function() {
            if (!instance) {
                // check if folder has not been created for db
                instance = getOrCreateDb(paths.db.settingsDB)

                setupDbSchema(paths.db.schemaSettingsDB, instance)


            } else {
                instance = getOrCreateDb(paths.db.settingsDB)
            }

            return instance
        }
    }
})()

function insertDefaultLocalPathToDB(db) {
    const sql = `insert into settings (path_local_db) values (${paths.db.settingsDB});`

    const stmt = db.prepare(sql)
    stmt.run()
}


exports.settingsDB = settingsDB
