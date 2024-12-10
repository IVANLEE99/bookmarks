const Router = require('@koa/router');
const router = new Router();

router.get('/', async (ctx, next) => {
    ctx.body = '首页路由';
});

module.exports = router;