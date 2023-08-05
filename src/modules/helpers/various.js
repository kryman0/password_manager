function transformArrayObjsIntoMap(arr) {
    let map = new Map()

    for (const obj of arr) {
        map.set(obj.key, obj.value)
    }

    return map
}


exports.various = {
    transformIntoMap: transformArrayObjsIntoMap,
}

