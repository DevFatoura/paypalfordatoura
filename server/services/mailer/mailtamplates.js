import sendMail from './mail';
import sendInvoiceMail from './invoiceMail';


exports.sendPaymentLink = async(data) => {
    console.log('data in sendPayment', data);
    return new Promise( async(resolve, reject) => {
        try{
            // var html = `<center><h2>Fatoura Mail</h2>
            //            <br>
            //            <a href="${data.url}" target="_blank">Click to open payment link</a>
            //            </center>`;
            var html = `<!DOCTYPE html>
            <html>
               <head>
                  <title></title>
                  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                  <link rel="preconnect" href="https://fonts.gstatic.com">
                  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap" rel="stylesheet">
               </head>
               <body>
                  <table border="0" cellspacing="0" cellpadding="0" style="min-width: 320px; margin: 0 auto;">
                     <tr>
                        <td align="center" >
                           <table border="0" cellspacing="0" cellpadding="0" class="table_width_100" style="max-width: 580px;">
                              <tr>
                                 <td align="center" bgcolor="#ffffff">
                                    <table width="90%" border="0" cellspacing="0" cellpadding="0">
                                       <tr>
                                          <td align="left">
                                             <table style="width: 100%;">
                                                <tr>
                                                   <td align="left" valign="top" class="mob_center">
                                                      <a href="#" target="_blank" style="color: #596167; font-size: 13px;">
                                                      <img src="https://www.braininventory.com/fatoura/Fatoura-Logo-Dark.png" style="width: 120px; margin-top: 5px;" /></a>
                                                   </td>
                                                   <td style="float: right;">
                                                      <p style="
                                                         text-align: right;
                                                         font-family: 'Montserrat', sans-serif;
                                                         font-weight: 600;
                                                         color: #3a3a3a;
                                                         word-break: break-all;
                                                         font-size: 13px;">Create Invoices Online <br> and Get Paid Faster</p>
                                                   </td>
                                                </tr>
                                             </table>
                                          </td>
                                       </tr>
                                    </table>
                                 </td>
                              </tr>
                              <!--header END-->
                              <!--content 1 -->
                              <tr>
                                 <td align="center" >
                                    <table width="90%" border="0" cellspacing="0" cellpadding="0">
                                       <tbody style="background-image: url('https://www.braininventory.com/images/blo-background.png');background-size: cover;">
                                       <tr>
                                          <td align="center">
                                             <!-- padding -->
                                             <div style="height: 20px; line-height: 60px; font-size: 10px;"> </div>
                                             <div style="line-height: 44px;">
                                                <p style="line-height: 1.5;
                                                color: #000000;
                                                font-size: 0.9rem;
                                                font-family: 'Montserrat', sans-serif;
                                                font-style: normal;
                                                padding-bottom: 0;
                                                margin-bottom: 0;
                                                text-align: left;">Hello,<br /><br />You have received an invoice payment link. Please pay the due amount by the due date by clicking on the Pay Invoice Button.<br /><br />Regards, <br> <a href="https://fatoura.work">Fatoura.work</a></p>
                                                </p>
                                                <button style="background: #0C4D71;height: 50px;margin: 35px 0;width: 350px;
                                                   border-radius: 10px;
                                                   border: none;"><a href="${data.url}" style="text-decoration: none; display: block; font-family: 'Montserrat', sans-serif;
                                                   color: #fff;
                                                   font-size: 1rem;">Pay Invoice</a></button>
                                                <p>Please use the below link if the above button does not work</p>
                                                <span>${data.url}</span>
                                             </div>
                                          </td>
                                       </tr>
                                    </tbody>
                                    </table>
                                 </td>
                              </tr>
                              <tr>
                                 <td class="iage_footer" style="background-color: #0C4D71;">
         
                                    <table  width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0C4D71; height: 40px ">
                                       <tr>
                                          <td align="center" style="border-top: 1px solid rgb(211, 211, 211);">
                                             <span style="font-family: 'Montserrat', sans-serif;
                                                font-size: 0.9rem;color: #fff;">
                                             © 2021 Fatoura
                                             </span>
                                          </td>
                                       </tr>
                                    </table>
                                 </td>
                              </tr>
                              <span>This email has been sent on behalf of ${data.companyName} using <a href=https://fatoura.work>fatoura.work</a></span>
                              <!--footer END-->
                           </table>
                        </td>
                     </tr>
                  </table>
               </body>
            </html>`
            var result = await sendInvoiceMail.sendmail(data, html);
            console.log("result",result)
           return resolve(result);
       } catch (error) {
           console.log(error)
           return reject(error);
       }
        
    })
}


