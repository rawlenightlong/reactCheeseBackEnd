const express = require('express')
const app = express()
const dotenv = require('dotenv').config()
const PORT = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require("morgan")

////////////////
// Middleware
////////////////
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////

// Establish Connection

mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
mongoose.set('strictQuery', false);

// Connection Events
mongoose.connection
  .on("open", () => console.log("You are connected to mongoose"))
  .on("close", () => console.log("You are disconnected from mongoose"))
  .on("error", (error) => console.log(error));

const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String
  })

const Cheeses = mongoose.model("Cheeses", CheeseSchema)

//GET ROUTE
app.get('/', (req, res) => {
    res.send(`App is running!`)
})


// INDEX ROUTE
app.get('/cheeses', async (req, res) => {
    try{
        res.json(await Cheeses.find({}))
    }catch(error){
        res.status(400).json(error)
    }
})


// CREATE ROUTE
app.post('/cheeses', async (req, res) => {
    try{
        res.json(await Cheeses.create(req.body))
    }
    catch(error){
        res.status(400).json(error)
    }
})


// UPDATE ROUTE
app.put('/cheeses/:id', async (req, res) => {
    try{
        res.json(await Cheeses.findByIdAndUpdate(req.params.id, req.body, {new: true}))
    }
    catch(error){
        res.status(400).json(error)
    }
})

// DELETE ROUTE
app.delete("cheeses/:id", async (req, res) => {
    try{
        res.json(await Cheeses.findByIdAndRemove(req.params.id))
    }
    catch(error){
        res.status(400).json(error)
    }
})

// SHOW ROUTE
app.get('/cheeses/:id', async (req, res) => {
    try{
        res.json(await Cheeses.findById(req.params.id))
    }
    catch(error){
        res.status(400).json(error)
    }
})

app.listen(PORT, () => {
    console.log(`Hey there, Delilah, what's it like in Port ${PORT}`)
})