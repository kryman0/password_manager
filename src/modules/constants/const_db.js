const path = require('node:path')


const paths = {
    schemaSettingsDB:   path.resolve('sql/setup_settings.sqlite'),
    schemaDataDB:       path.resolve('sql/setup_data.sqlite'),
    settingsDB:         path.resolve('sql/pm_settings_db.sqlite'),
    dataDB:             path.resolve('sql/pm_data_db.sqlite'),
}


exports.paths = paths
