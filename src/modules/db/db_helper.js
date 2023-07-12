const fs = require('node:fs')
const path = require('node:path')

const Database = require('better-sqlite3')

const { getDbMsgForLogging, miscConstants } = require(path.resolve('src/modules/constants/misc'))
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
    
    runQuery(db, sql, params, miscConstants.entityTypes.passwords, params.title, miscConstants.crud.insert) 
}

function insertCategory(db, category) {
    const sql = `insert into categories values (?);`
    
    runQuery(db, sql, category, miscConstants.entityTypes.categories, category, miscConstants.crud.insert)
}

function insertPasswordCategory(db, passwordId, category) {
    const sql = `insert into passwords_categories values (?, ?);`

    const entityValue = `password id: ${passwordId}, category: ${category}`

    runQuery(db, sql, [passwordId, category], miscConstants.entityTypes.passwordsCategories, entityValue, miscConstants.crud.insert)
}

function insertRemoteParameter(db, parameter) {
    const sql = `insert into remote_parameters (\
        key,\
        value) values (\
        $key,\
        $value
    );`
    
    runQuery(db, sql, parameter, miscConstants.entityTypes.remoteParams, parameter.key, miscConstants.crud.insert)
}

function insertRemoteHeader(db, header) {
    const sql = `insert into remote_headers (\
        key,\
        value) values (\
        $key,\
        $value
    );`
    
    runQuery(db, sql, header, miscConstants.entityTypes.remoteHeaders, header.key, miscConstants.crud.insert)
}

function updateRemoteAddress(db, address) {
    const sql = 'update settings set path_remote_db = ?'

    const entityValue = 'remote address ' + address

    runQuery(db, sql, address, miscConstants.entityTypes.settings, entityValue, miscConstants.crud.update)
}

function deleteAllEntities(db, entity) {
    const sql = `delete from ${entity}`

    runQuery(db, sql, '', entity, '', miscConstants.crud.delete)
}

function runQuery(db, sql, params='', entityType, entityValue='', crud) {
    try {
        const stmt = db.prepare(sql)
        const info = stmt.run(params || [])

        const logMsg = miscConstants.getDbMsgForLogging(crud, info, entityType, entityValue)

        logging.logDbTransaction(logMsg.success)
    } catch (ex) {
        const logMsg = miscConstants.getDbMsgForLogging(crud, '', entityType, entityValue)

        logging.logDbTransaction(logMsg.error, ex)
    }
}


exports.dbHelper = {
    close: closeDb,
    deleteAll: deleteAllEntities,
    getAll: getAllEntities,
    getOne: getEntity,
    insCategory: insertCategory,
    insPassword: insertPassword,
    insPasswordCategory: insertPasswordCategory,
    insRemoteHeader: insertRemoteHeader,
    insRemoteParam: insertRemoteParameter,
    updRemoteAddress: updateRemoteAddress,
}

