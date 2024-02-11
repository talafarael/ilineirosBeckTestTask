const express=require('express')
const mongoose =require( "mongoose")
const path = require('path');
const app = express()
const cors = require("cors");
const PORT = process.env.PORT || 6000
const authRouter=require('./authRouter')
app.use(express.json())
const multer = require('multer');
const upload = multer();

app.use(cors({
	origin: true,
	credentials: true
}));
app.use(upload.none());


app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname,'ejs'));

app.use(express.static('public'));

app.use('/auth',authRouter)
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
