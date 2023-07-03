const path = require('node:path')

const Database = require('better-sqlite3')

const { logDbTransaction } = require(path.resolve('src/modules/logging/db_logging'))
const paths = require(path.resolve('src/modules/constants/const_db'))
const { getOrCreateDb, isDbCreated, setupDbSchema } = require(path.resolve('src/modules/db/sqlite'))

const settingsDB = (function() {
    console.log('how many times have I been called?')

    var instance = isDbCreated(paths.settingsDB)

    return {
        getDb: function() {
            if (!instance) {
                instance = getOrCreateDb(paths.settingsDB)

                setupDbSchema(paths.schemaSettingsDB, instance)
            } else {
                instance = getOrCreateDb(paths.settingsDB)
            }

            return instance
        }
    }
})()


exports.settingsDB = settingsDB
