const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const helmet = require('helmet')
const mongoose = require('mongoose')

const userRouter = require('./router/user/user')
const authRouter = require('./router/auth/auth')

const port = 3000
const app = express()

dotenv.config()

mongoose.connect(process.env.DB_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('db connected')
});

//middleware
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))


app.use("/api/user", userRouter)
app.use("/api/auth", authRouter)

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})