const entityTypes = {
    categories:             'categories',
    passwords:              'passwords',
    passwordsCategories:    'passwords_categories',
    remoteHeaders:          'remote_headers',
    remoteParams:           'remote_parameters',
    settings:               'settings',
}

const crud = {
    insert: 'insert',
    update: 'update',
    delete: 'delete',
}

const funcNames = {
    insertRemoteParameter:  'insertRemoteParameter',
    insertRemoteHeader:     'insertRemoteHeader',
}

const dbNames: {
    data:       'pm_data_db.sqlite',
    settings:   'pm_settings_db.sqlite',
}

function getDbMsgForLogging(crud, info, entityType, entityValueOrColumn='') {
    entityValueOrColumn = entityValueOrColumn.toString()

    const dbLoggingMsg = {
        insert: {
            success: `inserted ${entityValueOrColumn} into ${entityType} on row id ${info.lastInsertRowid}`,
            error: `error inserting ${entityValueOrColumn} into ${entityType}`,
        },
        update: {
            success: `updated ${info.changes} rows on ${entityValueOrColumn} in ${entityType}`,
            error: `error updating ${entityValueOrColumn} in ${entityType}`,
        },
        delete: {
            success: `deleted ${info.changes} ${entityValueOrColumn || 'rows'} from ${entityType}`,
            error: `error deleting ${entityValueOrColumn} from ${entityType}`,
        },
    }
    
    let logMsgObj;

    switch (crud) {
        case 'insert':
            logMsgObj = dbLoggingMsg.insert
            break
        case 'update':
            logMsgObj = dbLoggingMsg.update
            break
        case 'delete':
            logMsgObj = dbLoggingMsg.delete
    }

    return logMsgObj
}


exports.miscConstants = {
    crud: crud,
    dbNames: dbNames,
    entityTypes: entityTypes,
    funcNames: funcNames,
    getDbMsgForLogging: getDbMsgForLogging,
}

