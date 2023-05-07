const fs = require('node:fs')

const path = require('node:path')

const sqlite3 = require('sqlite3').verbose()
const pathToDb = path.resolve('sql/pm_db.sqlite')
const db = new sqlite3.Database(pathToDb)


const crud = {
    insert: 'insert',
    update: 'update',
    delete: 'delete'
}


function setupDb() {
    try {
        let setupDbFile = fs.readFileSync(path.resolve('sql/setup.sqlite'), 'utf8')

        if (typeof setupDbFile !== 'string' || setupDbFile.length === 0) {
            // add some logging
            throw new Error("Could not read the sqlite setup file")
        }
        
        db.exec(setupDbFile)
        
        db.close()

    } catch (ex) {
        // add some logging
        db.on('error', function(err) {
            throw new Error("Could not execute the sqlite setup transaction", err)
        })
    }
}

function isDbInit() {
    return fs.existsSync(pathToDb)
}

function insertUser(user) {
    const sql = 'insert into users (email, password) values($username, $password)'

    db.run(sql, {$username: user.username, $password: user.password}, function (err) {
        if (err) dbTransactionError(err, crud.insert)
        else logSuccDbTransaction(crud.insert, this.lastID)
    })
}

function dbTransactionError(err, transactType) {
    console.log(`${transactType} error: ${err}`)
}

function logSuccDbTransaction(transactType, transactLog) {
    // insert, update or delete
    // add some logging
    console.log(`${transactType} successful: ${transactLog}`)
}


db.on('error', function(err) {
    // add logging
    throw new Error(err)
})


exports.db = {
    initDb: setupDb,
    isDbInit: isDbInit,
}

