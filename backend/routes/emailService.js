const  nodemailer=require('nodemailer');
const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
     user:'blaish1097@gmail.com',
     pass:'vrelesxqjqydcvpq' ,  
    },
});


const sendShortlistEmail=(recipientEmail, fullName, degree)=>{
    const mailOptions={
        from:'blaish1097@gmail.com',
        to:recipientEmail,
        subject:'Congratulations! You are Shortlisted',
        html:`
        <p>Dear <strong>${fullName}</strong>,</p>

      <p>We are pleased to inform you that your application for the <strong>${degree}</strong> program has been <strong>shortlisted</strong>.</p>

      <p>For further details and to understand the fee structure, we kindly request you to visit our college in person at your earliest convenience.</p>

      <p>We look forward to welcoming you to our campus.</p>

<br />
<p>Best Regards,<br />
<strong>Admissions Office</strong><br />
CrownRidge Arts & Science College </p> `,
}
    return transporter.sendMail(mailOptions);
}

module.exports={sendShortlistEmail}