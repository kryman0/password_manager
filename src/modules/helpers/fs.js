const fs = require('node:fs')


function createFolderIfNonExisting(path) {
    if (!fs.existsSync(path)) {
        console.log(path)
        try {
            fs.mkdirSync(path)
        } catch (ex) {
            throw new Error('Could not create directory ' + path)
        }
    }
}


exports.fsHelper = {
    createFolderIfNonExisting: createFolderIfNonExisting,
}

