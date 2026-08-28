import { body } from "express-validator";

const signUpValidator = [
  body("email").trim().isEmail().withMessage("A valid email is required."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters."),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) throw new Error("Passwords do not match.");
    return true;
  }),
];

const logInValidator = [
  body("email").trim().isEmail().withMessage("A valid email is required."),
  body("password").notEmpty().withMessage("Password is required."),
];

export { signUpValidator, logInValidator };