//npm install -g firebase-tools

import bodyParser from "body-parser";
import dotenv from 'dotenv';
import express from "express";
import connectDb from "./database/db.js";
import routerImage from "./routes/Image.js";
import routerLocataire from "./routes/Locataire.js";
import routerProprietaire from "./routes/Proprietaire.js";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())


app.listen(3000, (err) => {
    if (err) {
        console.log(err);
    }
    console.log("server is running on " + process.env.PORT);
})

dotenv.config({ path: './config/.env' })
connectDb();

app.use('/users/locataires', routerLocataire)
app.use('/users/proprietaires', routerProprietaire)
app.use('/', routerImage)


