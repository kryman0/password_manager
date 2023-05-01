const fs = require('node:fs')

const path = require('node:path')

const sqlite3 = require('sqlite3').verbose()
const pathToDb = path.resolve('sql/pm_db.sqlite')
const db = new sqlite3.Database(pathToDb)


let isDbInit = false

function setupDb() {
    try {
        let setupDbFile = fs.readFileSync(path.resolve('sql/setup.sqlite'), 'utf8')

        if (typeof setupDbFile !== 'string' || setupDbFile.length === 0) {
            throw new Error("Could not read the sqlite setup file")
        }
        
        db.exec(setupDbFile)
        
        db.close()

        isDbInit = true
    } catch (ex) {
        // add some logging
        db.on('error', function(err) {
            throw new Error("could not execute the sqlite setup transaction", err.message)
        })
    }
}


db.on('error', function(err) {
    throw new Error(err.message)
})


exports.db = {
    initDb: setupDb(),
    isDbInitialized: isDbInit
}

