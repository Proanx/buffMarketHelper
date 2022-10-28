/**
 * @description 将传入的秒数转为字符串描述
 * @author Pronax
 * @export
 * @param {number} sec  秒数
 * @return {*}  {string}
 */
export function toDescribeText(sec: number): string {
    if (!sec) { return "刚刚"; }
    const unit: string[] = ["秒", "分", "小时", "天", "年"];
    const weightArray: number[] = [60, 60, 24, 365, 0];
    const suffix: string = sec < 0 ? "后" : "前";
    let degitArray: Array<number> = new Array(5);
    let weight: number = 1;
    sec = Math.abs(sec);
    for (let index = 0; index < degitArray.length && sec > 0; index++) {
        degitArray[index] = sec / weight % weightArray[index];
        sec -= degitArray[index] * weight;
        weight *= weightArray[index];
    }

    let str: string = "";
    let prevDegit: number = 0;
    for (let index = degitArray.length - 1; index >= 0; index--) {
        if (degitArray[index]) {
            if (prevDegit - index > 1) {
                str += "零";
            }
            str += degitArray[index] + unit[index];
            prevDegit = index;
        }
    }
    return str.replace(/分$/, "分钟") + suffix;
}

/**
 * @description 返回时间戳B与A的差，单位秒
 * ! 传入的时间戳单位必须为毫秒
 * @author Pronax
 * @export
 * @param {number} tsA
 * @param {number} [tsB]    默认使用Date.now()
 * @return {*}  {number}
 */
export function secDiff(tsA: number, tsB?: number): number {
    !tsB && (tsB = Date.now());
    return Math.round((tsB - tsA) / 1000);
}

/**
 * @description 获取中国本地化格式的日期字符串
 * @author Pronax
 * @export
 * @param {(string | number)} [timestamp]
 * @return {*}  {string}
 */
export function toCnDateStr(timestamp?: string | number): string {
    !timestamp && (timestamp = Date.now());
    return new Date(timestamp).toLocaleDateString("zh-CN", { hour12: false });
}

/**
 * @description 获取中国本地化格式的时间字符串
 * @author Pronax
 * @export
 * @param {(string | number)} [timestamp]
 * @return {*}  {string}
 */
export function toCnTimeStr(timestamp?: string | number): string {
    !timestamp && (timestamp = Date.now());
    return new Date(timestamp).toLocaleTimeString("zh-CN", { hour12: false });
}

/**
 * @description 获取中国本地化格式的完整时间字符串
 * @author Pronax
 * @export
 * @param {(string | number)} [timestamp]
 * @return {*}  {string}
 */
export function toCnStr(timestamp?: string | number): string {
    !timestamp && (timestamp = Date.now());
    return new Date(timestamp).toLocaleString("zh-CN", { hour12: false });
}

/**
 * @description 获取北京时间的时间戳
 * @author Pronax
 * @export
 * @return {*}  {number}
 */
export function getBeijingTs(): number {
    let local = new Date();
    let diff = (local.getTimezoneOffset() - (-480)) * 60 * 1000;
    return local.valueOf() + diff;
}