exports.sendInvitationMail = async(data) => {
   return new Promise( async(resolve, reject) => {
       try {
          console.log(data)
           var html = `<!DOCTYPE html>
           <html>
           <head>
              <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <meta http-equiv="X-UA-Compatible" content="IE=edge" />
              <link rel="preconnect" href="https://fonts.gstatic.com">
              <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap" rel="stylesheet">
           </head>
           <body>
              <table border="0" cellspacing="0" cellpadding="0" style="min-width: 320px; margin: 0 auto;">
                 <tr>
                    <td align="center" >
                       <table border="0" cellspacing="0" cellpadding="0" class="table_width_100" style="max-width: 580px;">
                          <tr>
                             <td align="center" bgcolor="#ffffff">
                                <table width="90%" border="0" cellspacing="0" cellpadding="0">
                                   <tr>
                                      <td align="left">
                                         <a href="#" target="_blank" style="color: #596167; font-size: 13px;">
                                            <img src="https://www.braininventory.com/fatoura/Fatoura-Logo-Dark.png" style="width: 120px; margin-top: 5px;" />
                                         </a>
                                      </td>
                                   </tr>
                                </table>
                             </td>
                          </tr>
                          <!--header END-->
                          <!--content 1 -->
                          <tr>
                             <td align="center" >
                                <table width="90%" border="0" cellspacing="0" cellpadding="0">
                                   <tbody style="background-image: url('https://www.braininventory.com/images/blo-background.png');background-size: cover;">
                                   <tr>
                                      <td align="center">
                                         <!-- padding -->
                                         <div style="height: 20px; line-height: 60px; font-size: 10px;"> </div>
                                         <div style="line-height: 44px;">
                                            <span style="font-family: 'Montserrat', sans-serif; font-size: 2rem; color: #3a3a3a; font-weight: 900;" >Invitation from Fatoura!</span>
                                            <p style="line-height: 1.5;
                                               color: #000000;
                                               font-size: 1rem;
                                               font-family: 'Montserrat', sans-serif;
                                               font-style: normal;
                                               padding-bottom: 0;
                                               margin-bottom: 0;">You have received an invitation from <a href="https://fatoura.work">fatoura.work</a>. Join us today and save time creating invoices and start getting paid online.
                                            </p>
                                            <img src="" style="padding: 50px 0; width: 100%;" />
                                            <button style="background: #0C4D71;height: 50px;margin: 35px 0;width: 350px;
                                               border-radius: 10px;
                                               border: none;"><a href=${data.url} style="text-decoration: none; display: block; font-family: 'Montserrat', sans-serif;
                                               color: #fff;
                                               font-size: 15px;">Click here to accept Invitation</a></button>
                                               <p>Please use the below link if the above button does not work.</p>
                                                <span>${data.url}</span>
                                         </div>
                                      </td>
                                   </tr>
                                </tbody>
                                </table>
                             </td>
                          </tr>
                          <tr>
                             <td class="iage_footer" style="background-color: #0C4D71;">
                                <table style="width: 100%; padding-top: 25px; padding-bottom: 15px;">
                                   <tr>
                                      <td>
                                         <div style="  width: 250px; margin:0 auto;">
                                            <p style="text-align: center; font-family: 'Montserrat', sans-serif;
                                               font-size: 0.9rem;
                                               color: white;
                                               line-height: 0;
                                                  width: 252px !important;
                                               padding-bottom: 10px;
                                               font-style: normal;">Regards,
                                            <p>
                                               <p style="text-align: center; font-family: 'Montserrat', sans-serif;
                                               font-size: 0.9rem;
                                               color: white;
                                               line-height: 0;
                                                  width: 252px !important;
                                               padding-bottom: 5px;
                                               font-style: normal;">Fatoura On Boarding Team
                                            <p>
                                         </div>
        
                                      </td>
                                   </tr>
                                </table>
        
                                <table  width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0C4D71; height: 40px ">
                                   <tr>
                                      <td align="center" style="border-top: 1px solid rgb(211, 211, 211);">
                                         <span style="font-family: 'Montserrat', sans-serif;
                                            font-size: 0.9rem;color: #fff;">
                                         © 2021 Fatoura
                                         </span>
                                      </td>
                                   </tr>
                                </table>
                             </td>
                          </tr>
                          <!--footer END-->
                       </table>
                    </td>
                 </tr>
              </table>
           </body>
           </html>`;
           var result = await sendMail.sendmail(data, html);
           return resolve(result);
       } catch (error) {
          console.log(error)
           return reject(error);
       }
   });
};

