const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    // host: 'smtp.gmail.com',
    // port: 587,
    // ignoreTLS: false,
    // secure: false,
    service: 'gmail',
    auth: {
        user: 'noreply@fatoura.work',
        pass: 'ihtiraf21@FATOURA_1'
    },
    from:'hello@fatoura.work'
});

exports.sendmail = async (data, html) => {
    console.log('data in sendMail', data);
    return new Promise((resolve, reject) => {
        try {
            var mailOptions = {
                from:'noreply@fatoura.work',
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

exports.sendAttachmentMail=async (user, files,email) => {
    return new Promise((resolve, reject) => {
        try {
            const attachments = files.map((file)=>{
                return { filename: file.name, path: file.path };
            });
            var mailOptions = {
                to: user.email,
                subject: user.subject,
                text:user.text,
                cc:email,       
                attachments:attachments, 
                html: `<html>
                            <body>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div style = 'margin-bottom: 40px'>${user.text}</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>This email has been sent on behalf of ${user.companyName} using <a href=https://fatoura.work>fatoura.work</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </body>
                        </html>`
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
