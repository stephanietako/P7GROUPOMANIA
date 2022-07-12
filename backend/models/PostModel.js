import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Posts = db.define('Posts',
    {
        postMsg: { type: DataTypes.STRING, allowNull: false },
        // postImg: { type: DataTypes.STRING, allowNull: true },
    }
);

export default Posts;