exports.sendForgetMail = async(data) => {
   return new Promise( async(resolve, reject) => {
      console.log(data.url)
       try {
         var html = `<!DOCTYPE html>
         <html>
            <head>
               <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
               <meta name="viewport" content="width=device-width, initial-scale=1">
               <meta http-equiv="X-UA-Compatible" content="IE=edge" />
               <link rel="preconnect" href="https://fonts.gstatic.com">
               <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap" rel="stylesheet">
            </head>
            <body>
               <table border="0" cellspacing="0" cellpadding="0" style="min-width: 320px; margin: 0 auto;">
                  <tr>
                     <td align="center" >
                        <table border="0" cellspacing="0" cellpadding="0" class="table_width_100" style="max-width: 580px;">
                           <tr>
                              <td align="center" bgcolor="#ffffff">
                                 <table width="90%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                       <td align="left">
                                          <a href="#" target="_blank" style="color: #596167; font-size: 13px;">
                                             <img src="https://www.braininventory.com/fatoura/Fatoura-Logo-Dark.png" style="width: 120px; margin-top: 5px;" />
                                          </a>
                                       </td>
                                    </tr>
                                 </table>
                              </td>
                           </tr>
                           <!--header END-->
                           <!--content 1 -->
                           <tr>
                              <td align="center" >
                                 <table width="90%" border="0" cellspacing="0" cellpadding="0">
                                    <tbody style="background-image: url('https://www.braininventory.com/images/blo-background.png');background-size: cover;">
                                    <tr>
                                       <td align="center">
                                          <!-- padding -->
                                          <div style="height: 20px; line-height: 60px; font-size: 10px;"> </div>
                                          <div style="line-height: 44px;">
                                             <span style="font-family: 'Montserrat', sans-serif; font-size: 2rem; color: #3a3a3a;    font-weight: 900;" >
                                             Reset your password
                                             </span>
                                             <p style="line-height: 1.5;
                                                color: #000000;
                                                font-size: 1rem;
                                                font-family: 'Montserrat', sans-serif;
                                                font-style: normal;
                                                padding-bottom: 0;
                                                margin-bottom: 0;">Don't worry, we all forget sometimes. <br> <br> Click the Reset Password button below to set up a new password. If you did not request a password reset, you can safely ignore this email. 
      
                                             </p>
                                             <button style="background: #0C4D71;height: 50px;margin: 35px 0;width: 350px;
                                                border-radius: 10px;
                                                border: none;"><a href=${data.url} style="text-decoration: none; display: block;      font-family: 'Montserrat', sans-serif;
                                                color: #fff;
                                                font-size: 15px;">Reset Password</a></button>
                                                <p>Please use the below link if the above button does not work.</p>
                                                <span>${data.url}</span>
      
      
                                          </div>
                                       </td>
                                    </tr>
                                 </tbody>
                                 </table>
                              </td>
                           </tr>
                           <tr>
                              <td class="iage_footer" style="background-color: #0C4D71;">
                                 <table style="width: 100%; padding-top: 25px; padding-bottom: 15px;">
                                    <tr>
                                       <td>
                                          <div style="  width: 250px; margin:0 auto;">
                                             <p style="text-align: center; font-family: 'Montserrat', sans-serif;
                                                font-size: 0.9rem;
                                                color: white;
                                                line-height: 0;
                                                   width: 252px !important;
                                                padding-bottom: 10px;
                                                font-style: normal;">Regards,
                                             <p>
                                                <p style="text-align: center; font-family: 'Montserrat', sans-serif;
                                                font-size: 0.9rem;
                                                color: white;
                                                line-height: 0;
                                                   width: 252px !important;
                                                padding-bottom: 5px;
                                                font-style: normal;">Fatoura On Boarding Team
                                             <p>
                                          </div>
      
                                       </td>
                                    </tr>
                                 </table>
      
                                 <table  width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0C4D71; height: 40px ">
                                    <tr>
                                       <td align="center" style="border-top: 1px solid rgb(211, 211, 211);">
                                          <span style="font-family: 'Montserrat', sans-serif;
                                             font-size: 0.9rem;color: #fff;">
                                          © 2021 Fatoura
                                          </span>
                                       </td>
                                    </tr>
                                 </table>
                              </td>
                           </tr>
                           <!--footer END-->
                        </table>
                     </td>
                  </tr>
               </table>
            </body>
         </html>`;

           var result = await sendMail.sendmail(data, html);
           console.log(result)
           return resolve(result);
       } catch (error) {
           return reject(error);
       }
   });
};

