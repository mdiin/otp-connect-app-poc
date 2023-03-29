var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const debugRouter = require("./routes/debug");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const registerRouter = require("./routes/register");
const initiateRouter = require("./routes/initiate");
const getCycleCountRouter = require("./routes/getCycleCount");
const submitForApprovalRouter = require("./routes/submitForApproval");

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register', registerRouter);
app.use('/initiate', initiateRouter);
app.use('/cycleCount', getCycleCountRouter);
app.use("/submitForApproval", submitForApprovalRouter);
app.use("/debug", debugRouter);

module.exports = app;
