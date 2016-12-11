//再设计模型二
var mongoose = require('mongoose')
//引入模式中的模块
var MovieSchema = require('../schemas/movie')
var Movie = mongoose.model('Movie',MovieSchema)

//导出
module.exports = Movie
