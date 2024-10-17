import express, { urlencoded } from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

export { app };
