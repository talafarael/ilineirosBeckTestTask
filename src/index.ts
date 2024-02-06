const express=require('express')
const mongoose =require( "mongoose")

const app = express()
const PORT = process.env.PORT || 3000
const authRouter=require('./authRouter')
app.use(express.json())
app.use('/auth',authRouter)



app.use(express.static('public'));
const start = async () => {
	try {
	
		await mongoose.connect("mongodb+srv://artemk2504:farashiner@cluster0.1pp5frh.mongodb.net/")
		app.listen(PORT, () => {
			console.log("server run"+PORT )
		})
	} catch (e) {
		console.error("Server start error:", e)
	}
}
start()
