const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const ApiError = require('../utils/ApiError');

const register = catchAsync(async (req, res) => {
  let user;
  if (req.body.appleLoginId && !req.body.email) {
    user = await userService.getUserByAppleLoginId(req.body.appleLoginId);
    if (user) {
      const tokens = await tokenService.generateAuthTokens(user);
      res.send({ code: 200, message: 'User Login', data: { user, tokens } });
    } else {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Please provide email for register');
    }
  } else {
    user = await userService.createUser(req.body);
    const emailToken = Math.floor(1000 + Math.random() * 9000);
    req.body = { emailToken };
    await userService.updateUserById(user.id, req.body);
    if (!req.body.facebookLoginId && !req.body.googleLoginId && !req.body.appleLoginId && !req.body.linkedInLoginId) {
      await emailService.sendVerifyEmail(user, emailToken);
    }
    const tokens = await tokenService.generateAuthTokens(user);
    res.send({ code: 200, message: 'User registered', data: { user, tokens } });
  }
});

const emailVerify = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.query.userId);
  if (req.query.emailToken == user.emailToken) {
    updateBody = {
      $set: {
        emailToken: 'NULL',
        emailVerified: true,
      },
    };
    await userService.updateUser(user.id, updateBody);
    res.send({ code: 200, message: 'Email verified successfully' });
  } else {
    res.send({ code: 401, message: 'Token Mismatched' });
  }
});

const login = catchAsync(async (req, res) => {
  const { email, password, deviceToken } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password, deviceToken);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ code: 200, message: 'LoggedIn successfully', data: { user, tokens } });
});

const adminLogin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginAdminWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ code: 200, message: 'LoggedIn successfully', data: { user, tokens } });
});

const socialLogin = catchAsync(async (req, res) => {
  const { facebookLoginId, googleLoginId, appleLoginId, linkedInLoginId, email } = req.body;
  let user;
  if (facebookLoginId) {
    user = await authService.loginUserWithFacebook(email, facebookLoginId);
    if (!user) {
      user = await userService.createUser(req.body);
    }
  }
  if (googleLoginId) {
    user = await authService.loginUserWithGoogle(email, googleLoginId);
    if (!user) {
      user = await userService.createUser(req.body);
    }
  }
  if (appleLoginId) {
    user = await authService.loginUserWithApple(email, appleLoginId);
    if (!user) {
      user = await userService.createUser(req.body);
    }
  }
  if (linkedInLoginId) {
    user = await authService.loginUserWithLinkedIn(email, linkedInLoginId);
    if (!user) {
      user = await userService.createUser(req.body);
    }
  }

  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ code: 200, message: 'LoggedIn successfully', data: { user, tokens } });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.send({ code: 200, message: 'Mail sent' });
});

const forgotPasswordForAdmin = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordTokenForEmployee(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.send({ code: 200, message: 'Mail sent' });
});

const resetPassword = catchAsync(async (req, res) => {
  if (req.body.password == req.body.confirmPassword) {
    await authService.resetPassword(req.query.token, req.body.password);
    res.send({ code: 200, message: 'Password reset successfully' });
  } else {
    res.send({ code: 400, message: 'Confirm password should be same' });
  }
});

const resetPasswordForEmployees = catchAsync(async (req, res) => {
  if (req.body.password == req.body.confirmPassword) {
    await authService.resetPasswordForEmployees(req.query.token, req.body.password);
    res.send({ code: 200, message: 'Password reset successfully' });
  } else {
    res.send({ code: 400, message: 'Confirm password should be same' });
  }
});

const changePassword = catchAsync(async (req, res) => {
  await authService.changePassword(req.body.userId, req.body.oldPassword, req.body.newPassword);
  res.send({ code: 200, message: 'Password changed' });
});

module.exports = {
  register,
  emailVerify,
  login,
  adminLogin,
  socialLogin,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  resetPasswordForEmployees,
  changePassword,
  forgotPasswordForAdmin,
};
