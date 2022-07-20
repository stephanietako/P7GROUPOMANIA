import { Sequelize } from "sequelize";

const db = new Sequelize('groupomania_db', process.env.DB_ACCESS_NAME, process.env.DB_ACCESS_PSWD, {
    host: 'localhost',
    dialect: 'mysql',
    port: 8889,
});

try {
    await db.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

export default db;
