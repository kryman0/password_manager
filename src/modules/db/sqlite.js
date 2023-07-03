const fs = require('node:fs')
const path = require('node:path')

const Database = require('better-sqlite3')
const { logging } = require(path.resolve('src/modules/logging/db_logging'))
const paths = require(path.resolve('src/modules/constants/const_db'))

//const db = (function() {
//    var settingsInstance, dataInstance
//
//    function getNewDb(pathToDb) {
//        const dbOpts = { verbose: logging.logDbTransaction }
//        
//        return new Database(pathToDb, dbOpts)
//    }
//
//    function setupDbSchema(pathToSchema, instance) {
//        try {
//            let setupDbFile = fs.readFileSync(pathToSchema, 'utf8')
//
//            if (typeof setupDbFile !== 'string' || setupDbFile.length === 0) {
//                throw new Error("Could not read the sqlite setup file")
//            }
//            
//            if (pathToSchema === paths.dataDb) {
//                instance.pragma('foreign_keys = ON')
//            }
//
//            instance.pragma('journal_mode = WAL')
//
//            instance.exec(setupDbFile)
//        } catch (ex) {
//            logging.logDbTransaction(ex)
//        }
//    }
//
//    return {
//        getSettingsDb: function() {
//            if (!settingsInstance) {
//                settingsInstance = getNewDb(paths.settingsDb)
//
//                setupDbSchema(paths.schemaSettingsDb, settingsInstance)
//            }
//
//            return settingsInstance
//        },
//        getDataDb: function() {
//            if (!dataInstance) {
//                dataInstance = getNewDb(paths.dataDb)
//
//                setupDbSchema(paths.schemaDataDb, dataInstance)
//            }
//
//            return dataInstance
//        }
//    }
//})()

// close db when app closes, etc.


const entityTypes = {
    password: 'password',
    category: 'category',
}


function closeDb(db) {
    db.close()
}


exports.getOrCreateDb = function getOrCreateDb(pathToDb) {
    const dbOpts = { verbose: logging.logDbTransaction }
    
    return new Database(pathToDb, dbOpts)
}

exports.setupDbSchema = function setupDbSchema(pathToSchema, instance) {
    try {
        let setupDbFile = fs.readFileSync(pathToSchema, 'utf8')

        if (typeof setupDbFile !== 'string' || setupDbFile.length === 0) {
            throw new Error("Could not read the sqlite setup file")
        }
        
        if (pathToSchema === paths.dataDb) {
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

function restoreDb() {    
    if (isDbFileCreated()) {
        fs.rmSync(pathToDb)
    }
    
    db = getNewDb()
    setupDbSchema()
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
    
    return insertEntity(db, sql, params, entityTypes.password, params.title) 
}

function insertCategory(db, category) {
    const sql = `insert into categories values (?);`
    
    return insertEntity(db, sql, category, entityTypes.category, category)
}

function insertPasswordCategory(db, passwordId, category) {
    const sql = `insert into passwords_categories values (?, ?);`

    insertEntity(db, sql, [passwordId, category], entityType, entityTitle)
}

function insertEntity(db, sql, params, entityType, entityTitle) {
    try {
        const stmt = db.prepare(sql)
        const info = stmt.run(params)

        const logMsg = `inserted ${entityType} ${entityTitle} on row id ${info.lastInsertRowid}`

        logging.logDbTransaction(logMsg)

        return info.lastInsertRowid
    } catch (ex) {
        const errorMsg = `error inserting ${entityType} ${entityTitle}`

        logging.logDbTransaction(errorMsg, ex)
    }
}



exports.db = {
    close: closeDb,
    getAll: getAllEntities,
    getOne: getEntity,
    insCategory: insertCategory,
    insPassword: insertPassword,
    insPasswordCategory: insertPasswordCategory,
    restore: restoreDb,
}

