const jwtSecret = "your_jwt_secret"; // This has to be the same key used in the JWTStrategy

const jwt = require("jsonwebtoken"),
  passport = require("passport");

require("./passport"); // Your local passport file

/**
 * Generates JSON Web Token which expires in 7 days
 * @param {object} user
 * @returns object with user data and JWT
 */

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // This is the username you’re encoding in the JWT
    expiresIn: "7d", // This specifies that the token will expire in 7 days
    algorithm: "HS256", // This is the algorithm used to “sign” or encode the values of the JWT
  });
};

/* POST login. */

/**
 * Post login
 * @description - Post login
 * @param {URL} - /login
 * @param {HTTP} - POST
 * @param {Query_Parameters} - (Username, Password)
 * @param {Request_Body} - JSON object
 * @example
 * // Response data format
 * { 
*   "Username": "UserName12",
 *   "Password": "password12"
 * }

 * @param {Response} - JSON object
 * @example
 * // Response data format
 * {
*   "user": {
*             "_id": "627579a6cb66115f3a177151",
*             "Username": "UserName12",
*             "Password": "password12",
*             "Email": "username12@gmail.com",
*             "Birthday": "1992-04-11T00:00:00.000Z",
*             "FavoriteMovies": [],
*             "__v": 0
*             },
*             "token": "eyJhbGciOiJIUzI1NiI....."
*            }
 * @param {authentication} - Bearer token (local)
 * @callback requestCallback
 * @returns {object} - An object with all the information for the singel user
 */

module.exports = (router) => {
  router.post("/login", (req, res) => {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: "Something is not right",
          user: user,
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
