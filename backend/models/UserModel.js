import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import Posts from './PostModel.js';

const { DataTypes } = Sequelize;

const Users = db.define(
  'users',

  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { message: 'User must have firstName' },
        notEmpty: { message: 'firstName must not be empty' },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { message: 'User must have lastName' },
        notEmpty: { message: 'lastName must not be empty' },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { message: 'User must have a email' },
        notEmpty: { message: 'email must not be empty' },
        isEmail: { message: 'Must be a valid email adress' },
      },
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue: 'avatar-defaultProfil.jpg',
    },
    role: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
    password: { type: DataTypes.STRING, allowNull: false },
    bio: {
      type: DataTypes.STRING,
      efaultValue:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam impedit aliquam consequuntur odio amet eum accusamus explicabo corporis, est magni. ',
    },
    refresh_token: { type: DataTypes.TEXT },
  }
);

Users.hasMany(Posts, { foreignKey: 'userId', onDelete: 'CASCADE' });
Posts.belongsTo(Users, { foreignKey: 'userId' });

await Users.sync({ alter: true });

export default Users;
