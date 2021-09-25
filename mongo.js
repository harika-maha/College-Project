var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/cse',{useNewUrlParser: true, useUnifiedTopology: true});
 var schema_teacher=mongoose.Schema({name: String,username: {type:String, unique: true },email: String,post: String,subject: Array});
//var model=mongoose.model('teacher',schema_teacher);
var schema_login=mongoose.Schema({username: {type:String, unique: true },email: String,password: String});
var model=mongoose.model('login',schema_login);
// var schema_batch=mongoose.Schema({Semester: Number,exam: Array,file: Array});
// var model=mongoose.model('batch',schema_batch);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var newmodel=new model();
// newmodel.Semester=8;
// newmodel.exam=["2017-2021#iae1","2017-2021#iae2"];
// newmodel.file=[];
newmodel.username="jai2021";
newmodel.email="jai@gmail.com";
newmodel.password="jai";
// newmodel.username="admin2021";
// newmodel.email="admin@gmail.com";
// newmodel.name="admin";
// newmodel.post="asss";
//newmodel.subject=["2017-2021#Semester1#Communicative English","2018-2022#Semester2#Technical English"];
newmodel.save(function()
{
    console.log("saved");
    mongoose.disconnect();
});

// model.find({},function(err,data) {
//     // console.log(data[1].subject[0].split("#")[0]);
//     // console.log(data[1].subject[0].split("#")[1]);
//     // console.log(data[1].subject[0].split("#")[2]);
//     console.log(data);
//     mongoose.disconnect();
// });
// model.findOneAndUpdate({Semester:1},{exam:["2017-2021#iae1","2017-2021#iae2","2018-2022#iae1"]},{upsert: true},function(params) {
//  console.log("updated");
//  mongoose.disconnect() ;  
// });
// model.remove({username:"sfsfg"},function()
// {
//     console.log("removed");
//     mongoose.disconnect();
// });