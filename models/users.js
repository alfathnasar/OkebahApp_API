const dbPool = require('../config/database.js');

const getUsers = (username) => {
    const sqlQuery = `SELECT *from pengguna where username = '${username}'`;
    return dbPool.execute(sqlQuery);
}


const createNewUser = (body) => {
    const sqlQuery = `INSERT INTO pengguna (username, password, nama, nohp, email, token) 
                    values ('${body.username}', '${body.password}', '${body.nama}', '${body.nohp}', '${body.email}', '${body.token}')`;
    return dbPool.execute(sqlQuery);    
}

//OKE
const updateUser = (body, email) => {
    const sqlQuery = `UPDATE pengguna SET nama='${body.nama}', nohp='${body.nohp}' where email ='${email}'`;
    return dbPool.execute(sqlQuery);
}

const updateUserToken = (username, token) => {
    const sqlQuery = `UPDATE pengguna SET token ='${token}' where username ='${username}'`;
    return dbPool.execute(sqlQuery);
}

const updateUserPass = (username, password) => {
    const sqlQuery = `UPDATE pengguna SET password ='${password}' where username ='${username}'`;
    return dbPool.execute(sqlQuery);
}

const deleteUser = (username) => {
    const sqlQuery = `DELETE FROM pengguna where username = '${username}'`;
    return dbPool.execute(sqlQuery);
}

module.exports = {
    getUsers,
    createNewUser,
    updateUser,
    updateUserToken,
    deleteUser,
    updateUserPass
}