const fs = require('node:fs')
const path = require('node:path')

const Database = require('better-sqlite3')

const { miscConstants } = require(path.resolve('src/modules/constants/misc'))
const { logging } = require(path.resolve('src/modules/logging/db_logging'))

// close db when app closes, etc.

function closeDb(dbs) {
    console.log("from closedb", dbs)
    for (let i = 0; i < dbs.length; i++) {
        dbs[i].close()
    }
    console.log("from closedb", dbs)
}


exports.getOrCreateDb = function getOrCreateDb(pathToDb) {
    const dbOpts = { verbose: logging.logDbTransaction }
    
    return new Database(pathToDb, dbOpts)
}

exports.setupDbSchema = function setupDbSchema(pathToSchema, instance, useFK=false) {
    try {
        let setupDbFile = fs.readFileSync(pathToSchema, 'utf8')

        if (typeof setupDbFile !== 'string' || setupDbFile.length === 0) {
            throw new Error("Could not read the sqlite setup file")
        }
        
        if (useFK) {
            instance.pragma('foreign_keys = ON')
        }

        instance.pragma('journal_mode = WAL')

        instance.exec(setupDbFile)
    } catch (ex) {
        logging.logDbTransaction(ex)
    }
}

exports.isDbCreated = function isDbFileCreated(pathToDb) {
    return fs.existsSync(pathToDb)
}

function getAllEntities(db, entity) {
    const sql = `select * from ${entity};`
    
    try {
        const stmt = db.prepare(sql)
        const rows = stmt.all()

        return rows
    } catch (ex) {
        const logErrMsg = `error getting all ${entity}`

        logging.logDbTransaction(logErrMsg, ex)
    }
}

function getEntity(db, entity, id) {
    const sql = `select * from ${entity} where id = ?;`
    
    try {
        const stmt = db.prepare(sql)
        const row = stmt.get(id)

        return row
    } catch (ex) {
        const logErrMsg = `error getting ${entity}`

        logging.logDbTransaction(logErrMsg, ex)
    }
}

function insertPassword(db, passwd) {
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
    
    return insertEntity(db, sql, params, miscConstants.entityTypes.password, params.title) 
}

function insertCategory(db, category) {
    const sql = `insert into categories values (?);`
    
    return insertEntity(db, sql, category, miscConstants.entityTypes.category, category)
}

function insertPasswordCategory(db, passwordId, category) {
    const sql = `insert into passwords_categories values (?, ?);`

    insertEntity(db, sql, [passwordId, category], miscConstants.entityTypes.passwordCategory, entityTitle)
}

function insertRemoteParameters(db, parameters) {
    const sql = `insert into remote_parameters (\
        key,\
        value) values (\
        $key,\
        $value
    );`
    
    insertEntity(db, sql, parameters, miscConstants.entityTypes.remoteParams, parameters.key)
}

function insertRemoteHeaders(db, headers) {
    const sql = `insert into remote_headers (\
        key,\
        value) values (\
        $key,\
        $value
    );`
    
    insertEntity(db, sql, headers, miscConstants.entityTypes.remoteHeaders, headers.key)
}

function insertEntity(db, sql, params, entityType='', entityTitle='') {
    try {
        const stmt = db.prepare(sql)
        const info = stmt.run(params)
        console.log(info)

        const logMsg = `inserted ${entityType} ${entityTitle} on row id ${info.lastInsertRowid}`

        logging.logDbTransaction(logMsg)

        return info.lastInsertRowid
    } catch (ex) {
        const errorMsg = `error inserting ${entityType} ${entityTitle}`

        logging.logDbTransaction(errorMsg, ex)
    }
}


exports.dbHelper = {
    close: closeDb,
    getAll: getAllEntities,
    getOne: getEntity,
    insCategory: insertCategory,
    insPassword: insertPassword,
    insPasswordCategory: insertPasswordCategory,
    insRemoteHeaders: insertRemoteHeaders,
    insRemoteParams: insertRemoteParameters,
}

