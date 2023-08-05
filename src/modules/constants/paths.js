const { homedir } = require('node:os')
const path = require('node:path')

const { miscConstants } = require(path.resolve('src/modules/constants/misc'))


const folders = {
    userHome: homedir(),
    appFolder: '.pwman',
}

const db = {
    dataDB:             path.join(folders.userHome, folders.appFolder, miscConstants.dbNames.data),
    settingsDB:         path.join(folders.userHome, folders.appFolder, miscConstants.dbNames.settings),
    schemaDataDB:       path.resolve('sql/setup_data.sqlite'),
    schemaSettingsDB:   path.resolve('sql/setup_settings.sqlite'),
}


exports.paths = {
    db: db,
    folders: folders,
}

