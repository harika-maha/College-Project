var express = require("express");
var app = express();

const bodyParser = require('body-parser')
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/teacher', {useNewUrlParser: true});
var conn = mongoose.connection;

var addteacherSchema = new mongoose.Schema({
    batch: String,
    semester: String,
    subject: String,
    username: String,
    email: String,
    pass: String,
    pos: String
});

var addTeacherModel = mongoose.model('AddTeacher', addteacherSchema);

var addteacher = addTeacherModel.find({});


app.set('views', './views')
app.set('view engine', 'ejs');

app.get('/', function(req, res, next) {
    addteacher.exec(function(err, data){
        if(err) throw err;
        res.render('add_teacher');
    });
});

app.post('/', function(req, res, next){
    var teacherdetails = new addTeacherModel({
        batch: req.body.batch,
        semester: req.body.sem,
        subject: req.body.sub,
        username: req.body.uname,
        email: req.body.email,
        pass: req.body.pass,
        pos: req.body.pos
    });
    console.log(teacherdetails);

    teacherdetails.save(function(err, res1){
        if(err) throw err;
        addteacher.exec(function(err, data){
            if(err) throw err;
            res.render('add_teacher');
        });
    });
});

app.listen(3000)
