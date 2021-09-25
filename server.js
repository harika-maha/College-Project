var express=require('express');
var mongoose=require('mongoose');
var xl =require("xlsx");
var ejs = require("ejs");
var app=express();
var fileupload =require('express-fileupload');
var bodya=require("body-parser");
const { urlencoded } = require('body-parser');
app.use(bodya.urlencoded({extended:true}));
app.use(bodya.json());
app.use(fileupload());
mongoose.connect('mongodb://localhost/cse',{useNewUrlParser: true, useUnifiedTopology: true});
var schema_login=mongoose.Schema({username: {type:String, unique: true },email: String,password: String});
var model_login=mongoose.model('login',schema_login);
var schema_teacher=mongoose.Schema({name: String,username: {type:String, unique: true },email: String,post: String,subject: Array});
var model_teacher=mongoose.model('teacher',schema_teacher);
var schema_batch=mongoose.Schema({Semester: Number,exam: Array,file: Array});
var model_batch=mongoose.model('batch',schema_batch);
app.use(express.static('public'));
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
app.set('view engine','ejs');
var user={
    username:"",
    password:"",
    email:"",
    name:"",
    post:"",
}
app.listen(6500,function()
{
    console.log("server stated");
});
app.get("/",function(req,res)
{
    res.render("login",{st:2})
});
app.post("/login",function(req,res)
{

    model_login.find({},function(err,data){
        var t=0;
        if("admin@gmail.com"==req.body.email)
        {
            if("admin"==req.body.password)
            {

                t=1;
                user.username="admin2021";
                user.password="admin";
                user.email="admin@gmail.com";
            }
            else
            {
                t=2;
        
            }
        }
        if(t==2)//email matching password not matching
        {
            res.render("login",{st:1});
        }
        if(t==1)
        {
            model_teacher.find({username:user.username},function(err,data){
                user.name=data[0].name;
                user.post=data[0].post;
                res.render("astaffd",data[0]);
            });
        }
        var t=0;
        for(i=0;i<data.length;i++)
        {
            if(data[i].email==req.body.email)
            {
                if(data[i].password==req.body.password)
                {

                    t=1;
                    user.username=data[i].username;
                    user.password=data[i].password;
                    break;
                }
                else
                {
                    t=2;
                    break;
                }
            }
            else
            {
                t=0;
            }
        }
        if(t==0)//email not found
        {
            res.render("login",{st:0});
        }
        if(t==2)//email matching password not matching
        {
            res.render("login",{st:1});
        }
        if(t==1)
        {
            model_teacher.find({username:user.username},function(err,data){
                user.email = data[0].email;
                user.post = data[0].post;
                user.name = data[0].name;
                // console.log(data[0]);
                res.render("ustaffd",data[0]);
            });
        }
    });
});
app.get("/details",function(req,res)
{
    if("admin@gmail.com"==user.email){
        res.render("astaffd", user);
    }
    else{
        res.render("ustaffd", user);
        console.log(user);
    }
        
              
    
});
app.get("/changepass",function(req,res) {
    res.render("achange",{...user,stats:0});
});
app.post("/password",function (req,res){

    if(req.body.status==0)
    {
        res.render("achange",user);
    }else{
        model_login.findOneAndUpdate({username:user.username},{password:req.body.newp},{upsert: true},function(params) {
            console.log("updated");
            if(user.username=="admin2021")
            {
                res.render("achange",{...user,stats:1});
            }else{
                res.render("uchange",{...user,stats:1})
            }

        })
    }
});
app.get("/generatefile",function(req,res){
    var batch=[];
    var semester=[]
    var exam=["","","","","","","",""];
    model_teacher.find({username:user.username},function(err,data){
        for(i=0;i<data[0].subject.length;i++)
        {
            batch.push(data[0].subject[i].split("#")[0]);
            semester.push(data[0].subject[i].split("#")[1]);
        }
        model_batch.find({},function(err,data1){
            for(i=0;i<data1.length;i++)
                for(j=0;j<batch.length;j++)
                    for(k=0;k<data1[i].exam.length;k++)
                        if(batch[j]==data1[i].exam[k].split("#")[0])
                        exam[i]+=data1[i].exam[k]+"@";
                        res.render("generatefile",{exam,subject:data[0].subject,username:user.username,status:0,filename:"sample#",stat:0});
        });
    });
});
app.post("/generate",function(req,res) {
    // var filename=""+user.username+"#"+req.body.batch+"#"+req.body.semester+"#"+req.body.subject+".png";
    var filename="sam.pdf";
    console.log(filename);
    var batch=[];
    var semester=[]
    var exam=["","","","","","","",""];
    model_teacher.find({username:user.username},function(err,data){
        for(i=0;i<data[0].subject.length;i++)
        {
            batch.push(data[0].subject[i].split("#")[0]);
            semester.push(data[0].subject[i].split("#")[1]);
        }
        model_batch.find({},function(err,data1){
            for(i=0;i<data1.length;i++)
                for(j=0;j<batch.length;j++)
                    for(k=0;k<data1[i].exam.length;k++)
                        if(batch[j]==data1[i].exam[k].split("#")[0])
                        exam[i]+=data1[i].exam[k]+"@";
                        res.render("generatefile",{exam,subject:data[0].subject,username:user.username,stat:1,filename,status:1});
        });
    });
});
app.get("/uploadfile",function(req,res) {
    var batch=[];
    var semester=[]
    var exam=["","","","","","","",""];
    model_teacher.find({username:user.username},function(err,data){
        for(i=0;i<data[0].subject.length;i++)
        {
            batch.push(data[0].subject[i].split("#")[0]);
            semester.push(data[0].subject[i].split("#")[1]);
        }
        model_batch.find({},function(err,data1){
            for(i=0;i<data1.length;i++)
                for(j=0;j<batch.length;j++)
                    for(k=0;k<data1[i].exam.length;k++)
                        if(batch[j]==data1[i].exam[k].split("#")[0])
                        exam[i]+=data1[i].exam[k]+"@";
                        res.render("uploadfile",{exam,subject:data[0].subject,username:user.username,status:0});
        });
    });
});
app.post("/uploading",function(req,res) {
    var file=req.files.file;
    console.log(file.name);
    console.log(Number(req.body.semester.split(" ")[1]));
    if(req.body.pos==undefined)
    {
        var filename=""+user.username+"_"+req.body.batch+"_"+req.body.semester+"_"+req.body.subject+"_"+req.body.exam+".xlsx";   
    }
    else
    var filename=""+user.username+"_"+req.body.batch+"_"+req.body.semester+"_"+req.body.subject+"_"+"pos.xlsx";    file.mv("./public/"+filename,function(err){
        model_batch.findOneAndUpdate({Semester:Number(req.body.semester.split(" ")[1])},{$push:{file:filename}},{upsert: true},function()
        {
            var batch=[];
            var semester=[]
            var exam=["","","","","","","",""];
            model_teacher.find({username:user.username},function(err,data){
                for(i=0;i<data[0].subject.length;i++)
                {
                    batch.push(data[0].subject[i].split("#")[0]);
                    semester.push(data[0].subject[i].split("#")[1]);
                }
                model_batch.find({},function(err,data1){
                    for(i=0;i<data1.length;i++)
                        for(j=0;j<batch.length;j++)
                            for(k=0;k<data1[i].exam.length;k++)
                                if(batch[j]==data1[i].exam[k].split("#")[0])
                                exam[i]+=data1[i].exam[k]+"@";
                                res.render("uploadfile",{exam,subject:data[0].subject,username:user.username,status:1});
                });
            });
        });
    });
});
app.get("/addexam",function(req,res){
    res.render("addexam",{status:0,username:user.username});
});
app.post("/exam",function(req,res){
    var exam=""+req.body.batch+"#"+req.body.exam;
    model_batch.findOneAndUpdate({Semester:Number(req.body.semester.split(" ")[1])},{$push:{exam}},{upsert: true},function()
    {
        res.render("addexam",{status:1,username:user.username});
    })
})
app.get("/addteacher",function(req,res)
{
    res.render("aaddtecher",{st:2,username:user.username});
});
app.post("/aaddteacherdata",async function(req,res)
{
    if(req.body.new==undefined){
    req.body={...req.body,new:"off"};
    }
    var sem=req.body.semester.split(" ")[0]+req.body.semester.split(" ")[1];
    var sub=""+req.body.batch+"#"+sem+"#"+req.body.subject;
    if(req.body.new=="off")
    {
        model_teacher.findOneAndUpdate({username:req.body.uname},{ $push: {subject:[sub]}},{upsert: true},function()
        {
            res.render("aaddtecher",{st:0,username:user.username});
        });
    }
    else{
        var teacher=new model_teacher();
        teacher.username=req.body.uname;
        teacher.email=req.body.email;
        teacher.name=req.body.name;
        teacher.post=req.body.post;
        teacher.subject=[sub];
        var login=new model_login();
        login.username=req.body.uname;
        login.password=req.body.pass;
        login.email=req.body.email;
        try{
            login.save(function()
            {
            });
            teacher.save(function()
            {
                
            });
            res.render("aaddtecher",{st:0,username:user.username});
        }
        catch(err)
        {
            res.render("aaddtecher",{st:1,username:user.username});
        }
    }
});
app.get("/logout", function(req, res){
        user.username=""
        user.password=""
        user.email=""
        user.name=""
        user.post=""
        res.render("login", {st:2});
})