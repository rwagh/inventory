const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const helper = require("./Helper");
const app = express();
const product = require("./routes/product");
helper.init();

app.use(cors());

app.use(express.static('public'));
// set the view engine to ejs
app.set('view engine', 'ejs');

app.get(`/`, async(req, res) => {
    res.status(200).send({ status: "it work's" })
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/product", product);
const port = process.env.PORT || 8080;
app.listen(port, function() {
    console.log(`Service is running at ${port}`);
});