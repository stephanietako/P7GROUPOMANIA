import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import Posts from './PostModel.js';

const { DataTypes } = Sequelize;
// define je crée une table

const Users = db.define(
  'users',

  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'User must have firstName' },
        notEmpty: { msg: 'firstName must not be empty' },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'User must have lastName' },
        notEmpty: { msg: 'lastName must not be empty' },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'User must have a email' },
        notEmpty: { msg: 'email must not be empty' },
        isEmail: { msg: 'Must be a valid email adress' },
      },
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue: './../client/public/uplods/profil/default-profil.jpg',
    },
    role: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
    password: { type: DataTypes.STRING, allowNull: false },
    bio: {
      type: DataTypes.STRING,
      defaultValue:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam impedit aliquam consequuntur odio amet eum accusamus explicabo corporis, est magni. ',
    },
    refresh_token: { type: DataTypes.TEXT },
  }
);

// de base ça créer la table users si elle n'exsiste pas - ça check mais ça fait rien
//await Users.sync();
// alter check si les champs existent déjà et les changes si necéssaire
//await Users.sync({ alter: true });

Users.hasMany(Posts, { foreignKey: 'userId', onDelete: 'CASCADE' });
Posts.belongsTo(Users, { foreignKey: 'userId' });

// Likes.belongsTo(Users, { foreignKey: 'userId'});
//Post.hasMany(posts, { foreignKey: 'userId'});
await Users.sync({ alter: true });

export default Users;
