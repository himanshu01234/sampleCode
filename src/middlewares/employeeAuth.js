const jwt = require('jsonwebtoken');
const { AdminEmployee } = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');

const auth = async (req, res, next) => {
  var token = req != undefined ? req.headers['authorization'] : false;
  if (!token) return new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  else {
    let tokenArray = token.split(' ');
    var decoded = await jwt.verify(tokenArray[1], config.jwt.secret);
    req.user = decoded;
    let result = await AdminEmployee.findOne({
      _id: decoded.sub,
      status: 'active',
    }).populate('employeeRole');

    if (!result) {
      req.user = undefined;
      return new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    } else if (result) {
      let moduleArray = req.originalUrl.split('/');
      let code = moduleArray[moduleArray.length - 1].split('?');
      code = code[0];
      console.log('llllllll', req.originalUrl, code, result.employeeRole.modules.includes(code));
      if (result.employeeRole && result.employeeRole.modules.includes(code)) {
        req.user = result;
        next();
      } else {
        console.log('object in else');
        req.user = undefined;
        return new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
      }
    }
  }
};

module.exports = auth;
