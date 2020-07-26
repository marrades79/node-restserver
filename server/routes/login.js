const express = require('express');
const app = express();

const bcrypt = require('bcrypt');

const Usuario = require('../models/usuario');

//token 
const jwt = require('jsonwebtoken');

app.post('/login', (req, res) => {


    let body = req.body;
    //mirar si existe el usuario


    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: 'False',
                mensaje: 'Error POST LOGIN'
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: 'False',
                mensaje: 'EL usuario no existe'
            });

        }


        //evaluamos la contraseña

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: 'False',
                mensaje: 'La contrseña no es correcta'
            });

        }




        let token = jwt.sign({
            usuario: usuarioDB
                // }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN });
        }, process.env.SEED_TOKEN, { expiresIn: '3h' });



        res.json({
            ok: true,
            usuario: usuarioDB,
            token: token
        });

    });


});

module.exports = app;