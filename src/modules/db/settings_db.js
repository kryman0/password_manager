const path = require('node:path')

const Database = require('better-sqlite3')

const { paths } = require(path.resolve('src/modules/constants/paths'))
const { getOrCreateDb, isDbCreated, setupDbSchema } = require(path.resolve('src/modules/db/db_helper'))
const { logging } = require(path.resolve('src/modules/logging/db_logging'))


const settingsDB = (function() {
    let instance = isDbCreated(paths.db.settingsDB)

    return {
        getDb: function() {
            if (!instance) {
                instance = getOrCreateDb(paths.db.settingsDB)

                setupDbSchema(paths.db.schemaSettingsDB, instance)
            } else {
                instance = getOrCreateDb(paths.db.settingsDB)
            }

            return instance
        }
    }
})()


exports.settingsDB = settingsDB
