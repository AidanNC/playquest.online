import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	  user: process.env.EMAIL_USER,
	  pass: process.env.EMAIL_PASS
	}
  });

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"PlayQuest.Online" <${process.env.EMAIL_USER}>`, // sender address
    to: "aidan@hapidot.com", // list of receivers
    subject: "playquest.online", // Subject line
    text: "Test Message", // plain text body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

main().catch(console.error);