exports.sendQuery = async(data) => {
   return new Promise ( async(resolve, reject)=>{
      try{
         var html =`<!DOCTYPE html>
         <html>
            <head>
               <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
               <meta name="viewport" content="width=device-width, initial-scale=1">
               <meta http-equiv="X-UA-Compatible" content="IE=edge" />
               <link rel="preconnect" href="https://fonts.gstatic.com">
               <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap" rel="stylesheet">
            </head>
            <body>
               <table border="0" cellspacing="0" cellpadding="0" style="min-width: 320px; margin: 0 auto;">
                  <tr>
                     <td align="center" >
                        <table border="0" cellspacing="0" cellpadding="0" class="table_width_100" style="max-width: 580px;">
                           <tr>
                              <td align="center" bgcolor="#ffffff">
                                 <table width="90%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                       <td align="left">
                                          <a href="#" target="_blank" style="color: #596167; font-size: 13px;">
                                             <img src="https://www.braininventory.com/fatoura/Fatoura-Logo-Dark.png" style="width: 120px; margin-top: 5px;" />
                                          </a>
                                       </td>
                                    </tr>
                                 </table>
                              </td>
                           </tr>
                           <!--header END-->
                           <!--content 1 -->
                           <tr>
                              <td align="center" >
                                 <table width="90%" border="0" cellspacing="0" cellpadding="0">
                                    <tbody style="background-image: url('https://www.braininventory.com/images/blo-background.png');background-size: cover;">
                                    <tr>
                                       <td align="center">
                                          <!-- padding -->
                                          <div style="height: 20px; line-height: 60px; font-size: 10px;"> </div>
                                          <div style="line-height: 44px;">
                                             <span style="font-family: 'Montserrat', sans-serif; font-size: 2rem; color: #3a3a3a;    font-weight: 900;" >
                                             Customer Support
                                             </span>
                                             <p style="line-height: 1.5;
                                                color: #000000;
                                                font-size: 1rem;
                                                font-family: 'Montserrat', sans-serif;
                                                font-style: normal;
                                                padding-bottom: 0;
                                                margin-bottom: 0;">You have received a query from a customer
                                             </p>
                                              <div class="spacer">&nbsp;</div>            
                                              <table class="main center" width="602" border="0" cellspacing="0" cellpadding="0">
                                                  <tbody>
                                                    <tr>
                                                      <td style="text-align: center;">
                                                        <p style="color: #000000;
                                                        font-size: 1rem;
                                                        font-family: 'Montserrat', sans-serif;
                                                        font-style: normal;
                                                        padding-bottom: 0;
                                                        margin-bottom: 0;
                                                        font-weight: 800;">Name
                                                        </p>
                                                      </td>
                                                      <td>
                                                        <p style="color: #000000;
                                                        font-size: 1rem;
                                                        font-family: 'Montserrat', sans-serif;
                                                        font-style: normal;
                                                        padding-bottom: 0;
                                                        margin-bottom: 0;
                                                        font-weight: 500;">
                                                          "${data.name}"
                                                        </p>
                                                      </td>
                                                    </tr>
                                                    <tr>
                                                      <td style="text-align: center;">
                                                        <p style="color: #000000;
                                                        font-size: 1rem;
                                                        font-family: 'Montserrat', sans-serif;
                                                        font-style: normal;
                                                        padding-bottom: 0;
                                                        margin-bottom: 0;
                                                        font-weight: 800;">Email
                                                        </p>
                                                      </td>
                                                      <td>
                                                        <p style="color: #000000;
                                                        font-size: 1rem;
                                                        font-family: 'Montserrat', sans-serif;
                                                        font-style: normal;
                                                        padding-bottom: 0;
                                                        margin-bottom: 0;
                                                        font-weight: 500;">
                                                          "${data.from}"
                                                        </p>
                                                      </td>
                                                    </tr>
                                                    <tr>
                                                      <td style="text-align: center;">
                                                        <p style="color: #000000;
                                                        font-size: 1rem;
                                                        font-family: 'Montserrat', sans-serif;
                                                        font-style: normal;
                                                        padding-bottom: 0;
                                                        margin-bottom: 0;
                                                        font-weight: 800;">Query
                                                        </p>
                                                      </td>
                                                      <td>
                                                        <p style="color: #000000;
                                                        font-size: 1rem;
                                                        font-family: 'Montserrat', sans-serif;
                                                        font-style: normal;
                                                        padding-bottom: 0;
                                                        margin-bottom: 0;
                                                        font-weight: 500;">
                                                          "${data.query}"
                                                        </p>
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                              </table>
                                              <div class="spacer">&nbsp;</div>
                                          </div>
                                       </td>
                                    </tr>
                                 </tbody>
                                 </table>
                              </td>
                           </tr>
                           <tr>
                              <td class="iage_footer" style="background-color: #0C4D71;">
                                 <table style="width: 100%; padding-top: 25px; padding-bottom: 15px;">
                                    <tr>
                                       <td>
                                          <div style="  width: 250px; margin:0 auto;">
                                             <p style="text-align: center; font-family: 'Montserrat', sans-serif;
                                                font-size: 0.9rem;
                                                color: white;
                                                line-height: 0;
                                                   width: 252px !important;
                                                padding-bottom: 10px;
                                                font-style: normal;">Regards,
                                             <p>
                                                <p style="text-align: center; font-family: 'Montserrat', sans-serif;
                                                font-size: 0.9rem;
                                                color: white;
                                                line-height: 0;
                                                   width: 252px !important;
                                                padding-bottom: 5px;
                                                font-style: normal;">Fatoura On Boarding Team
                                             <p>
                                          </div>
      
                                       </td>
                                    </tr>
                                 </table>
      
                                 <table  width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0C4D71; height: 40px ">
                                    <tr>
                                       <td align="center" style="border-top: 1px solid rgb(211, 211, 211);">
                                          <span style="font-family: 'Montserrat', sans-serif;
                                             font-size: 0.9rem;color: #fff;">
                                          © 2021 Fatoura
                                          </span>
                                       </td>
                                    </tr>
                                 </table>
                              </td>
                           </tr>
                           <!--footer END-->
                        </table>
                     </td>
                  </tr>
               </table>
            </body>
         </html>
      `;
         

         var result = await sendMail.sendmail(data, html);
         return resolve(result);

      } catch(error) {
         console.log(error)
      }
   })
}

