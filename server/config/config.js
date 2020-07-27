//+++++++++++++++++++++
//puerto
//+++++++++++++++++++++

process.env.PORT = process.env.PORT || 3000;

//+++++++++++++++++++++
//conexion a la BDA
//+++++++++++++++++++++

//Esta variable de entorno la establece heroku, sino es q estoy en integracion
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

// esta URLDB es inventada
process.env.URLDB = urlDB;

//+++++++++++++++++++++
// vencimiento  token
//+++++++++++++++++++++


//Este token espira en 30 dias 
//milisegundos 
//segundos
//minutos
//24 horas
//30 dias

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
//+++++++++++++++++++++
// semilla /firma/seed  token
//+++++++++++++++++++++

process.env.SEED_TOKEN = process.env.SEED_TOKEN || 'secret-desarrollo';


//+++++++++++++++++++++
// google client
//+++++++++++++++++++++

process.env.CLIENT_ID = process.env.CLIENT_ID || '342146975641-bd3ga5pvnj4i5v87llg8t308ivngt4e3.apps.googleusercontent.com';