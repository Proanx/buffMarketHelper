
const https = require('https');
const fs = require('fs');

// 用于抓取github贡献人员名单
// [
//     {
//         "author": {
//             "id": 1270155,
//             "login": "UnluckyNinja",
//             "avatar": "https://avatars.githubusercontent.com/u/1270155?s=60&v=4",
//             "path": "/UnluckyNinja",
//             "hovercard_url": "/users/UnluckyNinja/hovercard"
//         },
//         "total": 2,
//         "weeks": [  // Array<Object>用于绘制图表的信息
//             {
//                 "w": 1615075200,    // when
//                 "a": 661,           // add
//                 "d": 0,             // del
//                 "c": 1              // commit
//             },
//         ]
//     },
// ]
async function getContributorsData() {
    return new Promise((resolve, reject) => {
        https.get('https://github.com/Proanx/buffMarketHelper/graphs/contributors-data', {
            proxy: '127.0.0.1:7890',    // clash default proxy
            headers: {
                "accept": "application/json",
                "x-requested-with": "XMLHttpRequest",
                "Referer": "https://github.com/Proanx/buffMarketHelper/graphs/contributors",
                "Referrer-Policy": "no-referrer-when-downgrade"
            },
            timeout: 10000
        }, res => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                let json = JSON.parse(data);
                let contributorList = [];
                for (const item of json) {
                    if (item.author.avatar == undefined) {
                        throw new Error("存在未获取到头像的用户，请重试");
                    }
                    let begin = Date.now() / 1000 | 1, commit = add = del = 0;
                    for (const statistics of item.weeks) {
                        if (statistics.c >= 1) {    // 过滤无意义部分
                            begin = Math.min(statistics.w, begin);
                        }
                        commit += statistics.c;
                        add += statistics.a;
                        del += statistics.d;
                    }
                    let obj = {
                        "nickname": item.author.login,
                        "link": `https://github.com${item.author.path}`,
                        "avatar": item.author.avatar,
                        "begin": begin,
                        "commit": commit,
                        "detail": {
                            "add": add,
                            "del": del,
                        }
                    }
                    contributorList.push(obj);
                }
                contributorList.sort((a, b) => a.begin - b.begin);
                resolve(contributorList);
            });
        }).on('error', err => {
            reject(err);
        });
    });
}

async function main() {
    let contributorList = await getContributorsData();
    console.log(contributorList);
    fs.writeFile("./src/assets/Contributor.json", JSON.stringify(contributorList), (err) => {
        if (err) {
            console.log("写入文件时报错", err);
            throw new Error(err);
        }
    });
}

main();
