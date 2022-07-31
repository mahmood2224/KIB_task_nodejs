const app = require('./app');
const cors = require('cors');

require('dotenv').config();

const port = process.env.PORT || 3000;
// require('./db');

app.use(cors());
// app.use(express.static( './public'));

const server = app.listen(port, function() {
    console.log('Express server listening on port ' + port);
    // dbConnect.connect();
    // var t = setInterval(mongoController.sync, 10*1000);
    // mongoController.sync()
});
