import { Sequelize } from "sequelize";

// const db = new Sequelize('groupomania_db', 'root', '', {
//     host: "localhost",
//     dialect: "mysql",
// });

// (async () => { await db.sync(); })();
// export default db;


const db = new Sequelize('groupomania_db', 'tako', 'tako22', {
    host: 'localhost',
    dialect: 'mysql',
    port: 8889

});

try {
    await db.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

export default db;
// test1
// const db = mysql.createPool({
//     connectionLimit: 10,
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'groupomania_db'

// });

//Get all users
// app.get('', (req, res) => {
//     db.getConnection((err, connection) => {
//         if (err) throw err
//         console.log('connected as id ' + connection.threadId)
//         connection.query('SELECT * FROM `users`', (err, rows) => {
//             connection.release() // return the connection to db

//             if (!err) {
//                 res.send(rows)
//             } else {
//                 console.log(err)
//             }

//             // if(err) throw err
//             console.log('The data from user table are: \n', rows)
//         })
//     })
// })
//fin du test
