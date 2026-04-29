export type Numeric = number | string;

/**
 * 获取数据类型
 * @param {any} arg
 */
export function getType(arg: unknown) {
	return Object.prototype.toString.call(arg).slice(8, -1).toLowerCase();
}

/**
 * 判断是否是数组
 * @param {any} arg
 */
export function isArray<T>(arg: unknown): arg is Array<T> {
	return getType(arg) === 'array';
}

/**
 * 是否是数字型数据。包含string类型
 * 注意诸如[1], ['1']等会隐式转为字符'1'
 * @param {any} arg
 */
export function isNumeric(arg: unknown): arg is Numeric {
	return !isArray(arg) && /^[+-]?[0-9]\d*$|^[+-]?[0-9]\d*\.\d+$/g.test(arg as string);
}

/**
 * @description 将下划线命名转换为大驼峰命名
 */
export const toPascalCase = (str: string): string => {
	return str
		.split('_')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join('');
};

/**
 * 判断是否是null数据类型
 * @param {any} arg
 */
export function isNull(arg: unknown): arg is null {
	return getType(arg) === 'null';
}

/**
 * 对象宽松的判断。 不包括null和数组，但是包括HTMLElement，Date等等其他对象
 * @param {any} arg
 */
export function isLooseObject(arg: unknown): arg is Record<PropertyKey, any> {
	return typeof arg === 'object' && !isNull(arg) && !isArray(arg);
}

/**
 * 是否是对象，同isLooseObject
 * 很多时候我们只是使用对象这种类型来方便存储数据而已，这里我们在喜好上采用宽松判断
 * @param {any} arg
 */
export function isObject(arg: unknown): arg is Record<PropertyKey, any> {
	// return Object.prototype.toString.call(arg) === '[object Object]';
	return isLooseObject(arg);
}

/**
 * 无可遍历属性视为空对象
 * @param {any} arg
 */
export function isEmptyObject(arg: unknown): arg is Record<PropertyKey, never> {
	// eslint-disable-next-line @typescript-eslint/ban-types
	return isObject(arg) && !Object.keys(arg as object).length;
}

/**
 * 提取最后一个括号里的内容
 */
export function extractContentInParentheses(text: string): string {
	// 匹配最后一个英文括号 () 或中文括号 （）中的内容
	const regex = /[(（][^)）]*[)）]/g;
	const matches = text.match(regex);

	// 匹配英文括号 () 或中文括号 （）
	if (matches && matches.length > 0) {
		// 提取最后一个匹配项，并去掉括号
		const lastMatch = matches[matches.length - 1];
		return lastMatch.slice(1, lastMatch.length - 1);
	}

	return '';
}

/**
 * 从路径中提取路径参数
 * @param path API 路径,如 /v2/technical_reviews/:id
 * @returns 路径参数数组,如 ['id']
 */
export function extractPathParams(path: string): string[] {
	const params: string[] = [];
	const regex = /:([a-zA-Z_][a-zA-Z0-9_]*)/g;
	let match;
	while ((match = regex.exec(path)) !== null) {
		params.push(match[1]);
	}
	return params;
}

/**
 * 判断是否为 RESTful 风格的路径(包含路径参数或纯名词资源路径)
 * @param path API 路径
 * @returns 是否为 RESTful 路径
 */
export function isRestfulPath(path: string): boolean {
	// 如果包含路径参数，肯定是 RESTful
	if (/:([a-zA-Z_][a-zA-Z0-9_]*)/.test(path)) {
		return true;
	}

	// 提取路径的最后一段
	const cleanPath = path.replace(/^\/v\d+\//, '').replace(/^\//, '');
	const parts = cleanPath.split('/');
	const lastPart = parts[parts.length - 1] || '';

	// 常见动词列表（传统风格通常在路径中包含动词）
	const actionVerbs = [
		'get',
		'post',
		'put',
		'delete',
		'create',
		'update',
		'remove',
		'fetch',
		'add',
		'set',
		'list',
		'query',
		'search',
		'find',
		'check',
		'verify',
		'send',
		'submit',
		'upload',
		'download',
		'import',
		'export',
	];

	// 检查最后一段是否包含动词（不区分大小写）
	const hasVerb = actionVerbs.some((verb) => lastPart.toLowerCase().includes(verb));

	// 如果不包含动词，认为是 RESTful 风格的纯名词资源路径
	return !hasVerb;
}

/**
 * 将路径转换为短横线格式的文件名基础部分
 * @param path API 路径,如 /v2/technical_reviews/:id
 * @returns 短横线格式的名称,如 technical-reviews-by-id
 */
export function pathToHyphenCase(path: string): string {
	// 移除开头的斜杠和版本号前缀
	const cleanPath = path.replace(/^\/v\d+\//, '').replace(/^\//, '');

	// 分割路径
	const parts = cleanPath.split('/');

	// 处理每个部分:将下划线转为短横线,跳过路径参数（除非是最后一部分）
	const processedParts: string[] = [];
	for (let i = 0; i < parts.length; i++) {
		const part = parts[i];
		if (part.startsWith(':')) {
			// 只有当参数是最后一部分时，才添加 by-param
			if (i === parts.length - 1) {
				const paramName = part.substring(1);
				processedParts.push(`by-${paramName.replace(/_/g, '-')}`);
			}
			// 否则跳过中间的路径参数
		} else {
			// 普通路径:将下划线转为短横线
			processedParts.push(part.replace(/_/g, '-'));
		}
	}

	return processedParts.join('-');
}

/**
 * 生成 RESTful 风格的文件名
 * @param method HTTP 方法,如 GET, POST, PUT, DELETE
 * @param path API 路径,如 /v2/technical_reviews/:id
 * @returns 文件名(不含扩展名),如 get-technical-reviews-by-id
 */
export function generateRestfulFileName(method: string, path: string): string {
	const httpMethod = method.toLowerCase();
	const pathName = pathToHyphenCase(path);
	return `${httpMethod}-${pathName}`;
}

/**
 * 将路径转换为大驼峰格式的接口名称基础部分
 * @param path API 路径,如 /v2/technical_reviews/:id
 * @returns 大驼峰格式的名称,如 TechnicalReviewsById
 */
export function pathToPascalCase(path: string): string {
	// 移除开头的斜杠和版本号前缀
	const cleanPath = path.replace(/^\/v\d+\//, '').replace(/^\//, '');

	// 分割路径
	const parts = cleanPath.split('/');

	// 处理每个部分：跳过路径参数（除非是最后一部分）
	const processedParts: string[] = [];
	for (let i = 0; i < parts.length; i++) {
		const part = parts[i];
		if (part.startsWith(':')) {
			// 只有当参数是最后一部分时，才添加 ByParam
			if (i === parts.length - 1) {
				const paramName = part.substring(1);
				processedParts.push('By' + toPascalCase(paramName));
			}
			// 否则跳过中间的路径参数
		} else {
			// 普通路径:转换为大驼峰
			processedParts.push(toPascalCase(part));
		}
	}

	return processedParts.join('');
}

/**
 * 生成 RESTful 风格的接口名称
 * @param method HTTP 方法,如 GET, POST, PUT, DELETE
 * @param path API 路径,如 /v2/technical_reviews/:id
 * @returns 接口名称,如 GetTechnicalReviewsById
 */
export function generateRestfulInterfaceName(method: string, path: string): string {
	const httpMethod = toPascalCase(method.toLowerCase());
	const pathName = pathToPascalCase(path);
	return `${httpMethod}${pathName}`;
}
