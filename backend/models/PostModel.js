import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

const { DataTypes } = Sequelize;
const Posts = db.define(
  'posts',
  {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    postMessage: {
      type: DataTypes.STRING,
      required: true,
      maxlength: 500,
    },
    imageUrl: {
      type: DataTypes.STRING,
      required: true,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    usersLiked: {
      type: DataTypes.STRING,
      defaultValue: '[]',
      get: function () {
        return JSON.parse(this.getDataValue('usersLiked'));
      },
      set: function (val) {
        return this.setDataValue('usersLiked', JSON.stringify(val));
      },
    },
  },
  {}
);

await Posts.sync({ alter: true });

export default Posts;
