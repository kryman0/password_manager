const fs = require('node:fs')
const path = require('node:path')

const Database = require('better-sqlite3')

const { miscConstants } = require(path.resolve('src/modules/constants/misc'))
const { logging } = require(path.resolve('src/modules/logging/db_logging'))

// close db when app closes, etc.

function closeDb(dbs) {
    for (let i = 0; i < dbs.length; i++) {
        let db = dbs[i]

        try {
            db.close()
        } catch (ex) {
            const errMsg = `error closing ${db}`

            logging.logDbTransaction(errMsg, ex)            
        }
    }
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

function getEntity(db, entity, column, value) {
    const sql = `select * from ${entity} where ${column} = ?;`
    
    try {
        const stmt = db.prepare(sql)
        const row = stmt.get(value)

        return row
    } catch (ex) {
        const logErrMsg = `error getting ${column} from ${entity}`

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
    
    return insertEntity(db, sql, params, miscConstants.entityTypes.passwords, params.title) 
}

function insertCategory(db, category) {
    const sql = `insert into categories values (?);`
    
    return insertEntity(db, sql, category, miscConstants.entityTypes.categories, category)
}

function insertPasswordCategory(db, passwordId, category) {
    const sql = `insert into passwords_categories values (?, ?);`

    insertEntity(db, sql, [passwordId, category], miscConstants.entityTypes.passwordsCategories, `p id: ${passwordId}, cat: ${category}`)
}

function insertRemoteParameter(db, parameter) {
    const sql = `insert into remote_parameters (\
        key,\
        value) values (\
        $key,\
        $value
    );`
    
    insertEntity(db, sql, parameter, miscConstants.entityTypes.remoteParams, parameter.key)
}

function insertRemoteHeader(db, header) {
    const sql = `insert into remote_headers (\
        key,\
        value) values (\
        $key,\
        $value
    );`
    
    insertEntity(db, sql, header, miscConstants.entityTypes.remoteHeaders, header.key)
}

function updateRemoteAddress(db, address) {
    const sql = 'update settings set path_remote_db = ?'

    insertEntity(db, sql, address, miscConstants.entityTypes.settings, 'remote address ' + address)
}

function insertEntity(db, sql, params, entityType='', entityValue='') {
    try {
        const stmt = db.prepare(sql)
        const info = stmt.run(params)

        const logMsg = `inserted into ${entityType} ${entityValue.toString()} on row id ${info.lastInsertRowid}`

        logging.logDbTransaction(logMsg)

        return info.lastInsertRowid
    } catch (ex) {
        const errorMsg = `error inserting ${entityType} ${entityValue.toString()}`

        logging.logDbTransaction(errorMsg, ex)
    }
}

function deleteAllEntities(db, entity) {
    const sql = `delete from ${entity}`

    try {
        const stmt = db.prepare(sql)
        const info = stmt.run(stmt)

    }
}

function runQuery(db, sql, params, entityType, entityValue, crud) {
    try {
        const stmt = db.prepare(sql)
        const info = stmt.run()

        let logSuccessMsg, logErrorMsg;

    }
}


exports.dbHelper = {
    close: closeDb,
    getAll: getAllEntities,
    getOne: getEntity,
    insCategory: insertCategory,
    insPassword: insertPassword,
    insPasswordCategory: insertPasswordCategory,
    insRemoteHeader: insertRemoteHeader,
    insRemoteParam: insertRemoteParameter,
    updRemoteAddress: updateRemoteAddress,
}

