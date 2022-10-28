export default class JsonResult {
    code: number;
    status: boolean;
    data: any;
    message: string;
    shortMsg: string;   // 短提示

    get msg(): string {
        return this.message || JsonResult.tempMsg[this.code] || this.smsg;
    }

    get smsg(): string {
        return this.shortMsg || JsonResult.tempShortMsg[this.code];
    }

    static Success(p?): JsonResult {
        let param = Object.assign({
            "code": 200,
            "status": true,
            "data": {},
            "shortMsg": "请求成功",
            "message": ""
        }, p);
        return new JsonResult(param.code, param.status, param.data, param.shortMsg, param.message);
    }

    static Failed(p?): JsonResult {
        let param = Object.assign({
            "code": 400,
            "status": false,
            "data": {},
            "shortMsg": "",
            "message": ""
        }, p);
        return new JsonResult(param.code, param.status, param.data, param.shortMsg, param.message);
    }

    constructor(code, status, data = {}, shortMsg = "", message = "") {
        this.code = code;
        this.status = status;
        this.data = data;
        this.shortMsg = shortMsg;
        this.message = message;
    }

    static readonly tempMsg = {
        0: "访问steam失败，请检查网络连接性",
        200: "无法处理结果，请尝试重新加载",
        204: "根据你的设置，已忽略这次请求",
        400: "请求参数错误，服务器无法理解参数",
        404: "页面不存在，无法找到请求的资源",
        408: "访问steam超时，请检查网络连接性",
        429: "请求次数过多，饮个茶再来吧",
        500: "服务器内部错误，请稍后重试"
    };
    static readonly tempShortMsg = {
        0: "无网络",
        200: "请重试",
        204: "已略过",
        400: "参数错误",
        404: "无内容",
        408: "请求超时",
        429: "访问频繁",
        500: "请重试"
    };

}