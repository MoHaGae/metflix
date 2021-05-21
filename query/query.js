module.exports = {
    USER: {
        INSERT: `INSERT 
                    INTO user(user_id, user_password, user_nickname, user_type) 
                    VALUES(?, ?, ?, ?)`
        , SELECT_BY_ID: `SELECT user_id AS id
                            , user_password AS password
                            , user_nickname AS nickname
                        FROM user WHERE user_id = ?`
    }
    , FILE: {
        INSERT: `INSERT
                    INTO file(file_ext, file_url, file_type, file_status)
                    VALUES(?,?,?,?)`
    }
}