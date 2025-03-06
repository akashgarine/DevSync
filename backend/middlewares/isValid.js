import pkg from "jsonwebtoken";
const { verify } = pkg;

const isValid = (req, res, next) => {
  const { token } = req.headers;
  const foundUser = verify(token, process.env.JWT_SECRET).userId;
  if (!foundUser) {
    res.status(400).json({
      message: "No user with token",
    });
  } else {
    req.userId = foundUser;
    next();
  }
};
export { isValid };
