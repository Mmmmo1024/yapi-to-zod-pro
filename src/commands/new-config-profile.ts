import { Uri, window, workspace } from 'vscode';
import { CONFIG_FILE_NAME } from '../utils/constant/common';
import { showInfoMsg } from '../utils/message';
import { getProjectRoot } from '../utils/path';

const genConfigTemplate = () => {
	return `module.exports = () => {
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
			{ comment, interfaceName, hasReqDefine, hasResDefine, apiPath, resource },
			yapiData
		) {
			//
		},
		
		/** 响应数据键名配置 */
		// responseKey: 'data',
	};
};`;
};

export default async function newConfigProfile(...contextArgs: any[]): Promise<void> {
	const rootWorkspace = await getProjectRoot();
	const configFileUri = Uri.joinPath(rootWorkspace.uri, CONFIG_FILE_NAME);

	const exists = await workspace.fs.stat(configFileUri).then(
		() => true,
		() => false,
	);
	if (exists) {
		showInfoMsg('文件已存在!');
		return;
	}

	const encoder = new TextEncoder();
	await workspace.fs.writeFile(configFileUri, encoder.encode(genConfigTemplate()));
	await window.showTextDocument(configFileUri);
}
