const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const app = express()
const cors = require("cors")
const PORT = 9000
const authRouter = require("./authRouter")
app.use(express.json())
const multer = require("multer")
const upload = multer()
const swaggerSpecs = require('./swaggerDOC');

const swaggerUi = require('swagger-ui-express');
app.use(cors({
	origin: true,
	credentials: true
}));
const bodyParser = require("body-parser")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.set("view engine", "ejs")
app.set("views", path.resolve(__dirname, "ejs"))

app.use(express.static("public"))

app.use("/api", authRouter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
const start = async () => {
	try {
		await mongoose.connect(
			"mongodb+srv://artemk2504:farashiner@cluster0.1pp5frh.mongodb.net/"
		)

		app.get('/', (req, res) => {
			res.send('Hello World!');
	});
		app.listen(PORT, () => {
			console.log("server run" + PORT)
		})
	} catch (e) {
		console.error("Server start error:", e)
	}
}
start()