exports.sendUserVerification= async(data) => {
   return new Promise( async(resolve, reject) => {
       try {
           var html = `<!DOCTYPE html>
           <html>
              <head>
                 <title></title>
                 <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                 <meta name="viewport" content="width=device-width, initial-scale=1">
                 <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                 <link rel="preconnect" href="https://fonts.gstatic.com">
                 <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap" rel="stylesheet">
                 <style>
        
                 </style>
              </head>
              <body>
                 <table border="0" cellspacing="0" cellpadding="0" style="min-width: 320px; margin: 0 auto;">
                    <tr>
                       <td align="center" >
                          <table border="0" cellspacing="0" cellpadding="0" class="table_width_100" style="max-width: 580px;">
                             <tr>
                                <td align="center" bgcolor="#ffffff">
                                   <table width="90%" border="0" cellspacing="0" cellpadding="0">
                                      <tr>
                                         <td align="left">
                                            <a href="#" target="_blank" style="color: #596167; font-size: 13px;">
                                               <img src="https://www.braininventory.com/fatoura/Fatoura-Logo-Dark.png" style="width: 120px; margin-top: 5px;" />
                                            </a>
                                         </td>
                                      </tr>
                                   </table>
                                </td>
                             </tr>
                             <!--header END-->
                             <!--content 1 -->
                             <tr>
                                <td align="center" >
                                   <table width="90%" border="0" cellspacing="0" cellpadding="0">
                                      <tbody style="background-image: url('https://www.braininventory.com/images/blo-background.png');background-size: cover;">
                                      <tr>
                                         <td align="center">
                                            <!-- padding -->
                                            <div style="height: 20px; line-height: 60px; font-size: 10px;"> </div>
                                            <div style="line-height: 44px;">
                                               <span style="font-family: 'Montserrat', sans-serif; font-size: 2rem; color: #3a3a3a;    font-weight: 900;" >
                                               Please verify your <br/>Email Account!
                                               </span>
                                               <p style="line-height: 1.5;
                                                  color: #000000;
                                                  font-size: 1rem;
                                                  font-family: 'Montserrat', sans-serif;
                                                  font-style: normal;
                                                  padding-bottom: 0;
                                                  margin-bottom: 0;">You have signed up for a <a href="https://fatoura.work">fatoura.work</a> account. Please verify your email by clicking the Get Started button.
                                               </p>
                                               <img src="" style="padding: 50px 0; width: 100%;" />
                                               <button style="background: #0C4D71;height: 50px;margin: 35px 0;width: 350px;
                                                  border-radius: 10px;
                                                  border: none;"><a href=${data.url} style="text-decoration: none; display: block; font-family: 'Montserrat', sans-serif;
                                                  color: #fff;
                                                  font-size: 0.9rem;">Get Started</a></button>
                                                  <p>Please use the below link if the above button does not work.</p>
                                                  <span>${data.url}</span>
                                            </div>
                                         </td>
                                      </tr>
                                   </tbody>
                                   </table>
                                </td>
                             </tr>
                             <tr>
                                <td class="iage_footer" style="background-color: #0C4D71;">
                                   <table style="width: 100%; padding-top: 25px; padding-bottom: 15px;">
                                      <tr>
                                         <td>
                                            <div style="  width: 250px; margin:0 auto;">
                                               <p style="text-align: center; font-family: 'Montserrat', sans-serif;
                                                  font-size: 0.9rem;
                                                  color: white;
                                                  line-height: 0;
                                                     width: 252px !important;
                                                  padding-bottom: 10px;
                                                  font-style: normal;">Regards,
                                               <p>
                                                  <p style="text-align: center; font-family: 'Montserrat', sans-serif;
                                                  font-size: 0.9rem;
                                                  color: white;
                                                  line-height: 0;
                                                     width: 252px !important;
                                                  padding-bottom: 5px;
                                                  font-style: normal;">Fatoura On Boarding Team
                                               <p>
                                            </div>
        
                                         </td>
                                      </tr>
                                   </table>
        
                                   <table  width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0C4D71; height: 40px ">
                                      <tr>
                                         <td align="center" style="border-top: 1px solid rgb(211, 211, 211);">
                                            <span style="font-family: 'Montserrat', sans-serif;
                                               font-size: 0.9rem;color: #fff;">
                                            © 2021 Fatoura
                                            </span>
                                         </td>
                                      </tr>
                                   </table>
                                </td>
                             </tr>
                             <!--footer END-->
                          </table>
                       </td>
                    </tr>
                 </table>
              </body>
           </html>`;

           var result = await sendMail.sendmail(data, html);
           return resolve(result);
       } catch (error) {
           return reject(error);
       }
   });
};

