import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import {
	extractPathParams,
	isRestfulPath,
	pathToHyphenCase,
	pathToPascalCase,
	generateRestfulFileName,
	generateRestfulInterfaceName,
} from '../utils/common';
// import * as myExtension from '../../extension';

suite('RESTful API Support Test Suite', () => {
	vscode.window.showInformationMessage('Start RESTful API tests.');

	// 测试用例数据
	const testCases = [
		{
			method: 'POST',
			path: '/v2/technical_reviews',
			description: '创建技术评审',
			expectedFileName: 'post-technical-reviews.ts',
			expectedInterfaceName: 'PostTechnicalReviews',
		},
		{
			method: 'PUT',
			path: '/v2/technical_reviews/:id',
			description: '更新技术评审',
			expectedFileName: 'put-technical-reviews-by-id.ts',
			expectedInterfaceName: 'PutTechnicalReviewsById',
		},
		{
			method: 'DELETE',
			path: '/v2/technical_reviews/:id',
			description: '删除技术评审',
			expectedFileName: 'delete-technical-reviews-by-id.ts',
			expectedInterfaceName: 'DeleteTechnicalReviewsById',
		},
		{
			method: 'GET',
			path: '/v2/technical_reviews',
			description: '获取技术评审列表',
			expectedFileName: 'get-technical-reviews.ts',
			expectedInterfaceName: 'GetTechnicalReviews',
		},
		{
			method: 'GET',
			path: '/v2/technical_reviews/:id',
			description: '获取技术评审详情',
			expectedFileName: 'get-technical-reviews-by-id.ts',
			expectedInterfaceName: 'GetTechnicalReviewsById',
		},
		{
			method: 'POST',
			path: '/v2/technical_reviews/:technical_review_id/review_records',
			description: '创建评审记录',
			expectedFileName: 'post-technical-reviews-review-records.ts',
			expectedInterfaceName: 'PostTechnicalReviewsReviewRecords',
		},
	];

	suite('extractPathParams Tests', () => {
		test('应该从路径中提取单个参数', () => {
			const params = extractPathParams('/v2/technical_reviews/:id');
			assert.deepStrictEqual(params, ['id']);
		});

		test('应该从路径中提取多个参数', () => {
			const params = extractPathParams('/users/:userId/posts/:postId');
			assert.deepStrictEqual(params, ['userId', 'postId']);
		});

		test('没有参数的路径应返回空数组', () => {
			const params = extractPathParams('/v2/technical_reviews');
			assert.deepStrictEqual(params, []);
		});

		test('应该处理带下划线的参数名', () => {
			const params = extractPathParams('/v2/technical_reviews/:technical_review_id');
			assert.deepStrictEqual(params, ['technical_review_id']);
		});
	});

	suite('isRestfulPath Tests', () => {
		test('应该识别包含路径参数的 RESTful 路径', () => {
			assert.strictEqual(isRestfulPath('/v2/technical_reviews/:id'), true);
		});

		test('应该识别纯名词资源路径为 RESTful', () => {
			assert.strictEqual(isRestfulPath('/v2/technical_reviews'), true);
		});

		test('应该识别简单资源路径为 RESTful', () => {
			assert.strictEqual(isRestfulPath('/users'), true);
		});

		test('应该识别嵌套资源路径为 RESTful', () => {
			assert.strictEqual(isRestfulPath('/users/:userId/posts'), true);
		});

		test('应该识别包含多个参数的路径', () => {
			assert.strictEqual(isRestfulPath('/users/:userId/posts/:postId'), true);
		});

		test('应该识别包含动词的路径为非 RESTful（传统风格）', () => {
			assert.strictEqual(isRestfulPath('/api/user/getUserInfo'), false);
		});

		test('应该识别 create 动词路径为非 RESTful', () => {
			assert.strictEqual(isRestfulPath('/api/order/createOrder'), false);
		});

		test('应该识别 fetch 动词路径为非 RESTful', () => {
			assert.strictEqual(isRestfulPath('/api/data/fetchList'), false);
		});

		test('应该识别 upload 动词路径为非 RESTful', () => {
			assert.strictEqual(isRestfulPath('/api/file/uploadFile'), false);
		});

		test('应该识别 query 动词路径为非 RESTful', () => {
			assert.strictEqual(isRestfulPath('/api/search/queryData'), false);
		});
	});

	suite('pathToHyphenCase Tests', () => {
		test('应该将简单路径转换为短横线格式', () => {
			const result = pathToHyphenCase('/v2/technical_reviews');
			assert.strictEqual(result, 'technical-reviews');
		});

		test('应该将包含参数的路径转换为短横线格式', () => {
			const result = pathToHyphenCase('/v2/technical_reviews/:id');
			assert.strictEqual(result, 'technical-reviews-by-id');
		});

		test('应该处理嵌套资源路径', () => {
			const result = pathToHyphenCase(
				'/v2/technical_reviews/:technical_review_id/review_records',
			);
			assert.strictEqual(
				result,
				'technical-reviews-by-technical-review-id-review-records',
			);
		});

		test('应该处理带下划线的路径', () => {
			const result = pathToHyphenCase('/api/user_info');
			assert.strictEqual(result, 'user-info');
		});
	});

	suite('pathToPascalCase Tests', () => {
		test('应该将简单路径转换为大驼峰格式', () => {
			const result = pathToPascalCase('/v2/technical_reviews');
			assert.strictEqual(result, 'TechnicalReviews');
		});

		test('应该将包含参数的路径转换为大驼峰格式', () => {
			const result = pathToPascalCase('/v2/technical_reviews/:id');
			assert.strictEqual(result, 'TechnicalReviewsById');
		});

		test('应该处理嵌套资源路径', () => {
			const result = pathToPascalCase(
				'/v2/technical_reviews/:technical_review_id/review_records',
			);
			assert.strictEqual(result, 'TechnicalReviewsByTechnicalReviewIdReviewRecords');
		});
	});

	suite('generateRestfulFileName Tests', () => {
		testCases.forEach((testCase) => {
			test(`应该为 ${testCase.description} 生成正确的文件名`, () => {
				const fileName = generateRestfulFileName(testCase.method, testCase.path);
				assert.strictEqual(fileName, testCase.expectedFileName.replace('.ts', ''));
			});
		});

		test('不同 HTTP 方法应生成不同的文件名', () => {
			const getFileName = generateRestfulFileName('GET', '/v2/technical_reviews');
			const postFileName = generateRestfulFileName('POST', '/v2/technical_reviews');
			assert.notStrictEqual(getFileName, postFileName);
		});

		test('相同路径不同方法不应产生重复的文件名', () => {
			const fileNames = new Set([
				generateRestfulFileName('POST', '/v2/technical_reviews'),
				generateRestfulFileName('GET', '/v2/technical_reviews'),
				generateRestfulFileName('PUT', '/v2/technical_reviews/:id'),
				generateRestfulFileName('DELETE', '/v2/technical_reviews/:id'),
				generateRestfulFileName('GET', '/v2/technical_reviews/:id'),
			]);
			assert.strictEqual(fileNames.size, 5, '所有文件名应该是唯一的');
		});
	});

	suite('generateRestfulInterfaceName Tests', () => {
		testCases.forEach((testCase) => {
			test(`应该为 ${testCase.description} 生成正确的接口名称`, () => {
				const interfaceName = generateRestfulInterfaceName(
					testCase.method,
					testCase.path,
				);
				assert.strictEqual(interfaceName, testCase.expectedInterfaceName);
			});
		});

		test('不同 HTTP 方法应生成不同的接口名称', () => {
			const getInterfaceName = generateRestfulInterfaceName(
				'GET',
				'/v2/technical_reviews',
			);
			const postInterfaceName = generateRestfulInterfaceName(
				'POST',
				'/v2/technical_reviews',
			);
			assert.notStrictEqual(getInterfaceName, postInterfaceName);
		});

		test('相同路径不同方法不应产生重复的接口名称', () => {
			const interfaceNames = new Set([
				generateRestfulInterfaceName('POST', '/v2/technical_reviews'),
				generateRestfulInterfaceName('GET', '/v2/technical_reviews'),
				generateRestfulInterfaceName('PUT', '/v2/technical_reviews/:id'),
				generateRestfulInterfaceName('DELETE', '/v2/technical_reviews/:id'),
				generateRestfulInterfaceName('GET', '/v2/technical_reviews/:id'),
				generateRestfulInterfaceName(
					'POST',
					'/v2/technical_reviews/:technical_review_id/review_records',
				),
			]);
			assert.strictEqual(interfaceNames.size, 6, '所有接口名称应该是唯一的');
		});
	});

	suite('Integration Tests - 完整测试用例验证', () => {
		test('所有测试用例的文件名和接口名称都不重复', () => {
			const fileNames = testCases.map((tc) =>
				generateRestfulFileName(tc.method, tc.path),
			);
			const interfaceNames = testCases.map((tc) =>
				generateRestfulInterfaceName(tc.method, tc.path),
			);

			// 验证文件名唯一性
			const uniqueFileNames = new Set(fileNames);
			assert.strictEqual(
				uniqueFileNames.size,
				fileNames.length,
				`文件名存在重复: ${fileNames.join(', ')}`,
			);

			// 验证接口名称唯一性
			const uniqueInterfaceNames = new Set(interfaceNames);
			assert.strictEqual(
				uniqueInterfaceNames.size,
				interfaceNames.length,
				`接口名称存在重复: ${interfaceNames.join(', ')}`,
			);
		});

		test('验证每个测试用例的预期输出', () => {
			testCases.forEach((testCase) => {
				const fileName = generateRestfulFileName(testCase.method, testCase.path);
				const interfaceName = generateRestfulInterfaceName(
					testCase.method,
					testCase.path,
				);

				assert.strictEqual(
					fileName,
					testCase.expectedFileName.replace('.ts', ''),
					`${testCase.description} 的文件名不正确`,
				);
				assert.strictEqual(
					interfaceName,
					testCase.expectedInterfaceName,
					`${testCase.description} 的接口名称不正确`,
				);
			});
		});
	});
});

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});
});
