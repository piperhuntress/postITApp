import jwt from "jsonwebtoken";
//const { sign, verify } = require("jsonwebtoken");

export const createTokens = (user) => {
  const accessToken = jwt.sign(
    { username: user.username, id: user.id },
    "jwtsecretplschange"
  );

  return accessToken;
};

export const validateToken = (req, res, next) => {
  const accessToken = req.cookies["access-token"];

  if (!accessToken)
    return res.status(400).json({ error: "User not Authenticated!" });

  try {
    const validToken = jwt.verify(accessToken, "jwtsecretplschange");
    if (validToken) {
      req.authenticated = true;
      return next();
    }
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

//module.exports = { createTokens, validateToken };
