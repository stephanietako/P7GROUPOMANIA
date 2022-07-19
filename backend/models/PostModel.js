import { Sequelize } from "sequelize";
import db from "../config/Database.js";
//import Users from "./UserModel.js";

const { DataTypes } = Sequelize;
const Posts = db.define('posts',
    {

        message: {
            type: DataTypes.STRING, required: true, maxlength: 500
        },
        imageUrl: {
            type: DataTypes.STRING, required: true
        },
        // likes: {
        //     type: DataTypes.INTEGER, defaultValue: 0
        // },
        // usersLiked: {
        //     type: DataTypes.ARRAY(DataTypes.STRING)
        // },

    });

//await Posts.sync({ alter: true });
await Posts.sync({ force: true });

// Users.hasMany(Posts, { onDelete: 'CASCADE' });
// Posts.belongsTo(Users);


export default Posts;
