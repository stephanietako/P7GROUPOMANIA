import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config()

const db = new Sequelize(process.env.DATABASE_ACCESS_NAME, process.env.DATABASE_ACCESS_USER, process.env.DATABASE_ACCESS_PASSWORD,
    {
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
