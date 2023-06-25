const fs = require('node:fs')
const path = require('node:path')

const Database = require('better-sqlite3')
const pathToDb = path.resolve('sql/pm_db.sqlite')

var db = getNewDb()
setupDbSchema()

// close db when app closes, etc.

const entityTypes = {
    password: 'password',
    category: 'category'
}

function getNewDb() {
    const dbOpts = { verbose: logDbTransaction }

    return new Database(pathToDb, dbOpts)
}

function closeDb() {
    db.close()
}

function setupDbSchema() {
    try {
        let setupDbFile = fs.readFileSync(path.resolve('sql/setup.sqlite'), 'utf8')

        if (typeof setupDbFile !== 'string' || setupDbFile.length === 0) {
            throw new Error("Could not read the sqlite setup file")
        }
        
        db.pragma('journal_mode = WAL')
        db.pragma('foreign_keys = ON')

        db.exec(setupDbFile)
    } catch (ex) {
        logDbTransaction(ex)
    }
}

function isDbFileCreated() {
    return fs.existsSync(pathToDb)
}

function restoreDb() {    
    if (isDbFileCreated()) {
        fs.rmSync(pathToDb)
    }
    
    db = getNewDb()
    setupDbSchema()
}

function getAllEntities(entity) {
    const sql = `select * from ${entity};`
    
    try {
        const stmt = db.prepare(sql)
        const rows = stmt.all()

        return rows
    } catch (ex) {
        const logErrMsg = `error getting all ${entity}`

        logDbTransaction(logErrMsg, ex)
    }
}

function getEntity(entity, id) {
    const sql = `select * from ${entity} where id = ?;`
    
    try {
        const stmt = db.prepare(sql)
        const row = stmt.get(id)

        return row
    } catch (ex) {
        const logErrMsg = `error getting ${entity}`

        logDbTransaction(logErrMsg, ex)
    }
}

function insertPassword(passwd) {
    const sql = `insert into passwords (\
        title,\
        username,\
        password,\
        url,\
        description,\
        key,\
        enc_id
        ) values (\
        $title,\
        $username,\
        $password,\
        $url,\
        $descr,\
        $key,\
        $encId
    );`

    const params = { 
        title: passwd.title, 
        username: passwd.username, 
        password: passwd.password,
        url: passwd.url, 
        descr: passwd.description, 
        key: passwd.key,
        encId: passwd.encId
    }
    
    return insertEntity(sql, params, entityTypes.password, params.title) 
}

function insertCategory(category) {
    const sql = `insert into categories values (?);`
    
    return insertEntity(sql, category, entityTypes.category, category)
}

function insertPasswordCategory(passwordId, category) {
    const sql = `insert into passwords_categories values (?, ?);`

    insertEntity(sql, [passwordId, category], entityType, entityTitle)
}

function insertEntity(sql, params, entityType, entityTitle) {
    try {
        const stmt = db.prepare(sql)
        const info = stmt.run(params)

        const logMsg = `inserted ${entityType} ${entityTitle} on row id ${info.lastInsertRowid}`

        logDbTransaction(logMsg)

        return info.lastInsertRowid
    } catch (ex) {
        const errorMsg = `error inserting ${entityType} ${entityTitle}`

        logDbTransaction(errorMsg, ex)
    }
}

function logDbTransaction(transType='From database', transLog='') {
    // add some logging
    console.log(`${transType} ${transLog}`)
}


exports.db = {
    close: closeDb,
    getAll: getAllEntities,
    getOne: getEntity,
    insCategory: insertCategory,
    insPassword: insertPassword,
    insPasswordCategory: insertPasswordCategory,
    isDbFileCreated: isDbFileCreated,
    restore: restoreDb,
    setupDb: setupDbSchema,
}

