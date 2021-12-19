const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());
app.use(cors())
app.use(require('./routes'));
// app.post('/sendemail', function (req,res){
//     console.log(req.body);
//     res.status(200).send();
// });
app.listen(3000, () => {
console.log('Servidor corriendo en http://localhost:3000')
});
