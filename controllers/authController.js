import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";

const getSignUpForm = (req, res) => {
  res.render("sign-up-form", { errors: [], email: "" });
};

const signUp = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await prisma.user.create({
      data: {
        email: req.body.email,
        password: hashedPassword,
      },
    });
    res.redirect("/log-in");
  } catch (err) {
    next(err);
  }
};

const getLogInForm = (req, res) => {
  res.render("log-in-form", { errors: [], email: "" });
};

const logOut = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/log-in");
  });
};

export { getSignUpForm, signUp, getLogInForm, logOut };