const express=require('express')
const mongoose =require( "mongoose")
const path = require('path');
const app = express()
const cors = require("cors");
const PORT = process.env.PORT || 3000
const authRouter=require('./authRouter')
app.use(express.json())

app.use(cors({
	origin: true,
	credentials: true
}));
app.use('/auth',authRouter)


app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname,'ejs'));

app.use(express.static('public'));
const start = async () => {
	try {
	
		await mongoose.connect("mongodb+srv://artemk2504:farashiner@cluster0.1pp5frh.mongodb.net/")

		app.get('/', (req: any, res: any) => {
			res.render('index');
})
		app.listen(PORT, () => {
			console.log("server run"+PORT )
		})
	} catch (e) {
		console.error("Server start error:", e)
	}
}
start()
