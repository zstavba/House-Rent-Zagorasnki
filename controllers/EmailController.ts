import sendmail from 'sendmail';
import nodemailer from 'nodemailer';
class EmailController {

    home = (req: any, res: any, next : any) => {

    }

    recive = (req: any, res: any, next : any) => {
        res.render("dashboard/emails/recive");
    }

    send = async (req:any, res:any, next: any) => {
        try {
            let data: any = req.body;

            let testAccount = await nodemailer.createTestAccount();
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                  user: "houserentzagoranski@gmail.com", // generated ethereal user
                  pass: "Zagoranskilaura@123", // generated ethereal password
                },
              });

              let info = await transporter.sendMail({
                from: data.email, // sender address
                to: "houserentzagoranski@gmail.com", // list of receivers
                subject:data.subject, // Subject line
                html: data.mail_text, // html body
              });
              console.log(info);

            res.status(200).json({
                message: info.messageId
            });

        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    }



}


export default EmailController;