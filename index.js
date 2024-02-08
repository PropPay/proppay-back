//npm install -g firebase-tools

import bodyParser from "body-parser";
import dotenv from 'dotenv';
import express from "express";
import connectDb from "./database/db.js";
import routerNotification from "./routes/Notification.js";
import { default as routerLandlord, default as routerTenant } from "./routes/Proprietaire.js";
import routerPropriety from "./routes/Propriete.js";

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

app.use('/users/tenants', routerTenant)
app.use('/users/landlords', routerLandlord)
app.use('/proprieties', routerPropriety)
app.use('/notifications', routerNotification)


