import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Posts from "./PostModel.js";

const { DataTypes } = Sequelize;
// define je crée une table

const Users = db.define('users',
    {
        firstName: { type: DataTypes.STRING },
        lastName: { type: DataTypes.STRING },
        email: { type: DataTypes.STRING, allowNull: false },
        avatar: { type: DataTypes.STRING, defaultValue: "https://img.myloview.fr/papiers-peints/humain-homme-personne-avatar-profil-utilisateur-vector-icon-illustration-700-80657983.jpg" },
        role: { type: DataTypes.BOOLEAN, defaultValue: 0 },
        password: { type: DataTypes.STRING, allowNull: false },
        bio: {
            type: DataTypes.STRING,
            defaultValue:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam impedit aliquam consequuntur odio amet eum accusamus explicabo corporis, est magni. ",
        },
        refresh_token: { type: DataTypes.TEXT }
    }
);



// de base ça créer la table users si elle n'exsiste pas - ça check mais ça fait rien
//await Users.sync();
// alter check si les champs existent déjà et les changes si necéssaire
//await Users.sync({ alter: true });

Users.hasMany(Posts, { foreignKey: 'userId', onDelete: 'CASCADE' })
Posts.belongsTo(Users, { foreignKey: 'userId' });
// Likes.belongsTo(Users, { foreignKey: 'messageId', as: 'messageId' });
// Likes.belongsTo(Users, { foreignKey: 'userId', as: 'users' });
await Users.sync({ alter: true });

export default Users;



