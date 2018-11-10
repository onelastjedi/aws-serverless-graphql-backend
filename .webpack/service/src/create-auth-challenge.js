(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("source-map-support/register");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("aws-sdk");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(0);

var _responses = __webpack_require__(3);

var _ses = __webpack_require__(5);

var Ses = _interopRequireWildcard(_ses);

var _sns = __webpack_require__(6);

var Sns = _interopRequireWildcard(_sns);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.handler = function (event, context, callback) {
  if (event.request.session.length === 0 && event.request.challengeName === 'CUSTOM_CHALLENGE') {
    // Create code for sms
    var smsCode = Math.random().toString(10).substr(2, 6);

    // Send the code via Amazon SNS Global SMS
    var smsParams = {
      Message: smsCode + ' is your DHC login code',
      PhoneNumber: event.request.userAttributes.phone_number
    };

    try {
      Sns.call('publish', smsParams);
      console.log(smsCode);
    } catch (e) {
      callback(null, (0, _responses.buildResponse)(e.statusCode, e));
    }

    // Create token for email
    var emailToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // Send the token via Amazon SES
    var params = {
      Destination: {
        ToAddresses: [event.request.userAttributes.email]
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: 'Login with this link and code from your phone: <a href="' + process.env.AppUrl + 'verify?emailToken=' + emailToken + '">login</a>'
          },
          Text: {
            Charset: 'UTF-8',
            Data: 'Login with this link and code from your phone: ' + process.env.AppUrl + 'verify?emailToken=' + emailToken
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Login to DHC App'
        }
      },
      ReturnPath: 'mi3ta@sent.as',
      Source: 'mi3ta@sent.as'
    };

    try {
      Ses.call('sendEmail', params);
    } catch (e) {
      callback(null, (0, _responses.buildResponse)(e.statusCode, e));
    }

    // Set the return parameters, including the correct answer
    event.response.publicChallengeParameters = {};
    event.response.privateChallengeParameters = {};
    event.response.privateChallengeParameters.answer = emailToken.concat(smsCode);
    event.response.challengeMetadata = 'PASSWORDLESS_CHALLENGE';
  }
  callback(null, event);
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = __webpack_require__(4);

var _stringify2 = _interopRequireDefault(_stringify);

exports.success = success;
exports.failure = failure;
exports.buildResponse = buildResponse;

__webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function success(body) {
  return buildResponse(200, body);
}

function failure(body) {
  return buildResponse(500, body);
}

function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: (0, _stringify2.default)(body)
  };
}

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/json/stringify");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.call = undefined;

__webpack_require__(0);

var _awsSdk = __webpack_require__(1);

var _awsSdk2 = _interopRequireDefault(_awsSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var call = exports.call = function call(action, params) {
  var Ses = new _awsSdk2.default.SES();
  return Ses[action](params).promise();
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.call = undefined;

__webpack_require__(0);

var _awsSdk = __webpack_require__(1);

var _awsSdk2 = _interopRequireDefault(_awsSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var call = exports.call = function call(action, params) {
  var Sns = new _awsSdk2.default.SNS();
  return Sns[action](params).promise();
};

/***/ })
/******/ ])));
//# sourceMappingURL=create-auth-challenge.js.map