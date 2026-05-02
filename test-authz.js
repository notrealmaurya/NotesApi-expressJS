
const http = require('http');

const BASE_URL = 'http://localhost:5000';

async function makeRequest(options, body = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const response = {
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: data ? JSON.parse(data) : null
                    };
                    resolve(response);
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);

        if (body) {
            req.write(JSON.stringify(body));
        }

        req.end();
    });
}

async function registerUser(username, email, password) {
    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/users/signup',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const response = await makeRequest(options, { username, email, password });
    return response;
}

async function createNote(token, title, description) {
    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/notes',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    const response = await makeRequest(options, { title, description });
    return response;
}

async function updateNote(token, noteId, title, description) {
    const options = {
        hostname: 'localhost',
        port: 5000,
        path: `/notes/${noteId}`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    const response = await makeRequest(options, { title, description });
    return response;
}

async function deleteNote(token, noteId) {
    const options = {
        hostname: 'localhost',
        port: 5000,
        path: `/notes/${noteId}`,
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    const response = await makeRequest(options);
    return response;
}

async function runTests() {
    console.log('========================================');
    console.log('  权限控制测试: 用户A vs 用户B');
    console.log('========================================\n');

    try {
        // 1. 注册用户A
        console.log('1. 注册用户A (userA@test.com)');
        const userAResponse = await registerUser('userA', 'userA@test.com', 'password123');
        console.log(`   状态码: ${userAResponse.statusCode}`);
        if (userAResponse.statusCode !== 201) {
            console.log(`   消息: ${userAResponse.body?.message}`);
            console.log('\n提示: 请确保服务器已启动 (npm start) 并且 MongoDB 正在运行');
            process.exit(1);
        }
        const userAToken = userAResponse.body.token;
        const userAId = userAResponse.body.user._id;
        console.log(`   用户ID: ${userAId}`);
        console.log('   ✓ 用户A注册成功\n');

        // 2. 注册用户B
        console.log('2. 注册用户B (userB@test.com)');
        const userBResponse = await registerUser('userB', 'userB@test.com', 'password123');
        console.log(`   状态码: ${userBResponse.statusCode}`);
        const userBToken = userBResponse.body.token;
        const userBId = userBResponse.body.user._id;
        console.log(`   用户ID: ${userBId}`);
        console.log('   ✓ 用户B注册成功\n');

        // 3. 用户A创建笔记
        console.log('3. 用户A创建笔记');
        const noteResponse = await createNote(userAToken, '用户A的私人笔记', '这是只有用户A才能访问的笔记内容');
        console.log(`   状态码: ${noteResponse.statusCode}`);
        const noteId = noteResponse.body._id;
        const noteUserId = noteResponse.body.userId;
        console.log(`   笔记ID: ${noteId}`);
        console.log(`   笔记所属用户ID: ${noteUserId}`);
        console.log('   ✓ 用户A创建笔记成功\n');

        // 4. 验证用户B不能更新用户A的笔记
        console.log('4. 测试权限控制: 用户B尝试更新用户A的笔记');
        const updateByBResponse = await updateNote(userBToken, noteId, '被用户B修改的标题', '被用户B修改的内容');
        console.log(`   状态码: ${updateByBResponse.statusCode}`);
        console.log(`   返回消息: ${updateByBResponse.body?.message}`);
        
        if (updateByBResponse.statusCode === 404 && 
            updateByBResponse.body?.message === "Note not found or unauthorized") {
            console.log('   ✓ 权限控制生效: 用户B无法更新用户A的笔记\n');
        } else {
            console.log('   ✗ 权限控制失效: 用户B竟然可以更新用户A的笔记!\n');
            process.exit(1);
        }

        // 5. 验证用户B不能删除用户A的笔记
        console.log('5. 测试权限控制: 用户B尝试删除用户A的笔记');
        const deleteByBResponse = await deleteNote(userBToken, noteId);
        console.log(`   状态码: ${deleteByBResponse.statusCode}`);
        console.log(`   返回消息: ${deleteByBResponse.body?.message}`);
        
        if (deleteByBResponse.statusCode === 404 && 
            deleteByBResponse.body?.message === "Note not found or unauthorized") {
            console.log('   ✓ 权限控制生效: 用户B无法删除用户A的笔记\n');
        } else {
            console.log('   ✗ 权限控制失效: 用户B竟然可以删除用户A的笔记!\n');
            process.exit(1);
        }

        // 6. 验证用户A可以更新自己的笔记
        console.log('6. 验证正常功能: 用户A更新自己的笔记');
        const updateByAResponse = await updateNote(userAToken, noteId, '用户A更新后的标题', '用户A更新后的内容');
        console.log(`   状态码: ${updateByAResponse.statusCode}`);
        console.log(`   更新后的标题: ${updateByAResponse.body?.title}`);
        
        if (updateByAResponse.statusCode === 200 && 
            updateByAResponse.body?.title === '用户A更新后的标题') {
            console.log('   ✓ 用户A可以正常更新自己的笔记\n');
        } else {
            console.log('   ✗ 用户A无法更新自己的笔记，这是不正常的\n');
            process.exit(1);
        }

        // 7. 验证用户A可以删除自己的笔记
        console.log('7. 验证正常功能: 用户A删除自己的笔记');
        const deleteByAResponse = await deleteNote(userAToken, noteId);
        console.log(`   状态码: ${deleteByAResponse.statusCode}`);
        
        if (deleteByAResponse.statusCode === 202) {
            console.log('   ✓ 用户A可以正常删除自己的笔记\n');
        } else {
            console.log('   ✗ 用户A无法删除自己的笔记，这是不正常的\n');
            process.exit(1);
        }

        console.log('========================================');
        console.log('  所有测试通过! ✓');
        console.log('========================================');
        console.log('\n结论:');
        console.log('- 用户A的笔记受到保护，用户B无法更新或删除');
        console.log('- 权限控制使用了原子操作 (findOneAndUpdate / findOneAndDelete)');
        console.log('- 这确保了权限检查和数据操作在同一个数据库操作中完成');
        console.log('- 避免了竞态条件和权限绕过的风险');

    } catch (error) {
        console.error('\n测试执行出错:', error.message);
        console.log('\n提示: 请确保:');
        console.log('1. MongoDB 正在运行');
        console.log('2. 服务器已启动 (运行 npm start)');
        console.log('3. .env 文件已配置 MONGO_URL 和 SECRET_KEY');
        process.exit(1);
    }
}

runTests();
