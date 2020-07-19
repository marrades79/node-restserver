require('./config/config');

const express = require('express')
const app = express()

//body parser
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/usuario', function(req, res) {
    res.json('get Usuario')
});

app.post('/usuario', function(req, res) {
    //body parser
    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: 'False',
            mensaje: 'Algo salio mal'
        });

    } else {
        res.json({ body });
    }

});


app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    res.json({
        id
    });
});

app.delete('/usuario', function(req, res) {
    res.json('Delete Usuario')
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto ', process.env.PORT);
});