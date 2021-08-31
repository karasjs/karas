let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWgAAAFoCAYAAAB65WHVAAANuUlEQVR4Xu3ZsaktZBSE0W0HYmRgC2obBlZgJCa2YB12YGwBtmIoYmAZ8uSl5s7/rQM3ONmeNT/DgfvJ+RAgQIDA/1Lgk//lVY4iQIAAgTPQHsErAl/e3a939/ndffpKKDnaAga63f8r6X+4u5/v7o+7+8JAv1KrHAbaG3hB4M+7+/Huvr67nwz0C5XK8EHAQHsHLwh8+NX818dxNtAvNCrDvwIG2kN4SeDDOBvolxqNZzHQ8QfwWHwD/Vih9TgGuv4C3spvoN/qM5/GQOefwFMABvqpOoUx0N7ASwIG+qU2ZfFPQm/gKQED/VSdwvgF7Q2sC3x2d199DPHd3X34+/bj97/v7vf1gO7vChjobvevJP/m7n77jzC/3N33rwSVoydgoHudS0yAwIiAgR4pypkECPQEDHSvc4kJEBgRMNAjRTmTAIGegIHudS4xAQIjAgZ6pChnEiDQEzDQvc4lJkBgRMBAjxTlTAIEegIGute5xAQIjAgY6JGinEmAQE/AQPc6l5gAgREBAz1SlDMJEOgJGOhe5xITIDAiYKBHinImAQI9AQPd61xiAgRGBAz0SFHOJECgJ2Cge51LTIDAiICBHinKmQQI9AQMdK9ziQkQGBEw0CNFOZMAgZ6Age51LjEBAiMCBnqkKGcSINATMNC9ziUmQGBEwECPFOVMAgR6Aga617nEBAiMCBjokaKcSYBAT8BA9zqXmACBEQEDPVKUMwkQ6AkY6F7nEhMgMCJgoEeKciYBAj0BA93rXGICBEYEDPRIUc4kQKAnYKB7nUtMgMCIgIEeKcqZBAj0BAx0r3OJCRAYETDQI0U5kwCBnoCB7nUuMQECIwIGeqQoZxIg0BMw0L3OJSZAYETAQI8U5UwCBHoCBrrXucQECIwIGOiRopxJgEBPwED3OpeYAIERAQM9UpQzCRDoCRjoXucSEyAwImCgR4pyJgECPQED3etcYgIERgQM9EhRziRAoCdgoHudS0yAwIiAgR4pypkECPQEDHSvc4kJEBgRMNAjRTmTAIGegIHudS4xAQIjAgZ6pChnEiDQEzDQvc4lJkBgRMBAjxTlTAIEegIGute5xAQIjAgY6JGinEmAQE/AQPc6l5gAgREBAz1SlDMJEOgJGOhe5xITIDAiYKBHinImAQI9AQPd61xiAgRGBAz0SFHOJECgJ2Cge51LTIDAiICBHinKmQQI9AQMdK9ziQkQGBEw0CNFOZMAgZ6Age51LjEBAiMCBnqkKGcSINATMNC9ziUmQGBEwECPFOVMAgR6Aga617nEBAiMCBjokaKcSYBAT8BA9zqXmACBEQEDPVKUMwkQ6AkY6F7nEhMgMCJgoEeKciYBAj0BA93rXGICBEYEDPRIUc4kQKAnYKB7nUtMgMCIgIEeKcqZBAj0BAx0r3OJCRAYETDQI0U5kwCBnoCB7nUuMQECIwIGeqQoZxIg0BMw0L3OJSZAYETAQI8U5UwCBHoCBrrXucQECIwIGOiRopxJgEBPwED3OpeYAIERAQM9UpQzCRDoCRjoXucSEyAwImCgR4pyJgECPQED3etcYgIERgQM9EhRziRAoCdgoHudS0yAwIiAgR4pypkECPQEDHSvc4kJEBgRMNAjRTmTAIGegIHudS4xAQIjAgZ6pChnEiDQEzDQvc4lJkBgRMBAjxTlTAIEegIGute5xAQIjAgY6JGinEmAQE/AQPc6l5gAgREBAz1SlDMJEOgJGOhe5xITIDAiYKBHinImAQI9AQPd61xiAgRGBAz0SFHOJECgJ2Cge51LTIDAiICBHinKmQQI9AQMdK9ziQkQGBEw0CNFOZMAgZ6Age51LjEBAiMCBnqkKGcSINATMNC9ziUmQGBEwECPFOVMAgR6Aga617nEBAiMCBjokaKcSYBAT8BA9zqXmACBEQEDPVKUMwkQ6AkY6F7nEhMgMCJgoEeKciYBAj0BA93rXGICBEYEDPRIUc4kQKAnYKB7nUtMgMCIgIEeKcqZBAj0BAx0r3OJCRAYETDQI0U5kwCBnoCB7nUuMQECIwIGeqQoZxIg0BMw0L3OJSZAYETAQI8U5UwCBHoCBrrXucQECIwIGOiRopxJgEBPwED3OpeYAIERAQM9UpQzCRDoCRjoXucSEyAwImCgR4pyJgECPQED3etcYgIERgQM9EhRziRAoCdgoHudS0yAwIiAgR4pypkECPQEDHSvc4kJEBgRMNAjRTmTAIGegIHudS4xAQIjAgZ6pChnEiDQEzDQvc4lJkBgRMBAjxTlTAIEegIGute5xAQIjAgY6JGinEmAQE/AQPc6l5gAgREBAz1SlDMJEOgJGOhe5xITIDAiYKBHinImAQI9AQPd61xiAgRGBAz0SFHOJECgJ2Cge51LTIDAiICBHinKmQQI9AQMdK9ziQkQGBEw0CNFOZMAgZ6Age51LjEBAiMCBnqkKGcSINATMNC9ziUmQGBEwECPFOVMAgR6Aga617nEBAiMCBjokaKcSYBAT8BA9zqXmACBEQEDPVKUMwkQ6AkY6F7nEhMgMCJgoEeKciYBAj0BA93rXGICBEYEDPRIUc4kQKAnYKB7nUtMgMCIgIEeKcqZBAj0BAx0r3OJCRAYETDQI0U5kwCBnoCB7nUuMQECIwIGeqQoZxIg0BMw0L3OJSZAYETAQI8U5UwCBHoCBrrXucQECIwIGOiRopxJgEBPwED3OpeYAIERAQM9UpQzCRDoCRjoXucSEyAwImCgR4pyJgECPQED3etcYgIERgQM9EhRziRAoCdgoHudS0yAwIiAgR4pypkECPQEDHSvc4kJEBgRMNAjRTmTAIGegIHudS4xAQIjAgZ6pChnEiDQEzDQvc4lJkBgRMBAjxTlTAIEegIGute5xAQIjAgY6JGinEmAQE/AQPc6l5gAgREBAz1SlDMJEOgJGOhe5xITIDAiYKBHinImAQI9AQPd61xiAgRGBAz0SFHOJECgJ2Cge51LTIDAiICBHinKmQQI9AQMdK9ziQkQGBEw0CNFOZMAgZ6Age51LjEBAiMCBnqkKGcSINATMNC9ziUmQGBEwECPFOVMAgR6Aga617nEBAiMCBjokaKcSYBAT8BA9zqXmACBEQEDPVKUMwkQ6AkY6F7nEhMgMCJgoEeKciYBAj0BA93rXGICBEYEDPRIUc4kQKAnYKB7nUtMgMCIgIEeKcqZBAj0BAx0r3OJCRAYETDQI0U5kwCBnoCB7nUuMQECIwIGeqQoZxIg0BMw0L3OJSZAYETAQI8U5UwCBHoCBrrXucQECIwIGOiRopxJgEBPwED3OpeYAIERAQM9UpQzCRDoCRjoXucSEyAwImCgR4pyJgECPQED3etcYgIERgQM9EhRziRAoCdgoHudS0yAwIiAgR4pypkECPQEDHSvc4kJEBgRMNAjRTmTAIGegIHudS4xAQIjAgZ6pChnEiDQEzDQvc4lJkBgRMBAjxTlTAIEegIGute5xAQIjAgY6JGinEmAQE/AQPc6l5gAgREBAz1SlDMJEOgJGOhe5xITIDAiYKBHinImAQI9AQPd61xiAgRGBAz0SFHOJECgJ2Cge51LTIDAiICBHinKmQQI9AQMdK9ziQkQGBEw0CNFOZMAgZ6Age51LjEBAiMCBnqkKGcSINATMNC9ziUmQGBEwECPFOVMAgR6Aga617nEBAiMCBjokaKcSYBAT8BA9zqXmACBEQEDPVKUMwkQ6AkY6F7nEhMgMCJgoEeKciYBAj0BA93rXGICBEYEDPRIUc4kQKAnYKB7nUtMgMCIgIEeKcqZBAj0BAx0r3OJCRAYETDQI0U5kwCBnoCB7nUuMQECIwIGeqQoZxIg0BMw0L3OJSZAYETAQI8U5UwCBHoCBrrXucQECIwIGOiRopxJgEBPwED3OpeYAIERAQM9UpQzCRDoCRjoXucSEyAwImCgR4pyJgECPQED3etcYgIERgQM9EhRziRAoCdgoHudS0yAwIiAgR4pypkECPQEDHSvc4kJEBgRMNAjRTmTAIGegIHudS4xAQIjAgZ6pChnEiDQEzDQvc4lJkBgRMBAjxTlTAIEegIGute5xAQIjAgY6JGinEmAQE/AQPc6l5gAgREBAz1SlDMJEOgJGOhe5xITIDAiYKBHinImAQI9AQPd61xiAgRGBAz0SFHOJECgJ2Cge51LTIDAiICBHinKmQQI9AQMdK9ziQkQGBEw0CNFOZMAgZ6Age51LjEBAiMCBnqkKGcSINATMNC9ziUmQGBEwECPFOVMAgR6Aga617nEBAiMCBjokaKcSYBAT8BA9zqXmACBEQEDPVKUMwkQ6AkY6F7nEhMgMCJgoEeKciYBAj0BA93rXGICBEYEDPRIUc4kQKAnYKB7nUtMgMCIgIEeKcqZBAj0BAx0r3OJCRAYETDQI0U5kwCBnoCB7nUuMQECIwIGeqQoZxIg0BMw0L3OJSZAYETAQI8U5UwCBHoCBrrXucQECIwIGOiRopxJgEBPwED3OpeYAIERAQM9UpQzCRDoCRjoXucSEyAwImCgR4pyJgECPQED3etcYgIERgQM9EhRziRAoCdgoHudS0yAwIiAgR4pypkECPQEDHSvc4kJEBgRMNAjRTmTAIGegIHudS4xAQIjAgZ6pChnEiDQEzDQvc4lJkBgRMBAjxTlTAIEegIGute5xAQIjAgY6JGinEmAQE/gH0fNE2n4x5LMAAAAAElFTkSuQmCC')
      .end();
  }
};