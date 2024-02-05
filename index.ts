const express=require('express')
const mongoose =require( "mongoose")
const app = express()
const PORT = process.env.PORT || 3000


// app.use('/auth',authRouter)

const mongoURI = process.env.MONGO;
app.use(express.json())
const start = async () => {
	try {
		// await mongoose.connect(mongoURI!)
		app.listen(PORT, () => {
			console.log("server run")
		})
	} catch (e) {
		console.error("Server start error:", e)
	}
}
start()
