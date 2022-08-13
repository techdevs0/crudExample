import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from 'cors';
import userRouter from "./routes/users.js";

const app = express();


app.use(bodyParser.json({ limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true}))
app.use(cors());

app.use('/users', userRouter)

app.get('/', function (req, res) {
    res.send("app is running");
});

const CONNECTION_URL = 'mongodb+srv://root:729711807352a@cluster0.s9eigte.mongodb.net/resorts?retryWrites=true&w=majority';
const port = process.env.port || 3080;

mongoose.connect(CONNECTION_URL, { useNewUrlParser:true})
.then(() => app.listen(port, () => console.log("successful running on port"+port)))
.catch((error) => console.log("error",error.message ));