exports.senSubsctiption= async(data) => {
   return new Promise( async(resolve, reject) => {
       try {
           var html = `<!DOCTYPE html>
           <html>
              <head>
                 <title></title>
                 <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                 <meta name="viewport" content="width=device-width, initial-scale=1">
                 <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                 <link rel="preconnect" href="https://fonts.gstatic.com">
                 <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap" rel="stylesheet">
              </head>
              <body>
                 <table border="0" cellspacing="0" cellpadding="0" style="min-width: 320px; margin: 0 auto;">
                    <tr>
                       <td align="center" >
                          <table border="0" cellspacing="0" cellpadding="0" class="table_width_100" style="max-width: 580px;">
                             <!--header -->
                             <tr>
                                <td align="center" bgcolor="#ffffff">
                                   <table width="90%" border="0" cellspacing="0" cellpadding="0">
                                      <tr>
                                         <td align="left">
                                            <a href="#" target="_blank" style="color: #596167; font-size: 13px;">
                                               <img src="https://www.braininventory.com/fatoura/Fatoura-Logo-Dark.png" style="width: 120px; margin-top: 5px;" />
                                            </a>
                                         </td>
                                      </tr>
                                   </table>
                                </td>
                             </tr>
                             <!--header END-->
                             <!--content 1 -->
                             <tr>
                                <td align="center" >
                                   <table width="90%" border="0" cellspacing="0" cellpadding="0">
                                      <tbody style="background-image: url('https://www.braininventory.com/images/blo-background.png');background-size: cover;">
                                         <tr>
                                            <td align="center">
                                               <!-- padding -->
                                               <div style="height: 20px; line-height: 60px; font-size: 10px;"></div>
                                               <div style="line-height: 44px;">
                                                  <span style="font-family: 'Montserrat', sans-serif; font-size: 2rem; color: #3a3a3a; font-weight: 900;" >
                                                     Fatoura Subscription
                                                  </span>
                                                  <p style="line-height: 1.5;
                                                     color: #000000;
                                                     font-size: 1rem;
                                                     font-family: 'Montserrat', sans-serif;
                                                     font-style: normal;
                                                     padding-bottom: 0;
                                                     margin-bottom: 0;">Congratulations, you have subscribed successfully. You can download your invoice by clicking on the Download button.
                                                  </p>
                                                  <img src="" style="padding: 50px 0; width: 100%;" />
                                                  <button style="background: #0C4D71;height: 50px;margin: 35px 0;width: 350px;
                                                     border-radius: 10px;
                                                     border: none;"><a href=${data.url} style="text-decoration: none; display: block;      font-family: 'Montserrat', sans-serif;
                                                     color: #fff;
                                                     font-size: 15px;">Download</a></button>
                                                     <p>Please use the below link if the above button does not work.</p>
                                                     <span>${data.url}</span>
        
        
                                               </div>
                                            </td>
                                         </tr>
                                      </tbody>
                                   </table>
                                </td>
                             </tr>
                             <tr>
                                <td class="iage_footer" style="background-color: #0C4D71;">
                                   <table style="width: 100%; padding-top: 25px; padding-bottom: 15px;">
                                      <tr>
                                         <td>
                                            <div style="  width: 250px; margin:0 auto;">
                                               <p style="text-align: center; font-family: 'Montserrat', sans-serif;
                                                  font-size: 0.9rem;
                                                  color: white;
                                                  line-height: 0;
                                                     width: 252px !important;
                                                  padding-bottom: 10px;
                                                  font-style: normal;">Regards,
                                               <p>
                                                  <p style="text-align: center; font-family: 'Montserrat', sans-serif;
                                                  font-size: 0.9rem;
                                                  color: white;
                                                  line-height: 0;
                                                     width: 252px !important;
                                                  padding-bottom: 5px;
                                                  font-style: normal;">Fatoura On Boarding Team
                                               <p>
                                            </div>
        
                                         </td>
                                      </tr>
                                   </table>
        
                                   <table  width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0C4D71; height: 40px ">
                                      <tr>
                                         <td align="center" style="border-top: 1px solid rgb(211, 211, 211);">
                                            <span style="font-family: 'Montserrat', sans-serif;
                                               font-size: 0.9rem;color: #fff;">
                                            © 2021 Fatoura
                                            </span>
                                         </td>
                                      </tr>
                                   </table>
                                </td>
                             </tr>
                             <!--footer END-->
                          </table>
                       </td>
                    </tr>
                 </table>
              </body>
           </html>`;

           var result = await sendMail.sendmail(data, html);
           return resolve(result);
       } catch (error) {
           return reject(error);
       }
   });
};

