import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"

interface User {
  email: string;
  password?: string;
  emailType: string | number;
  userId: string | number;
  resetLink?:string | number;
}

export const sendEmail = async ({ email, emailType, userId }: User) => {
  try {
    // Hashed token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);
    const user =await User.findOne({email});
    const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET!, { expiresIn: "1h" });
    console.log("Email working Properly",token);
    
    const updateFields =
      emailType === "VERIFY"
        ? { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000 }
        : { forgotPasswordToken: token, forgotPasswordTokenExpiry: Date.now() + 3600000 };

    await User.findByIdAndUpdate(userId, updateFields);

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "06f282ee18116f",
        pass: "b5c5d5a586f192",
      },
    });

    const emailSubject = emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password";
    const emailLink = `${process.env.DOMAIN}/${emailType === "VERIFY" ? "verifyemail" : "resetpassword"}?token=${emailType === "VERIFY" ? hashedToken : token}`;
    const emailContent = `
      <p>Click <a href="${emailLink}">here</a>
         to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
         or copy and paste the link below in your browser.<br>
         ${emailLink}
      </p>
    `;

    const mailOptions = {
      from: "gupta.ashish2694@gmail.com",
      to: email,
      subject: emailSubject,
      html: emailContent,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

// export const resetEmail = async ({ email, emailType, resetLink }: User) => {
//   try {
//     // Hashed token
//     // const hashedToken = await bcryptjs.hash(userId.toString(), 10);
//     // const updateFields =
//     //   emailType === "VERIFY"
//     //     ? { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000 }
//     //     : { forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000 };

//     // await User.findByIdAndUpdate(userId, updateFields);


//     const transporter = nodemailer.createTransport({
//       host: "sandbox.smtp.mailtrap.io",
//       port: 2525,
//       auth: {
//         user: "06f282ee18116f",
//         pass: "b5c5d5a586f192",
//       },
//     });



//     // const emailSubject = emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password";
//     // const emailLink = `${process.env.DOMAIN}/${emailType === "VERIFY" ? "verifyemail" : "resetpassword"}?token=${hashedToken}`;
//     // const emailContent = `
//     //   <p>Click <a href="${emailLink}">here</a>
//     //      to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
//     //      or copy and paste the link below in your browser.<br>
//     //      ${emailLink}
//     //   </p>
//     // `;

//     // const mailOptions = {
//     //   from: "gupta.ashish2694@gmail.com",
//     //   to: email,
//     //   subject: emailSubject,
//     //   html: emailContent,
//     // };

//     // const mailResponse = await transporter.sendMail(mailOptions);
//     // return mailResponse;
//   } catch (err: any) {
//     throw new Error(err.message);
//   }
// };
