const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');

// funcion verificar token
const { verificacionToken, verificacionRole } = require('../midelwares/autenticaton');

// el parametro del medio es una funcion para verficar el token

app.get('/usuario', verificacionToken, function(req, res) {

    let desde = req.query.desde || 0;
    //transformar numero
    desde = Number(desde);

    let limite = req.query.limite || 5;
    //transformar numero
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role ') // que campos queremos devolver
        .skip(desde) //salta los 5 primeros
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: 'False',
                    mensaje: 'Error GET'
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuario: usuarios,
                    numero: conteo
                });

            });



        });
});

app.post('/usuario', [verificacionToken, verificacionRole], (req, res) => {
    //body parser
    let body = req.body;



    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
            // estado: body.estado,
            //  google: body.google
    });


    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: 'False',
                mensaje: 'No se guardo el usuario en la BDA',
                err: err
            });
        }
        //para no retornar el valor del password
        usuarioDB.password = null;


        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});

app.put('/usuario/:id', [verificacionToken, verificacionRole], function(req, res) {
    let id = req.params.id;
    //obtener los datos de le peticion 

    // usando underscore
    let body = _.pick(req.body, ['nombre', 'email', 'role', 'estado']);


    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: 'False',
                mensaje: 'No se guardo el usuario en la BDA'
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });
});

app.delete('/usuario/:id', [verificacionToken, verificacionRole], function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    };


    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true, runValidators: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: 'False',
                mensaje: 'Error , no se ha borrado el usuario'
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: 'False',
                mensaje: 'No se ha borrado el usuario',
                err: err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });

});

module.exports = app;