exports.sendNotification= async(data) => {
   return new Promise( async(resolve, reject) => {
       try {
           var html = `<!DOCTYPE html>
           <html>
              <head>
                 <title></title>
                 <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                 <meta name="viewport" content="width=device-width, initial-scale=1">
                 <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                 <link rel="preconnect" href="https://fonts.gstatic.com">
                 <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap" rel="stylesheet">
              </head>
              <body>
                 <table border="0" cellspacing="0" cellpadding="0" style="min-width: 320px; margin: 0 auto;">
                    <tr>
                       <td align="center" >
                          <table border="0" cellspacing="0" cellpadding="0" class="table_width_100" style="max-width: 580px;">
                             <!--header -->
                             <tr>
                                <td align="center" bgcolor="#ffffff">
                                   <table width="90%" border="0" cellspacing="0" cellpadding="0">
                                      <tr>
                                         <td align="left">
                                            <a href="#" target="_blank" style="color: #596167; font-size: 13px;">
                                               <img src="https://www.braininventory.com/fatoura/Fatoura-Logo-Dark.png" style="width: 120px; margin-top: 5px;" />
                                            </a>
                                         </td>
                                      </tr>
                                   </table>
                                </td>
                             </tr>
                             <!--header END-->
                             <!--content 1 -->
                             <tr>
                                <td align="center" >
                                   <table width="90%" border="0" cellspacing="0" cellpadding="0">
                                      <tbody style="background-image: url('https://www.braininventory.com/images/blo-background.png');background-size: cover;">
                                         <tr>
                                            <td align="center">
                                               <!-- padding -->
                                               <div style="height: 20px; line-height: 60px; font-size: 10px;"></div>
                                               <div style="line-height: 44px;">
                                                  <span style="font-family: 'Montserrat', sans-serif; font-size: 2rem; color: #3a3a3a; font-weight: 900;" >
                                                     Fatoura Subscription
                                                  </span>
                                                  <p style="line-height: 1.5;
                                                     color: #000000;
                                                     font-size: 1rem;
                                                     font-family: 'Montserrat', sans-serif;
                                                     font-style: normal;
                                                     padding-bottom: 0;
                                                     margin-bottom: 0;">Hey your plan is expired, Please subscribe immediately otherwise you last your all date in few days.
                                                  </p>
                                                  <img src="" style="padding: 50px 0; width: 100%;" />
                                                  <button style="background: #0C4D71;height: 50px;margin: 35px 0;width: 350px;
                                                     border-radius: 10px;
                                                     border: none;"><a href=${data.url} style="text-decoration: none; display: block;      font-family: 'Montserrat', sans-serif;
                                                     color: #fff;
                                                     font-size: 15px;">Cleick Here</a></button>
                                                     <p>Please use the below link if the above button does not work.</p>
                                                     <span>${data.url}</span>
        
        
                                               </div>
                                            </td>
                                         </tr>
                                      </tbody>
                                   </table>
                                </td>
                             </tr>
                             <tr>
                                <td class="iage_footer" style="background-color: #0C4D71;">
                                   <table style="width: 100%; padding-top: 25px; padding-bottom: 15px;">
                                      <tr>
                                         <td>
                                            <div style="  width: 250px; margin:0 auto;">
                                               <p style="text-align: center; font-family: 'Montserrat', sans-serif;
                                                  font-size: 0.9rem;
                                                  color: white;
                                                  line-height: 0;
                                                     width: 252px !important;
                                                  padding-bottom: 10px;
                                                  font-style: normal;">Regards,
                                               <p>
                                                  <p style="text-align: center; font-family: 'Montserrat', sans-serif;
                                                  font-size: 0.9rem;
                                                  color: white;
                                                  line-height: 0;
                                                     width: 252px !important;
                                                  padding-bottom: 5px;
                                                  font-style: normal;">Fatoura On Boarding Team
                                               <p>
                                            </div>
        
                                         </td>
                                      </tr>
                                   </table>
        
                                   <table  width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0C4D71; height: 40px ">
                                      <tr>
                                         <td align="center" style="border-top: 1px solid rgb(211, 211, 211);">
                                            <span style="font-family: 'Montserrat', sans-serif;
                                               font-size: 0.9rem;color: #fff;">
                                            © 2021 Fatoura
                                            </span>
                                         </td>
                                      </tr>
                                   </table>
                                </td>
                             </tr>
                             <!--footer END-->
                          </table>
                       </td>
                    </tr>
                 </table>
              </body>
           </html>`;

           var result = await sendMail.sendmail(data, html);
           return resolve(result);
       } catch (error) {
           return reject(error);
       }
   });
};