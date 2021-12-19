const {Router} = require('express');
const router = Router();
const nodemailer = require('nodemailer');
router.post('/sendemail', (req,res)=>{


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
        //  console.log(req.body);
     })

   const mailOptions = {
    from: 'flykombi@gmail.com',
    to: `${req.body.to}`, // Cambia esta parte por el destinatario
    subject: `${req.body.subject}`,
    text:`${req.body.mensaje}`
    };

   transporter.sendMail(mailOptions, function (err, info) {
    if (err)
    res.status(500).send(err);
    else
    res.status(200).send(info);
    });
// }
})

module.exports = router;