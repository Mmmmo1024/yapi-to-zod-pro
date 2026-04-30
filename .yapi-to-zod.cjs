module.exports = () => {
	return {
		/** 头部内容，可以填写导入的请求实例等 */
		header: [],

		/**
		 * RESTful 模式配置（可选）
		 * - 'auto': 自动判断（默认），根据路径是否包含动词来识别
		 * - 'force': 强制使用 RESTful 命名规则，所有接口都会加上 HTTP 方法前缀
		 * - 'legacy': 强制使用传统命名规则，保持原有行为
		 * - 自定义函数: (path, method) => boolean，返回 true 表示使用 RESTful 命名
		 * 
		 * 示例场景：
		 * 1. 如果你的项目所有 API 都是 RESTful 风格，使用 'force'
		 * 2. 如果你的项目混合了 RESTful 和传统风格，使用 'auto'（默认）或自定义函数
		 * 3. 如果你想保持原有行为，使用 'legacy'
		 */
		// restfulMode: 'auto',     // 默认：自动判断
		// restfulMode: 'force',    // 强制所有接口使用 RESTful 命名
		// restfulMode: 'legacy',   // 强制所有接口使用传统命名

		// 自定义判断示例：只对特定路径使用 RESTful 命名
		// restfulMode: (path, method) => {
		//   // 只对 /v2/ 开头的路径使用 RESTful 命名
		//   return path.startsWith('/v2/');
		// },

		/**
		 * 生成请求内容
		 * @param {object} param0
		 * @param {string} param0.comment 注释内容
		 * @param {string} param0.interfaceName 接口名，大驼峰
		 * @param {string | undefined} reqModelName 请求参数模型名
		 * @param {string | undefined} resModelName 返回数据模型名
		 * @param {string} param0.apiPath 接口路径
		 * @param {object} yapiData
		 */
		genRequest({ comment, interfaceName, reqModelName, resModelName, apiPath }, yapiData) {
			// 如果是RESTful风格，接口路径需要自行把动态参数替换成想要的参数
		}
	};
};
