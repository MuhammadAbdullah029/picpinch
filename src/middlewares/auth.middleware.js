const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { access_secret } = require("../config/config");

const protected = async (req, res, next) => {
  try {
    let token;

    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    } else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      req.flash("error_msg", "Please log in to access this page.");
      return res.redirect("/picpinch/login");
    }

    const decoded = jwt.verify(token, access_secret);

    const user = await User.findById(decoded.id).lean();

    if (!user) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      req.flash("error_msg", "User account no longer exists.");
      return res.redirect("/picpinch/login");
    }

    req.user = user;
    res.locals.user = user;

    next();

  } catch (error) {
    console.error("Error in auth middleware:", error.message);
    
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    if (error.name === "TokenExpiredError") {
      req.flash("error_msg", "Your session has expired. Please log in again.");
    } else {
      req.flash("error_msg", "Invalid session. Please log in again.");
    }

    return res.redirect("/picpinch/login");
  }
};

module.exports = protected;