import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Posts from "./PostModel.js";
//import Users from "./UserModel.js";

const { DataTypes } = Sequelize;
// define je crée une table

const Users = db.define('users',
    {
        firstName: { type: DataTypes.STRING, allowNull: true },
        lastName: { type: DataTypes.STRING, allowNull: true },
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
await Users.sync({ force: true });

Users.hasMany(Posts, { onDelete: 'CASCADE' });
Posts.belongsTo(Users);

export default Users;


