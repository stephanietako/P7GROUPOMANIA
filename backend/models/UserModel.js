import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Posts from "./PostModel.js";

const { DataTypes } = Sequelize;
// define je crée une table
const Users = db.define('users',

    {
        firstName: { type: DataTypes.STRING, allowNull: false },
        lastName: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        //userImg: { type: DataTypes.STRING, allowNull: true },
        isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
        password: { type: DataTypes.STRING, allowNull: false },
        refresh_token: { type: DataTypes.TEXT }
    }

);
// de base ça créer la table users si elle n'exsiste pas - ça check mais ça fait rien
//await Users.sync();
// alter check si les champs existent déjà et les changes si necéssaire
await Users.sync({ alter: true });

// Users.hasMany(Posts, { onDelete: 'CASCADE' });
// Posts.belongsTo(Users);

export default Users;


// Babel est un transcompilateur qui peut convertir plusieurs types de code différents dans du JavaScript. Il gère entre autres le langage TypeScript. Babel détecte si un module supporte la directive "import" 