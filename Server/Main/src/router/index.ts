import express from "express";
import ActivityRouter from "./activity";
import StudentRouter from "./student";
import PostRouter from "./post";
import TrackingRouter from "./tracking";
import UnionWorkerRouter from "./union-worker";

const router = express.Router();

router.use("/api/activity", ActivityRouter);

router.use("/api/student", StudentRouter);

router.use("/api/post", PostRouter);

router.use("/api/tracking", TrackingRouter);

router.use("/api/union-worker", UnionWorkerRouter);

router.get("/", (req, res) => {
  res.send("Hello World!");
});

export { router };
