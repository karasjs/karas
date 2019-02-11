build-test:
	@gulp build-test

test-browser:
	@nightwatch --filter test.js

test: build-test test-browser
