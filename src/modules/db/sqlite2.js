
//let setupDbFile = fs.readFileSync(path.resolve('sql/setup.sqlite'), 'utf8')
//console.log(setupDbFile)


function insertPassword(passwd) {
    const sql = `insert into passwords (\
        title,\
        username,\
        password,\
        url,\
        description,\
        user_email) values (\
        $title,\
        $username,\
        $password,\
        $url,\
        $descr,\
        $user_email);`

    const params = { 
        $title: passwd.title, 
        $username: passwd.username, 
        $password: passwd.password,
        $url: passwd.url, 
        $descr: passwd.description, 
        $user_email: passwd.userEmail 
    }
    
    try {
        //runQuery(sql, params, crud.insert)
        db.prepare(sql)
    } catch (ex) {
        dbTransactionError(err, crud.insert)
    }

    return getCrudActionMsg('insert password', passwd.title)
}

exports.db = db

