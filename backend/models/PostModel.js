import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;
const Posts = db.define('posts',
    {
        userId: {
            type: DataTypes.INTEGER,
        },
        postMessage: {
            type: DataTypes.STRING, required: true, maxlength: 500
        },
        imageUrl: {
            type: DataTypes.STRING, required: true
        },
        likes: {
            type: DataTypes.INTEGER, defaultValue: 0
        },
        usersLiked: {
            //type: DataTypes.ARRAY(DataTypes.STRING)
            // avec mysql on ne peut pas juste utiliser type: DataTypes.ARRAY(DataTypes.STRING) c'est faisable qu'avec postgrl
            type: DataTypes.STRING,
            get: function () {
                return JSON.parse(this.getDataValue('usersLiked'));
            },
            set: function (val) {
                return this.setDataValue('usersLiked', JSON.stringify(val));
            }
        },
    },
    {
    });

//await Posts.sync({ alter: true });
await Posts.sync({ force: true });

// Users.hasMany(Posts, { onDelete: 'CASCADE' });



export default Posts;
