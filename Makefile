build-test:
	@gulp build-test

test-chrome:
	@nightwatch --filter test.js

test: build-test test-chrome
