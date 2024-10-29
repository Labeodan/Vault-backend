const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const MongoStore = require("connect-mongo");
const methodOverride = require('method-override')
const path = require('path');
const authRouter = require("./controllers/auth")
const categoriesRouter = require("./controllers/categories")
const transactionRouter = require("./controllers/transactions")






require('dotenv/config')

// ! -- Variables
const app = express()
const port = 3000


// ! -- Middleware
app.use(express.json());
app.use(morgan('dev'));




app.get('/', (req, res) => {
    res.send("Index view.")
});


//Controller
app.use("/auth", authRouter)
app.use("/category", categoriesRouter)
app.use("/transactions", transactionRouter)

// Start the Express server
const startServers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connection established");

        app.listen(port, () => {
            console.log(`🚀 Express api lab on ${port}`)
        })

    } catch (error) {
        console.log(error);
    }
}
startServers();