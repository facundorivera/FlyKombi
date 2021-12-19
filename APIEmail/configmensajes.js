// const nodemailer = require('nodemailer');
// // module.exports = (formulario) => {
//  export const transporter = nodemailer.createTransport({
//  host: 'smtp.gmail.com',
//  port: 465,
//  secure:true,
//  auth: {
//  user: 'facuriive@gmail.com', // Cambialo por tu email
//  pass: 'eeljkeapeiujifue' // Cambialo por tu password
//  }
//  });

//  transporter.verify().then( ()=>{
//      console.log('ready for send emails');
//  });


//  // send mail with defined transport object
//  let info = await transporter.sendMail({
//     from: '"Fred Foo 👻" <facuriive@gmail.com>', // sender address
//     to: "rivera.facundo.as2017@gmail.com", // list of receivers
//     subject: "Funciona ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // html body
//   });
const nodemailer = require('nodemailer');

// module.exports = (sendemail) =>


    const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure:true,
    auth: {
    user: 'flykombi@gmail.com', // Cambialo por tu email
    pass: 'wekupyznjbqblfxu' // Cambialo por tu password
    }
    });

    transporter.verify().then(()=>{
        console.log('listo para enviar correo');
        console.log(req);
    })

   const mailOptions = {
    from: 'flykombi@gmail.com',
    to: 'rivera.facundo.as2017@gmail.com', // Cambia esta parte por el destinatario
    subject: 'prueba nodejs',
    };

   transporter.sendMail(mailOptions, function (err, info) {
    if (err)
    console.log(err)
    else
    console.log(info);
    });
// }


