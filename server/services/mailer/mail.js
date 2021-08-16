const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    // host: 'smtp.gmail.com',
    // port: 587,
    // ignoreTLS: false,
    // secure: false,
    service: 'gmail',
    auth: {
        user: 'hello@fatoura.work',
        pass: 'ihtiraf21@FATOURA'
    },
    from:'hello@fatoura.work'
});

exports.sendmail = async (data, html) => {
    console.log('data in sendMail', data);
    return new Promise((resolve, reject) => {
        try {
            var mailOptions = {
                from:'hello@fatoura.work',
                to: data.email,
                subject: data.subject,
                html: html
            };

            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                    return reject(error);
                } else {
                    console.log(`Email sent: ${info.response}`);
                    return resolve(info);
                }
            });
        } catch (error) {
            return reject(error);
        }
    });
}

// exports.sendAttachmentMail=async (user, files) => {
//     return new Promise((resolve, reject) => {
//         try {
//             const attachments = files.map((file)=>{
//                 return { filename: file.name, path: file.path };
//             });
//             var mailOptions = {
//                 to: user.email,
//                 subject: user.subject,
//                 text:user.text,
//                 attachments:attachments           
                
//             };

//             transporter.sendMail(mailOptions, function(error, info) {
//                 if (error) {
//                     console.log(error);
//                     return reject(error);
//                 } else {
//                     console.log(`Email sent: ${info.response}`);
//                     return resolve(info);
//                 }
//             });
//         } catch (error) {
//             return reject(error);
//         }
//     });
// }
