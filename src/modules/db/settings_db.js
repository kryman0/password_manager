const Database = require('better-sqlite3')
const path = require('node:path')
const paths = require(path.resolve('src/modules/constants/const_db'))


const settingsDB = (function() {
    var instance;

    function getNewDb() {
        const dbOpts = { verbose: logDbTransaction }
        
        return new Database(paths.settingsDB, dbOpts)
    }

    function setupDbSchema() {
        try {
            let setupDbFile = fs.readFileSync(paths.schemaSettingsDB, 'utf8')

            if (typeof setupDbFile !== 'string' || setupDbFile.length === 0) {
                throw new Error("Could not read the sqlite setup file")
            }
            
            instance.pragma('journal_mode = WAL')

            instance.exec(setupDbFile)
        } catch (ex) {
            logDbTransaction(ex)
        }
    }

    return {
        getDb: function() {
            if (!instance) {
                instance = getNewDb()

                setupDbSchema()
            }

            return instance
        }
})()


exports.db = settingsDB
