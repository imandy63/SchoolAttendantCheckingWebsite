import express from "express";
import ActivityRouter from "./activity";
import StudentRouter from "./student";
import PostRouter from "./post";

const router = express.Router();

router.use("/api/activity", ActivityRouter);

router.use("/api/student", StudentRouter);

router.use("/api/post", PostRouter);

router.get("/", (req, res) => {
  res.send("Hello World!");
});

export { router };
