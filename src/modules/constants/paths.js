const { homedir } = require('node:os')
const path = require('node:path')

const { dbNames } = require(path.resolve('src/modules/constants/misc'))


const folders = {
    userHome: homedir(),
    appFolder: '.pwman',
}

const db = {
    dataDB:             path.join(folders.userHome, folders.appFolder, dbNames.data),
    settingsDB:         path.join(folders.userHome, folders.appFolder, dbNames.settings),
    schemaDataDB:       path.resolve('sql/setup_data.sqlite'),
    schemaSettingsDB:   path.resolve('sql/setup_settings.sqlite'),
}


exports.paths = {
    db: db,
    folders: folders,
}

