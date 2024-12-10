const Koa = require('koa');
// const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser');
const static = require('koa-static');
// const session = require('koa-session');
const open = require('open');
// const onerror = require('koa-onerror');
// const {
//     accessLogger,
//     logger
// } = require('./logger')
// const indexRouter = require('./router');
// const userRouter = require('./router/user');
const fileToExcelRouter = require('./router/file-to-excel');
const app = new Koa();
app.keys = ['some secret hurr'];
// app.use(session({
//     key: 'youngsdream',
//     maxAge: 86400000, //有效期，默认是一天
//     httpOnly: true, //仅服务端修改
//     signed: true, //签名cookie
// }, app));
app.use(bodyParser());
app.use(static(__dirname + '/public'));
app.use(fileToExcelRouter.routes()).use(fileToExcelRouter.allowedMethods());
// app.use(indexRouter.routes()).use(indexRouter.allowedMethods());
// app.use(userRouter.routes()).use(userRouter.allowedMethods());
// onerror(app);
// app.use(accessLogger())



// logger
// app.use(logger())


app.use(async (ctx, next) => {
    console.log('1');
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log('6');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);

});

// x-response-time

app.use(async (ctx, next) => {
    const start = Date.now();
    console.log('2');
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
    console.log('5');
});

// response

// app.use(async (ctx, next) => {
//     console.log('3');
//     ctx.body = 'Hello World';
//     console.log('4');
//     await next();
// });
// // 错误中间件
// app.use(async (ctx, next) => {
//     try {
//         await next();
//     } catch (err) {
//         console.log('错误信息----', err);
//         ctx.status = err.statusCode || err.status || 500;
//         ctx.type = 'json';
//         ctx.body = {
//             ok: 0,
//             message: err.message
//         };
//         // 手动释放错误
//         ctx.app.emit('error', err, ctx);
//     }
// });
// app.use(async (ctx, next) => {
//     // let err = new Error('未授权，不能访问');
//     // err.status = 401;
//     // throw err;
//     ctx.throw(401, '未授权，不能访问', {
//         data: '你需要登录后才能访问～'
//     });
// });
app.on('error', (err, ctx) => {
    logger.error('错误信息', err);
});
app.listen(3003, async () => {
    console.log('Server is running on http://localhost:3003');
    // const { default: open } = await import('open'); // 动态导入 open 模块
    await open('http://localhost:3003'); // 启动后自动打开浏览器
});