const express = require('express');
const app = express();
const cors = require('cors');


app.use(cors());
app.use(express.static('./public'));
global.rootDir = __dirname ;

app.get('/api',async function (req, res) {
    res.status(200).send('API works el-jezera reports.');
});

const mainController = require('./controllers/main_controller');
app.use('/api/main' , mainController);


module.exports = app;