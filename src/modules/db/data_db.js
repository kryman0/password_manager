const fs = require('node:fs')
const path = require('node:path')

const Database = require('better-sqlite3')

const { paths } = require(path.resolve('src/modules/constants/paths'))
const { getOrCreateDb, isDbCreated, setupDbSchema } = require(path.resolve('src/modules/db/db_helper'))
const { logging } = require(path.resolve('src/modules/logging/db_logging'))


const dataDB = (function() {
    let instance = isDbCreated(paths.db.dataDB)

    return {
        getDb: function() {
            if (!instance) {
                instance = getOrCreateDb(paths.db.dataDB)

                setupDbSchema(paths.db.schemaDataDB, instance)
            } else {
                instance = getOrCreateDb(paths.db.dataDB)
            }

            return instance
        },
        restoreDb: function() {    
            if (instance) {
                fs.rmSync(paths.db.dataDB)
                
                instance = false

                this.getDb()
            }
        }
    }
})()


exports.dataDB = dataDB

