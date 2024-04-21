require('dotenv').config()
const nodemailer=require('nodemailer')
interface SendMessageParams {
    emailUser: string;
    num: string;
}
class Emailsend {
     transporter;
    constructor() {
       
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "testfar07@gmail.com",
                pass: "cmkvjfeqkrpqfyfz",
            }
        });
    } 
    
    
async sendmessage({emailUser, num}: SendMessageParams): Promise<void>{
      await this.transporter.sendMail({
        from:"testfar07@gmail.com",
        to:emailUser,
        text:num
    })
    }
}


module.exports=Emailsend
