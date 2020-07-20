//puerto
process.env.PORT = process.env.PORT || 3000;
//conexion

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