const fs = require('node:fs')
const path = require('node:path')

const Database = require('better-sqlite3')
const pathToDb = path.resolve('sql/pm_db.sqlite')

var db = getNewDb()

// close db when app closes, etc.


const crud = {
    insert: 'insert',
    update: 'update',
    delete: 'delete'
}


function getNewDb() {
    const dbOpts = { verbose: logDbTransaction }

    return new Database(pathToDb, dbOpts)
}

function getCrudActionMsg(crudAction, entity, info=null) {
    const crudActionMsgs = {
        insertPwd:  `Inserted password ${entity} on row id ${info.lastInsertRowid}`,
        errInsPwd:  `error inserting password ${entity}`
    }

    switch (crudAction) {
        case 'insert password':
            return crudActionMsgs.insertPwd
        case 'error inserting password':
            return crudActionMsgs.errInsPwd
    }
}

function setupDbSchema() {
    try {
        let setupDbFile = fs.readFileSync(path.resolve('sql/setup.sqlite'), 'utf8')

        if (typeof setupDbFile !== 'string' || setupDbFile.length === 0) {
            // add some logging
            throw new Error("Could not read the sqlite setup file")
        }
        
        db.pragma('journal_mode = WAL')
        db.pragma('foreign_keys = ON')

        db.exec(setupDbFile)
    } catch (ex) {
        // add some logging
        dbTransactionError(ex, "Could not execute the sqlite setup transaction")

        throw ex
    }
}

function isDbFileCreated() {
    return fs.existsSync(pathToDb)
}

function restoreDb() {
    if (isDbFileCreated()) {
        setupDbSchema()
    } else {
        db = getNewDb()
    }
}

function runQuery(sql, params, crud) {
    db.run(sql, params, function (err) {
        console.log("from run query", err)
        if (err) {
            dbTransactionError(err, crud)         

            throw err
        } else {
            if (crud === crud.insert) logDbTransaction(crud, this.lastID)
            else if (crud === crud.update || crud === crud.delete) logDbTransaction(crud, this.changes)
        }
    })
}

// Maybe use better query for larger sets. See each.
function getAllEntities(sql, params, crud) {
    db.all(sql, params, function (err, rows) {
        if (err) {
            dbTransactionError(err, crud)         

            throw new Error(err)
        }

        console.log(rows)
    })
}

function getEntity(sql, params, crud) {
    db.get(sql, params, function (err, row) {
        if (err) {
            dbTransactionError(err, crud)

            throw new Error(err)
        }

        if (row === undefined || row) console.log(row)
    })
}

function checkIfEntityExists(sql, entity) {
    db.get(sql, function(err, row) {
        if (err) {
            throw new Error(`There was some error checking if ${entity} exists before inserting ${entity}`, err)
        } else if (row) {
            throw new Error(`${entity} already exists`)
        }
    })
}

function insertPassword(passwd) {
    const logMsg = 'insert password'
    const errorMsg = 'error inserting password'

    const sql = `insert into passwords (\
        title,\
        username,\
        password,\
        url,\
        description,\
        encryption) values (\
        $title,\
        $username,\
        $password,\
        $url,\
        $descr,\
        $encryption);`

    const params = { 
        title: passwd.title, 
        username: passwd.username, 
        password: passwd.password,
        url: passwd.url, 
        descr: passwd.description, 
        encryption: passwd.encryption
    }
    
    try {
        const insPwd = db.prepare(sql)
        const info = insPwd.run(params)

        logDbTransaction(getCrudActionMsg(logMsg, passwd.title, info))
    } catch (ex) {
        logDbTransaction(getCrudActionMsg(errorMsg, passwd.title), ex)
    }

    //try {
    //    runQuery(sql, params, crud.insert)
    //} catch (ex) {
    //    dbTransactionError(err, crud.insert)
    //}

    //return getCrudActionMsg('insert password', passwd.title)
}

//function dbTransactionError(transactType, err) {
//    // add some logging
//    console.log(`${transactType} error: ${err}`)
//}

function logDbTransaction(transType='From database', transLog='') {
    // insert, update or delete
    // add some logging
    console.log(`${transType} ${transLog}`)
}


exports.db = {
    setupDb: setupDbSchema,
    isDbFileCreated: isDbFileCreated,
    restoreDb: restoreDb,
    insPasswd: insertPassword,
    //getEntity: getEntity,
    //getAllEntities: getAllEntities
}

