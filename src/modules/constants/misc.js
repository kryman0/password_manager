const entityTypes = {
    categories:             'categories',
    passwords:              'passwords',
    passwordsCategories:    'passwords_categories',
    remoteHeaders:          'remote_headers',
    remoteParams:           'remote_parameters',
    settings:               'settings',
}

function getDbMsgForLogging(crud, entityType, entityValueOrColumn) {
    entityValueOrColumn = entityValue.toString()

    const dbLoggingMsg = {
        insert: {
            success: `inserted ${entityValueOrColumn} into ${entityType}`,
            error: `error inserting ${entityValueOrColumn} into ${entityType}`,
        },
        update: {
            success: `updated ${entityValueOrColumn} in ${entityType}`,
            error: `error updating ${entityValueOrColumn} in ${entityType}`,
        },
        delete: {
            successAll: `deleted ${entityValueOrColumn} in ${entityType}`, // check this for one and all
            errorAll: `error updating ${entityValueOrColumn} in ${entityType}`,
            successOne: ``
        }
    }
    
    let logMsgObj;

    switch (crud) {
        case 'insert':
            logMsgObj = dbLoggingMsg.insert
        case 'update':
            logMsg = 
    }
}


exports.miscConstants = {
    entityTypes: entityTypes,
}

