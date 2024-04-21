require('dotenv').config()
const nodemailer=require('nodemailer')
interface SendMessageParams {
    emailUser: string;
    password: string;
}
class passwordSendDelete {
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
    
    
async sendmessage({emailUser, password}: SendMessageParams): Promise<void>{
      await this.transporter.sendMail({
        from:"testfar07@gmail.com",
        to:emailUser,
        text:password
    })
    }
}

module.exports=passwordSendDelete