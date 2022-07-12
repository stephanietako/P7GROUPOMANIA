import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import userRouter from "./routes/userRoute.js";

dotenv.config();

const app = express();
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(cookieParser());
app.use(express.json());
//
app.use(express.urlencoded({ extended: true }));

//
/* Mise en place reponses headers */
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, x-access-token, role, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});
// 
/* Securite en tete */
app.use(helmet());
//

/* RateLimiter */
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message:
            "Vous avez effectué plus de 100 requêtes dans une limite de 15 minutes!",
        headers: true,
    })
);


// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to groupomania application." });
});
//
// toutes les routes auront un lien avec le user
app.use("/users", userRouter);


app.use(express.static('public'));

// le port de mon aplli
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}. Enjoy !`);
});



