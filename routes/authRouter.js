import { Router } from "express";
import passport from "passport";
import { validationResult } from "express-validator";
import { signUpValidator, logInValidator } from "../middleware/validator.js";
import {
  getSignUpForm,
  signUp,
  getLogInForm,
  logOut,
} from "../controllers/authController.js";

const router = Router();

router.get("/sign-up", getSignUpForm);

router.post(
  "/sign-up",
  signUpValidator,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("sign-up-form", {
        errors: errors.array(),
        email: req.body.email,
      });
    }
    next();
  },
  signUp,
);

router.get("/log-in", getLogInForm);

router.post(
  "/log-in",
  logInValidator,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("log-in-form", {
        errors: errors.array(),
        email: req.body.email,
      });
    }
    next();
  },
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
  }),
);

router.get("/log-out", logOut);

export default router;