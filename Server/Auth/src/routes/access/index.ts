import { asyncHandler } from "../../helpers/asyncHandler";
import AccessController from "../../controllers/access.controller";
import express from "express";

const router = express.Router();

router.post("/refreshtoken", asyncHandler(AccessController.handleRefreshToken));
router.post("/authenticate", asyncHandler(AccessController.authentication));

router.post("/login", asyncHandler(AccessController.login));
router.post("/signup", asyncHandler(AccessController.signup));

export default router;
