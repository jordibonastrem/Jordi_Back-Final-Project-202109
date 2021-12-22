import express from "express";

import {
  loginUser,
  signUpUser,
  renewUser,
} from "../controllers/usersControllers";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", signUpUser);
router.get("/renew", renewUser);

export default router;
