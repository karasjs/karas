build-test:
	@gulp build-test

test:
	@nightwatch --filter test.js
