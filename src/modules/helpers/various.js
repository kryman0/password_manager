function transformToMap(obj) {
    let map = new Map(), key, value


    for (const property of obj) {
        let i = 1;

        for (const p of property) {
            key = prop[p] // use key and value of object's properties
            map.set(key)

            if (i === 2) {
                map.set(prop[p])
            } else {
                map.set()
            }
        }
    }
}
