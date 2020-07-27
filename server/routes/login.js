const express = require('express');
const app = express();

const bcrypt = require('bcrypt');

const Usuario = require('../models/usuario');

//token 
const jwt = require('jsonwebtoken');

//google
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


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

//configuraciones de google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];

    // console.log(payload.email);

    return ({

        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    });
}
//verify().catch(console.error);

// el async del post es porque la funcion verify tambien lo tiene
app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                error: 'catch',
                err: e
            })
        });


    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: 'False',
                mensaje: 'Error POST LOGIN'
            });
        }

        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Tienen que autenticarse como un usuario normal'
                    }
                });
            } else {
                //renuevo el token

                let token = jwt.sign({
                    usuario: usuarioDB
                        // }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN });
                }, process.env.SEED_TOKEN, { expiresIn: '3h' });


                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token

                });
            }


        } else {
            //usuario no existe en la BDA

            let usuario = new Usuario();
            usuario.nombre = googleUser.name;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':-)';

            usuario.save((err, usuarioDB) => {

                if (err) {
                    return res.status(500).json({
                        ok: 'False',
                        err
                    });
                }


                let token = jwt.sign({
                    usuario: usuarioDB
                        // }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN });
                }, process.env.SEED_TOKEN, { expiresIn: '3h' });


                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token

                });


            });


        }

    });




});

module.exports = app;