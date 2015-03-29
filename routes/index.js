var express = require('express');
var router = express.Router();
var teacher =require('./teacher/index');
var admin =require('./admin/index');
var student =require('./student/index');




router.doMapping = function(req,res){
	var path = req.path,
		username = req.session.username,
		userType = req.session.userType;
	//登出
	if(path === "/logout"){
		 console.log("----logout");
		req.session.destroy();
		res.redirect('/login');
		return;
	}
	if(path === "/login" && typeof(username) ==='undefined'){
		res.render('login', { title: '用户登陆'});
		return;
	}
	if(typeof(username) === 'undefined'){
		res.redirect('/login');
	}else{
		if(userType === 1){
			switch(path){
				case '/login':
					res.redirect('/main');
					break;
				case '/main':
			  		teacher.mainPage(req,res);
				  	break;
			  	case '/qBank':
			  		teacher.bankPage(req,res);
			  		break;
		  		case '/paper':
			  		teacher.paperPage(req,res);
			  		break;
		  		case '/add':
		  			teacher.addPage(req,res);
		  			break;
	  			case '/edit':
		  			teacher.editPage(req,res);
		  			break;
	  			case '/addPaper':
		  			teacher.addPaperPage(req,res);
		  			break;
	  			case '/viewPaper':
		  			teacher.viewPaperPage(req,res);
		  			break;
	  			case '/rest/teacher/questionsList':
	  				teacher.getList(req,res);
					break;
				case '/rest/teacher/paperList':
	  				teacher.getPaperList(req,res);
					break;
				default:
			  		res.render('error',{message:"找不到该页",error:{status:404}});
			}
		}
		if(userType === 0){
			switch(path){
				case '/login':
					res.redirect('/main');
					break;
				case '/main':
			  		admin.mainPage(req,res);
				  	break;
			  	case '/userManage':
			  		admin.listPage(req,res);
			  		break;
		  		case '/add':
		  			admin.addPage(req,res);
		  			break;
	  			case '/edit':
	  				admin.editPage(req,res);
	  				break;
	  			case '/rest/admin/userList':
	  				admin.getList(req,res);
					break;
				default:
			  		res.render('error',{message:"找不到该页",error:{status:404}});
			}
		}
		if(userType === 2){
			switch(path){
				case '/login':
					res.redirect('/main');
					break;
				case '/main':
			  		student.mainPage(req,res);
				  	break;
			  	case '/test':
			  		student.listPage(req,res);
			  		break;
	  			case '/doTest':
	  				student.editPage(req,res);
	  				break;
  				case '/result':
	  				student.getResult(req,res);
					break;
	  			case '/rest/student/userList':
	  				student.getList(req,res);
					break;

				default:
			  		res.render('error',{message:"找不到该页",error:{status:404}});
			}
		}
		
	}

}

router.doLogin = function(req, res){
	// console.log("----");
	// var db = require("db");
	// db.create(function(err, cnt){
	// 	console.log("OKKKK");
	// 	db.createTable(cnt, function(){
	// 		console.log("create");
	// 	});
	// });
	if(req.body.username=== "teacher"){
		req.session.username = "teacher"; 
		req.session.userType = 1; 
		console.log('aaa ',req.session)
		res.redirect('/main');
	}else if(req.body.username=== "admin"){
		req.session.username = "admin"; 
		req.session.userType = 0; 
		console.log('aaa ',req.session)
		res.redirect('/main');
	}else if(req.body.username=== "student"){
		req.session.username = "student"; 
		req.session.userType = 2; 
		console.log('aaa ',req.session)
		res.redirect('/main');
	}else{
		res.render('login', { title: '用户登陆',errors:'error'})
	}
};


module.exports = router;
