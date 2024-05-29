const express = require("express");
const {register, login, followuser, logout, changePassword, updateProfile, deleteProfile, myAccount, userAccount, allUserAccount} = require("../controllers/user");
const {isAuthenticated} = require("../wares/authentication");

const router = express.Router();

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/logout").get(logout);

router.route("/follow/:id").get(isAuthenticated, followuser);

router.route("/update/password").put(isAuthenticated, changePassword);

router.route("/update/profile").put(isAuthenticated , updateProfile);

router.route("/delete/account").delete(isAuthenticated, deleteProfile);

router.route("/profile").get(isAuthenticated,myAccount );

router.route("/user/:id").get(isAuthenticated, userAccount );

router.route("/users").get(isAuthenticated, allUserAccount );

module.exports = router;