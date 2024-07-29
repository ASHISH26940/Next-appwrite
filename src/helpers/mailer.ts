//domain.com/verifytoken/ajkfsfjskfjaj  for server side
//domain.com/verifytoke?token=ksjbkdjbf for client side
//makes life easier

import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

interface User {
  email: string;
  password?: string;
  emailType: string | number;
  userId: String | number;
}

export const sendEmail = async ({ email, emailType, userId }: User) => {
  try {
    //hashed token
    const hasedToken = await bcryptjs.hash(userId.toString(), 10);
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hasedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hasedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "06f282ee18116f",
        pass: "b5c5d5a586f192",
      },
    });
    const mailOptions = {
      from: "gupta.ashish2694@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "VERIFY your email" : "Reset your Password",
        html:`<p>Click <a href="${process.env.DOMAIN!}/verifyemail?token=${hasedToken}">here</a>
        to ${emailType==="VERIFY"?"verify your email":"reset your password"}
            or copy and paste the link below in your browser . <br> ${process.env.DOMAIN!}/verifyemail?token=${hasedToken}
        </p>`
    };

    const mailresponse=await transport.sendMail(mailOptions);
    return mailresponse;
  } catch (err: any) {
    throw new Error(err.message);
  }
};
