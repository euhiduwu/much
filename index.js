const express = require('express');
const axios = require('axios');
const dayjs = require('dayjs');
const notifier = require('node-notifier');
var isBetween = require('dayjs/plugin/isBetween');
dayjs.extend(isBetween);

const app = express();
const port = 5000;

const today = dayjs().format('YYYY-MM-DD'),
    needNotifier = true,
    timeOut = 1.5 * 60 * 1000,
    start1 = dayjs(today + ' 09:30:00'),
    end1 = dayjs(today + ' 11:30:00'),
    start2 = dayjs(today + ' 13:00:00'),
    end2 = dayjs(today + ' 15:00:00');

let cur;

const arr = [
    // {
    //     code: '',
    //     name: '',
    //     base: 0,
    // }
];

// 开 收 最高 最低
const getData = (item) => {
    let time = dayjs();
    if (time.isBetween(start1, end1) || time.isBetween(start2, end2)) {
        axios.get(`http://web.ifzq.gtimg.cn/appstock/app/fqkline/get?param=${item.code},day,${today},,320,qfq`)
            .then(res => {
                let data = res.data.data[item.code].day;
                let length = data.length;
                if (length) {
                    cur = parseFloat(data[length - 1][2]).toFixed(3);
                    let message = `成本: ${item.base}, 现价: ${cur}, ${item.base > cur ?  '下跌' : '上涨'}`;
                    console.log(`${time.format('HH:mm:ss')}, ${item.name}, ${message}`);
                    if (needNotifier && cur < item.base) {
                        notifier.notify({
                            title: item.name,
                            message
                        });
                    }
                } else {
                    console.log('ERROR.');
                    notifier.notify('ERROR.');
                }
            });
    }
};

const sleep = function(time = 0) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    })
};

const processItem = function(item) {
    setInterval(function () {
        getData(item);
    }, timeOut);
};

(async function() {
    for (let i = 0; i < arr.length;) {
        processItem(arr[i]);
        await sleep(30000);
        i++;
    }
})();

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
