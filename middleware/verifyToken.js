const jwt = require("jsonwebtoken")
const User = require("../models/user")

const verifyToken = async (req, res, next) => {
    try {
        // get token from headers
        const token = req.headers.authorization?.split(" ")[1]

        // check if the token is present
        if (!token) {
            throw new Error("Token not present in Authorization Header")
        }

        // verify the token with jwt.verify()
        const payload = jwt.verify(token, process.env.JWT_SECRET)

        // check if the user._id from the payload is in the DB 
        const user = await User.findById(payload._id)

        // if the user does not exist, throw an error
        if (!user) {
            throw new Error("User does not exist")
        }

        // add the user to the req obj
        req.user = user

        // run next middleware
        next()
    } catch (error) {
    console.log(error)
    return res.status(401).json({ error: 'Unauthorized' })
    }
}

module.exports = verifyToken