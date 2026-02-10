import nodemailer from "nodemailer";


export async function sendMail(message: string){
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS
        }
    })

    const html = `<h2>Unable to Fetch API!</h2><br>
    <p>An error occurred while running your script</p> <br>
    ${message}
    `;

    await transporter.sendMail({
        from: process.env.USER_EMAIL,
        to: process.env.RECIEVER_EMAIL,
        subject: "API Alert",
        html: html
    });

    console.log("Mail Sent!")
}