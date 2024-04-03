const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify} = require('util');
const db = mysql.createConnection({
    host: "sql6.freemysqlhosting.net",
    user: "sql6696268",
    password: "jLvUCYLY6p",
    database: "sql6696268"
});
exports.register = (req,res) => {
    let  message;
    const {name,email,password} = req.body;
    db.query('select email from users where email = ?',[email],async(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.lenght > 0){
            message:'The email is already been taken';
            res.send(JSON.stringify({"status": 200, "error": null, "response": message}));
        }else{
            
            db.query('insert into users set ?',{name:name,email:email,password:password},(error,result)=>{
                if(error){
                    console.log(error);
                }else{
                    message:'user Registered';
                    res.send(JSON.stringify({"status": 200, "error": null, "response": message}));
                }
        });
        }
    });
}
exports.login = (req,res) => {
    const {email,password} = req.body;
    try{
        if(!email || !password){
            return res.status(400).render('login',{
                message:'Plese enter email and password'
            })
        }
        db.query('select * from users where email = ?',[email], async(error,results)=>{
            console.log(results);
            if(!results ){
                res.status(401).render('login',{
                    message:'Email or password is incorrect'
                })
            }else{

                if(password===results[0].password)
               { const id = results[0].id;
                const token = jwt.sign({id},process.env.JWT_SECRET,{
                    expiresIn:process.env.JWT_EXPIRES_IN
                })
                console.log(token);
                const cookieOptions = {
                    expires:new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES *24*60*60*1000
                    ),
                    httpOnly:true
                }
                message = [{'jwt':token},{'userdata':results}]
                res.send(JSON.stringify({"status": 200, "error": null, "response": message}));}

            }
        })
    }catch(error){
        console.log(error);
    }
  
}
exports.isLoggedIn = async (req,res,next) =>{
    console.log(req.cookies);
    if(req.cookies.jwt){
        try {
            const decode = await promisify(jwt.verify)(req.cookies.jwt,
                process.env.JWT_SECRET);
            //console.log(decode);
            db.query('select * from users where id=?',[decode.id],(error,results)=>{
                //console.log(results);
                if(!results){
                    return next();
                }
                req.user = results[0];
                return next();
            });
        } catch (error) {
            console.log(error);
        }
    }else{
        next();
    }
   
}
exports.logout = (req,res)=>{
    res.cookie('jwt','logout',{
        expires:new Date(Date.now()+2*1000),httpOnly:true
    });
    res.status(200).redirect('/');
}
exports.storedata = (req,res)=>{
    let  message;
    const {name,email,password} = req.body;
    console.log("name =",name,email,password)
    db.query('select email from users where email = ?',[email],async(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length > 0){
            
            message ='The email is already been taken';
            res.send(JSON.stringify({"status": 200, "error": null, "response": message}));
        }else{
            
            db.query('insert into users set ?',{name:name,email:email,password:password},(error,result)=>{
                if(error){
                    console.log(error);
                }else{
                    message = 'user Registered';
                    res.send(JSON.stringify({"status": 200, "error": null, "response": message}));
                }
        });
        }
    });
}
exports.userlist = (req,res) => {
    db.query('select * from users limit 15',[],(error,results)=>{
        res.send(JSON.stringify({"status": 200, "error": null, "message": results}));
    })
}
exports.singleuserlist = (req,res,next) =>{
    var user = {id:req.params.id};
    db.query('select * from users where ?',[user],(error,results)=>{
        res.send(JSON.stringify({"status": 200, "error": null, "message": results}));
    });
}
exports.singleproductlist = (req,res,next) =>{
    var product = {id:req.params.id};
    db.query('select * from product where ?',[product],(error,results)=>{
        res.send(JSON.stringify({"status": 200, "error": null, "message": results}));
    });
}
exports.deleteuser=(req,res)=>{
    var user = {id:req.params.id};
    console.log(user);
    db.query('delete from users where ?',[user],(error,results)=>{
        res.send(JSON.stringify({"status": 200, "error": null, "message": results}));
    })
}
exports.updateuser = (req,res)=>{
    var user = {id:req.params.id};
    var updateData = req.body;
    let sql = "update users SET ? where ?";
    let query = db.query(sql, [updateData,user],(err, results) => {
        if(err) throw err;
        res.send(JSON.stringify({"status": 200, "error": null, "message": results}));
    });
}
