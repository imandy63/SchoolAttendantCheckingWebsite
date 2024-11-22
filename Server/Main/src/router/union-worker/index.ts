import express from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { authentication } from "../../auth/authentication";
import UnionWorkerController from "../../controllers/unionWorker.controller";

const router = express.Router();

router.use(asyncHandler(authentication));
// router.use(asyncHandler())

router.get("", asyncHandler(UnionWorkerController.getUnionWorkers));

router.post("", asyncHandler(UnionWorkerController.createUnionWorker));

router.put(
  "/:id/disable",
  asyncHandler(UnionWorkerController.disableUnionWorker)
);

router.put(
  "/:id/enable",
  asyncHandler(UnionWorkerController.enableUnionWorker)
);

router.put(
  "/:id/reset-password",
  asyncHandler(UnionWorkerController.resetUnionWorkerPassword)
);

export default router;
