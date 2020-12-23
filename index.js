const express = require('express');
const axios = require('axios');
const dayjs = require('dayjs');
const notifier = require('node-notifier');
var isBetween = require('dayjs/plugin/isBetween');
dayjs.extend(isBetween);

const app = express();
const port = 5000;

const today = dayjs().format('YYYY-MM-DD'),
    code = 'sh000001',
    needNotifier = true,
    target = 3500,
    timeOut = 2 * 60 * 1000,
    start1 = dayjs(today + ' 09:30:00'),
    end1 = dayjs(today + ' 11:30:00'),
    start2 = dayjs(today + ' 13:30:00'),
    end2 = dayjs(today + ' 15:00:00');

let cur, curTime;

// console.log(start1.format('YYYY-MM-DD HH:mm:ss'));
// console.log(end1.format('YYYY-MM-DD HH:mm:ss'));
// console.log(start2.format('YYYY-MM-DD HH:mm:ss'));
// console.log(end2.format('YYYY-MM-DD HH:mm:ss'));

// 开 收 最高 最低
const getData = () => {
    let time = dayjs();
    if (time.isBetween(start1, end1) || time.isBetween(start2, end2)) {
        axios.get(`http://web.ifzq.gtimg.cn/appstock/app/fqkline/get?param=${code},day,${today},,320,qfq`)
            .then(res => {
                let data = res.data.data.sh000001.day;
                // console.log(data);
                let length = data.length;
                if (length) {
                    cur = parseFloat(data[length - 1][2]);
                    console.log(time.format('HH:mm:ss ' + cur));
                    if (needNotifier && cur < target) {
                        notifier.notify({
                            title: 'My notification',
                            message: cur.toString()
                        });
                    }
                } else {
                    console.log('No Data.');
                }
            });
    }
};

getData();

setInterval(function () {
    getData();
}, timeOut);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
