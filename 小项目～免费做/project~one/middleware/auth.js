module.exports = async (ctx, next) => {
    if (ctx.session.username) {
        await next();
    } else {
        ctx.body = { ok: 0, msg: '未登录' };
    }
};
