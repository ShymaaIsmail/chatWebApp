import http from 'http';
import assert from 'assert';

import '../lib/index.js';

describe('Test Modeso Web Chat', () => {
	it('should return 200', done => {
		http.get('http://127.0.0.1:9080', res => {
			assert.equal(200, res.statusCode);
			done();
		});
	});
});