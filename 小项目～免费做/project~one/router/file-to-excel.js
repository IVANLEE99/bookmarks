const Router = require('@koa/router');
const router = new Router();
// file: readFilesToExcel.js
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
function readFilesToExcel(dirPath, ctx, fn) {
    const workbook = xlsx.utils.book_new();
    const data = [];

    try {
        // 读取指定路径下的所有一级文件夹
        const folders = fs.readdirSync(dirPath).filter(file => {
            return fs.statSync(path.join(dirPath, file)).isDirectory();
        });

        // 循环读取一级文件夹中的文件信息
        folders.forEach(folder => {
            const folderPath = path.join(dirPath, folder);
            const files = fs.readdirSync(folderPath).filter(file => {
                return fs.statSync(path.join(folderPath, file)).isFile();
            });

            files.forEach(file => {
                const filePath = path.join(folderPath, file);
                const stats = fs.statSync(filePath);
                data.push({
                    文件夹: folder,
                    文件名: file,
                    文件类型: path.extname(file),
                    创建时间: stats.mtime
                });
            });
        });
    } catch (error) {
        console.error('读取文件夹失败', error);
        ctx.body = {
            code: 0,
            msg: '读取文件夹失败,请刷新重试！！！'
        };
        return;
    }

    // 将数据写入 Excel
    const worksheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, '文件信息');
    // xlsx.writeFile(workbook, '文件信息.xlsx');
    /* generate Buffer */
    const buf = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

    /* prepare response headers */
    // ctx.statusCode = 200;
    // ctx.setHeader('Content-Disposition', 'attachment; filename="SheetJSNode.xlsx"');
    // ctx.setHeader('Content-Type', 'application/vnd.ms-excel');
    // ctx.body = buf;
    fn(buf);

}
// router.prefix('/file-to-excel');
router.get('/', async (ctx, next) => {
    ctx.redirect('/index.html');
});
router.get('/file-to-excel', async (ctx, next) => {
    ctx.redirect('/index.html');
});
router.post('/file-to-excel', async (ctx, next) => {
    // console.log('/file-to-excel', ctx.request);
    const { file } = ctx.request.body;
    // console.log(file);
    // 从命令行获取路径参数
    const dirPath = file;
    if (!dirPath) {
        ctx.body = {
            code: 0,
            msg: '请提供文件夹路径作为参数,请刷新重试！！！'
        };
        return;
    }

    readFilesToExcel(dirPath, ctx, (buf) => {
        // console.log('file', workbook)
        let date = new Date();
        let str = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日' + ' ' + date.getHours() + '时' + date.getMinutes() + '分' + date.getSeconds() + '秒';
        let fileName = '文件信息-' + str + '.xlsx';
        ctx.set("Access-Control-Expose-Headers", "content-disposition");
        ctx.set(
            "Content-disposition",
            "attachment;filename=" + encodeURIComponent(fileName)
        );
        ctx.body = buf; //返回文件流
    });
});

module.exports = router;