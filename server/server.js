require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express()



//body parser
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

//configuracion global de rutas
app.use(require('./routes/index'));

//habilitar la carpeta public
const path = require('path');
app.use(express.static(path.resolve(__dirname, '../public')));

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err, resp) => {
    if (err) throw err;
    console.log('BDA on line');

});
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto ', process.env.PORT);
});