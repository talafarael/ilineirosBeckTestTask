// const path = require('path');
// const  {multer, FileFilterCallback }=require('multer');
// const { Request }=require('express')
// const cors = require("cors")
// type DestinationCallback = (error: Error | null, destination: string) => void
// type FileNameCallback = (error: Error | null, filename: string) => void
// const storage=multer.diskStorage({
//     destination:( request: Request,
// 					file,
// 					cb: DestinationCallback): void=>{
        
//              cb(null, 'images'); 
          
//     },filename:(req: Request,file, cb: FileNameCallback): void=>{
//         console.log(file)
//         cb(null,Date.now()+path.extname(file.originalname))
//     }
// 			})
// const upload=multer({
//     storage:storage
// })

// module.exports= upload;