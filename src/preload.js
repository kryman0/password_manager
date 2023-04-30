const { contextBridge } = require('electron')

let h2 = '<h2>This is my second header</h2>'

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,

    myVar: h2
})
