# yapi-to-zod README

vscode插件，通过yapi接口返回的数据生成`zod`接口定义文件

## Features

使用

#### 1、配置Yapi帐号信息

在`设置`=>`扩展`=>`Yapi To Zod`中配置yapi帐号信息

<img src="https://gitee.com/limya/pico-imgs/raw/master/imgs/config.png" width="600" />

#### 2、生成配置文件

使用快捷键`F1`或`cmd/ctrl+shift+p`调出命令窗口，输入`YapiToZod`，
选中`YapiToZod: 生成配置文件`命令。

<img src="https://gitee.com/limya/pico-imgs/raw/master/imgs/command.png" width="600" />

<br />

配置文件`.yapi-to-zod.js`内容：

```js
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
		 * @param {string | undefined} param0.reqModelName 请求参数模型名
		 * @param {string | undefined} param0.resModelName 返回数据模型名
		 * @param {string} param0.apiPath 接口路径
		 * @param {string} param0.resource 微服务名称
		 * @param {object} yapiData 接口数据
		 */
		genRequest(
			{
				comment,
				interfaceName,
				reqModelName,
				hasReresModelNresModelNameamesDefine,
				apiPath,
			},
			yapiData,
		) {
			// 如果是RESTful风格，接口路径需要自行把动态参数替换成想要的参数
		},
	};
};
```

**RESTful 模式说明：**

| 模式       | 说明              | 适用场景                                       |
| ---------- | ----------------- | ---------------------------------------------- |
| `auto`     | 自动判断（默认）  | 混合了 RESTful 和传统风格的 API                |
| `force`    | 强制 RESTful 命名 | **所有 API 都是 RESTful 风格，解决文件名冲突** |
| `legacy`   | 传统命名          | 保持原有行为                                   |
| 自定义函数 | 精确控制          | 特殊需求，如只对特定路径使用 RESTful           |

**示例效果：**

```javascript
// 使用 restfulMode: 'force' 时：
POST /v2/technical_reviews           -> post-technical-reviews.ts
GET  /v2/technical_reviews           -> get-technical-reviews.ts
PUT  /v2/technical_reviews/:id       -> put-technical-reviews-by-id.ts
DELETE /v2/technical_reviews/:id     -> delete-technical-reviews-by-id.ts

// ✅ 所有文件名唯一，无冲突！
```

#### 3、生成接口声明文件

在目录中右键选择`YapiToZod：生成Api声明文件`命令

<img src="https://gitee.com/limya/pico-imgs/raw/master/imgs/create-api-file.png" width="400" />

填入接口文档地址，回车创建接口声明文件

<img src="https://gitee.com/limya/pico-imgs/raw/master/imgs/image-20250331100236952.png" width="500" />
<img src="https://gitee.com/limya/pico-imgs/raw/master/imgs/image-20250331100341764.png" width="500" />
