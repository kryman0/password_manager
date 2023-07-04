const { homedir } = require('node:os')
const path = require('node:path')


const folders = {
    userHome: homedir(),
    appFolder: '.pwman',
}

const db = {
    dataDB:             path.join(folders.userHome, folders.appFolder, 'pm_data_db.sqlite'),
    settingsDB:         path.join(folders.userHome, folders.appFolder, 'pm_settings_db.sqlite'),
    schemaDataDB:       path.resolve('sql/setup_data.sqlite'),
    schemaSettingsDB:   path.resolve('sql/setup_settings.sqlite'),
}


exports.paths = {
    db: db,
    folders: folders,
}

