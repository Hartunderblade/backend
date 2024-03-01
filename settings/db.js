const mysql = require('mysql')
const env = require('./../dbenv')

const connection = mysql.createConnection({
    host: env.HOST,
    user: env.DBUSER,
    password: env.DBPASSWORD,
    database: env.DBNAME
})

connection.connect((error) => {
    if(error){
        return console.log('Ошибка в подключении БД');
    }
    else{
        return console.log('Подключено успешно');
    }
})

module.exports = connection