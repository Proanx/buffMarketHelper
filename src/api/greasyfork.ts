
function getLatestVersionNum(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        GM_xmlhttpRequest({
            url: "https://greasyfork.org/scripts/410137/code/410137.meta.js",
            timeout: 30 * 1000,
            method: "get",
            onload: function (res) {
                if (res.status == 200) {
                    let version = res.responseText.match(/@version\s+([\d\.]+)/);
                    if (version) {
                        resolve(version[1]);
                        return;
                    }
                }
                resolve("");
            },
            onerror: function () {
                resolve("");
            },
            ontimeout: function () {
                resolve("");
            }
        });
    });
}


/**
 * @description 
 * * 判断脚本是否存在新版本，为true时表示存在新版
 * ! 脚本版本号必须为点分十进制格式
 * @author Pronax
 * @return {*}  {Promise<boolean>}
 */
async function checkUpdate(): Promise<boolean> {
    let version = GM_info.script.version;
    let latestVersion = await getLatestVersionNum();
    if (latestVersion == "" || latestVersion == version) {
        return false;
    }
    let versionDigits = version.split(".");
    let latestVersionDigits = latestVersion.split(".");
    for (let index = 0; index < Math.min(versionDigits.length, latestVersionDigits.length); index++) {
        if (latestVersionDigits[index].trim() > versionDigits[index].trim()) {
            return true;
        }
    }
    return latestVersionDigits.length > versionDigits.length;
}


export { getLatestVersionNum, checkUpdate };