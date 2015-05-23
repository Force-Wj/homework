define([
	'base/element',
	'{pro}base/util.js',
	'{pro}base/regular.js',
  ],function(e,du,regular){
		var page,
			emptyAnswer ={name:""},
			emptyQuestion = [
				{title:'',answer:[emptyAnswer],result:0,type:0},
				{title:'',answer:[emptyAnswer],type:1,result:[true]}
			];

		page ={
			__init:function(){
				this.__initNode();
				this.__initData();
			},
			__initNode:function(){
				this._userName = e._$get("userName");
	  			this._userPwd = e._$get("userPwd");
	  			this._nickName = e._$get("nickName");
	  			this._userType = e._$get("userType");
			},
			__initData:function(){
				this.__index = 0;
				if(location.pathname.indexOf('edit')!== -1){
					du._$requestByREST("/rest/teacher/getBank", {
			            type:"json",
			            method:"get",
			            data: {id:du.getidTag()},
			            onerror : this.__cbGetData._$bind(this),
			            onload: this.__cbGetData._$bind(this)
			        });
				}else{
					this.__edit = true;
					this.__isNew = true;
					this.__data ={
						name:'',
						desc:'',
						type:0,
						question:[du.clone(emptyQuestion[0])]
					}
					this.__initTemplate();
				}	
				
			},

			__cbGetData: function(data){
				if(data.code ===200){
					this.__edit = false;
					this.__data = data.data;
					this.__data.question = JSON.parse(data.data.question)
					this.__oldData = du.clone(this.__data);
					this.__isNew = false;
					this.__initTemplate();
				}else{
					du.showError("error")
				}
					// this.__data ={
					// 	id:1,
					// 	name:'终极必杀考试题',
					// 	desc:'要是能重来 我要选李白，几百年前做的好坏 没那么多人猜',
					// 	type:1,
					// 	question:[
					// 		{title:'这题正确答案是A',type:0,answer:[{name:"我是1选项"},{name:"我是2选项"},{name:"我是3选项"}],result:1},
					// 		{title:'这题正确答案是2',type:0,answer:[{name:"我是1选项"},{name:"我是2选项"},{name:"我是3选项"}],result:2},
					// 		{title:'这题正确答案是3',type:1,answer:[{name:"我是1选项"},{name:"我是2选项"},{name:"我是3选项"},{name:"我是4选项a"}],result:[true,false,true,false]},
					// 		{title:'这题正确答案是3',type:1,answer:[{name:"我是1选项"},{name:"我是2选项"},{name:"我是3选项"},{name:"我是4选项a"}],result:[true,false,true,false]},
					// 		{title:'这题正确答案是3',type:1,answer:[{name:"我是1选项"},{name:"我是2选项"},{name:"我是3选项"},{name:"我是4选项a"}],result:[true,false,true,false]},
					// 		{title:'这题正确答案是3',type:1,answer:[{name:"我是1选项"},{name:"我是2选项"},{name:"我是3选项"},{name:"我是4选项a"}],result:[true,false,true,false]},
					// 		{title:'这题正确答案是3',type:1,answer:[{name:"我是1选项"},{name:"我是2选项"},{name:"我是3选项"},{name:"我是4选项a"}],result:[true,false,true,false]},
					// 		{title:'这题正确答案是3',type:1,answer:[{name:"我是1选项"},{name:"我是2选项"},{name:"我是3选项"},{name:"我是4选项a"}],result:[true,false,true,false]},
					// 		{title:'这题正确答案是3',type:1,answer:[{name:"我是1选项"},{name:"我是2选项"},{name:"我是3选项"},{name:"我是4选项a"}],result:[true,false,true,false]},
					// 		{title:'这题正确答案是3',type:1,answer:[{name:"我是1选项"},{name:"我是2选项"},{name:"我是3选项"},{name:"我是4选项a"}],result:[true,false,true,false]}
					// 	]
					// };
				
			},
			__initTemplate:function(){
				var that = this;

				/**
				 * 自定义过滤方法
				 * transType 转化题库类型
				 * transAlphabet 数字转A B C
				 * transResult 显示自定义题目答案 
				 */	
				Regular.filter('transType', function( value ){
					   return du.transType(value);
					}).filter('transAlphabet', function( value ){
					   return du.transAlphabet(value);
					}).filter('transResult',function(value){
						// 单选传入int 多选传数组
						if(du._$isNumber(value)===true){
							return du.transAlphabet(value)
						}else{
							var str ="";
							value.forEach(function(element,index,arr){
								if(element===true){
									str += du.transAlphabet(index)+"、";
								}
							});
						return str.slice(0,-1);

						}
					}
				)
				
				var appRegular = Regular.extend({
				  template: '#main'
				});
				
				var component = new appRegular({
					/**
					 * 初始化参数 
					 * questions 题目内容
					 * index 初始题目偏移量 从第一题开始
					 * tab tab信息显示 0：题库基本信息 1：题目列表
					 * isNew 是否是新建 true/false
					 */
					data: {
						questions:this.__data,
						index:this.__index,
						edit:this.__edit,
						tab:0,
						isNew:this.__isNew,
					},
					//编辑题库操作
					editBank:function(){
						this.data.edit = true;
					},
					//取消编辑题库操作
					cancelEditBank:function(){
						that.__data = du.clone(that.__oldData);
						this.data.questions = that.__data;
						this.data.edit = false;
					},
					saveBank:function(){
						var self = this;
						var cb = function(){
							du.showSuccess("保存成功");
							if(that.__isNew === true){
								setTimeout(function(){location.href="/qBank"},3000)
							}else{
								setTimeout(function(){location.reload()},3000)
							}
							
						}
						that.__validate(this.data.questions,cb)
					},
					// 切换单选多选
					changeTag:function(index){
						var data =	this.data.questions.question[index],
							type = data.type;
						data.answer = [du.clone(emptyAnswer)];
						if(type === "0"){
							this.data.questions.question[index].result = 0;
						}else{
							this.data.questions.question[index].result=[true];
						}
						
					},
					//增删问题选项
					addAnswer:function(index){
						var data = this.data.questions.question[index];
						if(data.answer.length>8){
							du.showError("最多添加8个选项");
							return;
						}
						data.answer.push(du.clone(emptyAnswer));
						if(data.type === "1"){
							data.result.push(false);
						}
					},
					rmAnswer:function(index,offset){
						var data = this.data.questions.question[index];
						if(data.answer.length<2){
							du.showError("至少添加一个选项");
							return;
						}
						data.answer.splice(offset,1);
						if(data.type === "1"){
							data.result.splice(offset,1);
						}
					},
					// 增删问题
					addQuestion:function(){

						this.data.questions.question.push(du.clone(emptyQuestion[0]));
						this.data.index =  this.data.questions.question.length-1;
					},
					delQuestion:function(index){
						var total = this.data.questions.question.length;
						if(total == 1){
							this.data.questions.question[0] = du.clone(emptyQuestion[0]);
						}else{
							if(index +1 == total){
								this.data.index --;
							}
							this.data.questions.question.splice(index,1);
						}
							
					},
					//保存题库
					saveUser:function(){
						var cb = function(){
							du.showSuccess("保存成功");
							if(that.__isNew === true){
								setTimeout(function(){location.href="/userManage"},3000)
							}else{
								setTimeout(function(){location.reload()},3000)
							}
							
						}
						var data = {
	  					username:this._userName.value.trim(),
	  					password:this._userPwd.value.trim(),
	  					name:this._nickName.value.trim(),
	  					type:this._userType.value.trim()
	  				}
						that.__validate(data,cb)
					}
				});
				component.$inject('#app'); 
			},
			// 数据验证
			__validate:function(data,cb){
				if(this._userName.value.trim() ==""){
					du.showError("用户名不能为空");
					return false;
				}
				if(this._userPwd.value.trim() ==""){
					du.showError("密码不能为空");
					return false;
				}
				if(this._nickName.value.trim() ==""){
					du.showError("昵称不能为空");
					return false;
				}
				if(this._userType.value.trim() ==""){
					du.showError("请选择用户类型");
					return false;
				}
				return true;
				this.__doPost(data,cb);
			},

			/**
			 * 提交保存题库请求
			 * @param  {Function} cb 成功请求后的回调
			 * @return     
			 */
			__doPost:function(data,cb){
				du._$requestByREST("/rest/register", {
		            type:"json",
		            method:"post",
		            data: data,
		            onerror : this.__cbDoPost._$bind(this,cb),
		            onload: this.__cbDoPost._$bind(this, cb)
		        });	
			},
			__cbDoPost:function(cb,data){
				if(data&&data.code ===200){
					cb();
				}else{
					du.showError(data.message||'网络异常')
				}
			}
		}  
	page.__init();
});
	
