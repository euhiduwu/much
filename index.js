const express = require('express');
const axios = require('axios');
const dayjs = require('dayjs');
const notifier = require('node-notifier');
const app = express();
const port = 3000;

// app.get('/', (req, res) => res.send('Hello World!'))

const preDay = dayjs().add(0, 'days').format('YYYY-MM-DD');
const today = dayjs().format('YYYY-MM-DD');
const yesterDay = 0, preFiveDay = 0;
let cur = 0;
const code = 'sh000001';
const needNotifier = true;
const target = 3500;

// 开 收 最高 最低
const getData = () => {
    axios.get(`http://web.ifzq.gtimg.cn/appstock/app/fqkline/get?param=${code},day,${today},,320,qfq`)
        .then(res => {
            let data = res.data.data.sh000001.day;
            // console.log(data);
            let length = data.length;
            if (length) {
                cur = parseFloat(data[length - 1][2]);
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
};

getData();

setInterval(function(){
    getData();
}, 5000);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
