var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, './static')));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/quottingdojo');
var QuoteSchema = new mongoose.Schema({
    name: {type: String, required: true},
    quote: {type: String, required: true}
}, {timestamps: true});

mongoose.model('Quote', QuoteSchema);
var Quote = mongoose.model('Quote');

app.get('/', function(req, res) {  
    res.render('index');
})

app.post('/quotes', function(req,res) {
    var quote = new Quote(req.body);
    quote.save(function(err) {
        if (err) {
            console.log("error when submitting")
            res.render('index', {errors: quote.errors})
        } else {
            res.redirect("/quotes");
        }
    })
})

app.get('/quotes', function(req, res) {
    Quote.find({}, function(err, quotes) {
        if (err) {
            console.log("could not retrieve data");
        } else {
            console.log(quotes)
            var quotes = quotes;
            res.render('quotes', {quotes: quotes});            
        }
    })
})


app.listen(8000, function() {
    console.log("listening on port 8000");
})