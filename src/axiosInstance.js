//axiosInstance.js
//导入axios
import axios from 'axios'

//使用axios下面的create([config])方法创建axios实例，其中config参数为axios最基本的配置信息。
const API = axios.create({
	baseURL: 'http://localhost:8888', //请求后端数据的基本地址，自定义
	timeout: 5000                   //请求超时设置，单位ms
})

// 添加请求拦截器
API.interceptors.request.use(config => {
	const token = window.localStorage.getItem('token') // 从 localStorage 中获取 token
	if (token != '') {
		config.headers['token'] = token // 将 token 添加到请求头中
	}
	return config
}, error => {
	return Promise.reject(error)
})

// 导出同步的post方法
const post = (url, params) => {
	return new Promise((resolve, reject) => {
		API.post(url, QS.stringify(params))
			.then(res => {
				resolve(res.data);
			}).catch(err => {
				reject(err.data)
			})
	});
}

//导出我们建立的axios实例模块，ES6 export用法
export default post