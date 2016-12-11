var express = require('express');//加载express模块
var path = require('path');//因为我们加入了样式，所以要指定从那里找样式文件

//数据库操作
var mongoose = require('mongoose')
//require('underscore')作用就是 将post过来的object 作为 存储 更新掉已有的object
var _ = require('underscore')
//模型中的对象
var Movie = require('./models/movie')

var port = process.env.PORT || 3000; //设置端口
var app = express();//启动web服务器


//连接本地数据库 moviesproject 数据表为movies
mongoose.connect('mongodb://localhost/movies')




app.set('views','./views/pages');//设置视图的根目录
app.set('view engine','jade');//设置默认的模板引擎，这里使用jade模板引擎

//表单提交的格式化
// app.use(express.bodyParser()) 此bodyParser在新版本的express中不在支持了，要改为下面的形式
app.use(require('body-parser').urlencoded({extended: true}))

//调用样式
app.use(express.static(path.join(__dirname,'public')))

//在jade文件中使用到了moment，所以这里需要引入
app.locals.moment = require('moment')

//然后监听这个端口
app.listen(port)
//再打印一条日志
console.log('project Movies started on port :' + port)

//编写路由
//首页 index page  访问：http://localhost:3000/
app.get('/',function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}

		res.render('index',{
			title:'Movies 首页',
			movies: movies
	}	)
	})
	
})


//详情页 detail page   访问：http://localhost:3000/movie/detail
app.get('/movie/:id',function(req,res){
	var id = req.params.id
	Movie.findById(id,function(err,movie){
		res.render('detail',{
			title:'Movies ' + movie.title,
			movie:movie
		})
	})
	
})


//后台录入页 admin page  访问：http://localhost:3000/admin/movie
app.get('/admin/movie',function(req,res){
	res.render('admin',{
		title:'Movies 后台录入页',
		movie:{
			title:'',
			doctor:'',
			country:'',
			year:'',
			poster:'',
			flash:'',
			summary:'',
			language:''
		}
	})
})

//在后台点击更新时
app.get('/admin/update/:id',function(req,res){
	var id = req.params.id

	if(id){
		Movie.findById(id,function(err,movie){
			res.render('admin',{
				title:'Movie 后台更新页',
				movie:movie
			})
		})
	}
})


//表单的新增和更新数据
app.post('/admin/movie/new',function(req,res){
	var id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie

	if(id !== 'undefined'){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err)
			}
			_movie = _.extend(movie,movieObj)
			_movie.save(function(err,movie){
				if(err){
					console.log(err)
				}
				res.redirect('/movie/' + movie._id)
			})
		})
	}else{
		_movie = new Movie({
			doctor:movieObj.doctor,
			title:movieObj.title,
			country:movieObj.country,
			language:movieObj.language,
			year:movieObj.year,
			poster:movieObj.poster,
			summary:movieObj.summary,
			flash:movieObj.flash
		})
		_movie.save(function(err,movie){
			if(err){
					console.log(err)
			}
			res.redirect('/movie/' + movie._id)
		})
	}
})

//列表页 list page  访问：http://localhost:3000/admin/list
app.get('/admin/list',function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}

		res.render('list',{
			title:'Movies 列表页',
			movies: movies
		})
	})

})

//数据删除的处理
app.delete('/admin/list',function(req,res){
	var id = req.query.id

	if(id){
		Movie.remove({_id: id},function(err,movie){
			if(err){
				console.log(err)
			}else{
				res.json({success: 1})
			}
		})
	}
})