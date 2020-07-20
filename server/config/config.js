//puerto
process.env.PORT = process.env.PORT || 3000;
//conexion

//Esta variable de entorno la establece heroku, sino es q estoy en integracion
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';



let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://root:hUMyLjjGgxtC3Hqw@cluster0.yvogi.mongodb.net/cafe';
}

//forzar usar la bda de producion
//urlDB = 'mongodb+srv://root:hUMyLjjGgxtC3Hqw@cluster0.yvogi.mongodb.net/cafe';


// esta URLDB es inventada
process.env.URLDB = urlDB;