/**
 * Automated Test Suite for NodeFile Server API & File Operations
 */
const http = require('http');

const BASE_URL = 'http://localhost:5000';

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method: method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {}
    };

    let payload = null;
    if (body) {
      payload = JSON.stringify(body);
      options.headers['Content-Type'] = 'application/json';
      options.headers['Content-Length'] = Buffer.byteLength(payload);
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(data);
        } catch (e) {
          parsed = data;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: parsed
        });
      });
    });

    req.on('error', (err) => reject(err));

    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

async function runTests() {
  console.log('==================================================');
  console.log('🧪 Starting Automated NodeFile Server Tests...');
  console.log('==================================================\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}: ${details}`);
      failed++;
    }
  }

  try {
    // 1. Static Frontend Test
    const homeRes = await makeRequest('GET', '/');
    assert(homeRes.statusCode === 200 && typeof homeRes.data === 'string' && homeRes.data.includes('NodeFile Server'),
      'Serve frontend index.html');

    const cssRes = await makeRequest('GET', '/style.css');
    assert(cssRes.statusCode === 200 && typeof cssRes.data === 'string' && cssRes.data.includes('--primary-orange'),
      'Serve style.css');

    const jsRes = await makeRequest('GET', '/script.js');
    assert(jsRes.statusCode === 200 && typeof jsRes.data === 'string' && jsRes.data.includes('fetchServerStatus'),
      'Serve script.js');

    // 2. Server Status Test
    const statusRes = await makeRequest('GET', '/api/status');
    assert(statusRes.statusCode === 200 && statusRes.data.success === true && statusRes.data.server === 'NodeFile Server',
      'GET /api/status returns server metadata', JSON.stringify(statusRes.data));

    // 3. List Files Test
    const listRes = await makeRequest('GET', '/api/files');
    assert(listRes.statusCode === 200 && listRes.data.success === true && Array.isArray(listRes.data.files),
      'GET /api/files returns list of files', `Count: ${listRes.data.totalFiles}`);

    // 4. Create File Test
    const createRes = await makeRequest('POST', '/api/files', {
      filename: 'automated_test.txt',
      content: 'Line 1: Created by automated test suite.'
    });
    assert(createRes.statusCode === 201 && createRes.data.success === true,
      'POST /api/files creates new file', JSON.stringify(createRes.data));

    // 5. Read File Test
    const readRes = await makeRequest('GET', '/api/files/automated_test.txt');
    assert(readRes.statusCode === 200 && readRes.data.success === true && readRes.data.content.includes('Line 1: Created by'),
      'GET /api/files/:filename reads file content', JSON.stringify(readRes.data));

    // 6. Append to File Test
    const appendRes = await makeRequest('POST', '/api/files/automated_test.txt/append', {
      content: 'Line 2: Appended test content.'
    });
    assert(appendRes.statusCode === 200 && appendRes.data.success === true,
      'POST /api/files/:filename/append appends content', JSON.stringify(appendRes.data));

    // Verify appended content
    const verifyAppendRes = await makeRequest('GET', '/api/files/automated_test.txt');
    assert(verifyAppendRes.data.content.includes('Line 2: Appended test content.'),
      'Verified appended content persisted');

    // 7. Rename File Test
    const renameRes = await makeRequest('PUT', '/api/files/automated_test.txt', {
      newFilename: 'automated_renamed.txt'
    });
    assert(renameRes.statusCode === 200 && renameRes.data.success === true && renameRes.data.newFilename === 'automated_renamed.txt',
      'PUT /api/files/:filename renames file', JSON.stringify(renameRes.data));

    // 8. File Exists Test (True)
    const existsTrueRes = await makeRequest('GET', '/api/files/automated_renamed.txt/exists');
    assert(existsTrueRes.statusCode === 200 && existsTrueRes.data.exists === true,
      'GET /api/files/:filename/exists returns true for existing file');

    // 9. File Exists Test (False)
    const existsFalseRes = await makeRequest('GET', '/api/files/non_existent_file_999.txt/exists');
    assert(existsFalseRes.statusCode === 200 && existsFalseRes.data.exists === false,
      'GET /api/files/:filename/exists returns false for missing file');

    // 10. Delete File Test
    const deleteRes = await makeRequest('DELETE', '/api/files/automated_renamed.txt');
    assert(deleteRes.statusCode === 200 && deleteRes.data.success === true,
      'DELETE /api/files/:filename deletes file', JSON.stringify(deleteRes.data));

    // Verify file is gone
    const verifyDeletedRes = await makeRequest('GET', '/api/files/automated_renamed.txt/exists');
    assert(verifyDeletedRes.data.exists === false,
      'Verified file was deleted from disk');

    // 11. Error Handling: Duplicate File
    const dupRes = await makeRequest('POST', '/api/files', {
      filename: 'sample.txt',
      content: 'This should fail because sample.txt exists.'
    });
    assert(dupRes.statusCode === 409 && dupRes.data.success === false,
      'POST /api/files prevents duplicate file creation with 409 Conflict');

    // 12. Error Handling: Empty Filename
    const emptyNameRes = await makeRequest('POST', '/api/files', {
      filename: '',
      content: 'Valid content'
    });
    assert(emptyNameRes.statusCode === 400 && emptyNameRes.data.success === false,
      'POST /api/files rejects empty filename with 400 Bad Request');

    // 13. Error Handling: Empty Content
    const emptyContentRes = await makeRequest('POST', '/api/files', {
      filename: 'empty_content.txt',
      content: ''
    });
    assert(emptyContentRes.statusCode === 400 && emptyContentRes.data.success === false,
      'POST /api/files rejects empty content with 400 Bad Request');

    // 14. Security: Path Traversal Prevention
    const traversalRes = await makeRequest('GET', '/api/files/..%2F..%2Fpackage.json');
    assert((traversalRes.statusCode === 400 || traversalRes.statusCode === 404) && traversalRes.data.success === false,
      'Path Traversal attempt is safely rejected');

  } catch (err) {
    console.error('Unexpected test execution error:', err);
    failed++;
  }

  console.log('\n==================================================');
  console.log(`📊 Test Results: ${passed} Passed, ${failed} Failed`);
  console.log('==================================================');
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
