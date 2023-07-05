const fs = require('node:fs')
const path = require('node:path')


function createFolderIfNoneExisting(path) {
    if (!fs.existsSync(path)) {
        try {
            fs.mkdirSync(path)
        } catch (ex) {
            throw new Error('Could not create directory ' + path)
        }
    }
}


exports.fsHelper = {
    createFolderIfNoneExisting: createFolderIfNoneExisting,
}

