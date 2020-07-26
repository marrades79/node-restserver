//+++++++++++++++++++++++++++++++++
// Verificar Token
//+++++++++++++++++++++++++++++++++

const jwt = require('jsonwebtoken');

let verificacionToken = (req, res, next) => {

    let token = req.get('token');

    try {

        var decoded = jwt.verify(token, process.env.SEED_TOKEN);
        req.usuario = decoded.usuario;
        next();

    } catch (err) {

        if (err) {
            return res.status(400).json({
                ok: 'False',
                mensaje: 'Error token',
                err: err,
                token: token,
                seed: process.env.SEED_TOKEN
            });
        }
    }
};


let verificacionRole = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.status(400).json({
            ok: 'False',
            mensaje: 'no eres administrador'
        });

    }

};

module.exports = {
    verificacionToken,
    verificacionRole
};