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

