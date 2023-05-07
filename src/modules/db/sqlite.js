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
        
        //db.close()

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

function runQuery(sql, params, crud) {
    db.run(sql, params, function (err) {
        if (err) {
            dbTransactionError(err, crud)         
        } else {
            if (crud === crud.insert) logDbTransaction(crud, this.lastID)
            else if (crud === crud.update || crud === crud.delete) logDbTransaction(crud, this.changes)
        }
    })
}

function checkIfEntityExists(sql, entity) {
    db.get(sql, function(err, row) {
        // add some logging to first two conditions
        if (err) {
            throw new Error(`There was some error checking if ${entity} exists before inserting ${entity}`, err)
        }

        if (row) {
            throw new Error(`${entity} already exists`)
        }
    })
}

function insertUser(user) {
    const sql = 'insert into users (email, password) values ($email, $password);'

    const params = { $email: user.email, $password: user.password }
    
    const doesUserExistsSql = `select * from users where email = "${user.email}";`

    checkIfEntityExists(doesUserExistsSql, user.email)

    //runQuery(sql, params, crud.insert)
}

function insertPassword(passwd) {
    const sql = `insert into passwords (
        title,
        username,
        password,
        url,
        description,
        user_email) values (
        $title,
        $username,
        $password,
        $url,
        $descr,
        $user_email);`

    const params = { $title: passwd.title, $username: passwd.username, $password: passwd.password,
        $url: passwd.url, $descr: passwd.description, $user_email: passwd.userEmail }

    runQuery(sql, params, crud.insert)
}

function dbTransactionError(err, transactType) {
    // add some logging
    console.log(`${transactType} error: ${err}`)
}

function logDbTransaction(transactType, transactLog) {
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
    insertUser: insertUser,
    insertPassword: insertPassword
}

