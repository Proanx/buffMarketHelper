/**
 * 发起接入请求
 * @param  {[Object]} data     需要传递的用户信息            
 */
export function Tucao(data?: object): void {
    const productId = 450213;
    let form = document.createElement("form");
    form.id = "txc-form";
    form.name = "form";
    form.target = "_blank";
    document.body.appendChild(form);

    // 设置相应参数 
    for (let key in data) {
        let input = document.createElement("input");
        input.type = "text";
        input.name = key;
        input.value = data[key];
        // 将该输入框插入到 form 中 
        form.appendChild(input);
    }
    // form 的提交方式 
    form.method = "POST";
    // form 提交路径 
    form.action = "https://support.qq.com/product/" + productId;
    // 对该 form 执行提交 
    form.submit();
    // 删除该 form 
    document.body.removeChild(form);
}

export function grabClientData(): object {
    return {
        url: location.pathname + location.hash,
        version: GM_info.script.version,
        plugin: `[${GM_info.scriptHandler}/${GM_info.version}]${getBrowserName()}`,
        ts: GM_info.script.lastModified,
        // ua: navigator.userAgent
    }
}

export function fullClientData(): object {
    let search = document.querySelector("#j_search input[name=search]");
    let keyword = "";
    if (search) {
        // @ts-ignore
        keyword = search.value;
    }
    return {
        version: GM_info.script.version,
        lastModified: GM_info.script.lastModified,
        scriptManager: `[${GM_info.scriptHandler}/${GM_info.version}]`,
        broswer: getBrowserName(),
        ua: navigator.userAgent,
        url: location.pathname + location.hash,
        "keyword": keyword
    }
}

function getBrowserName(): string {
    let userAgent = navigator.userAgent;
    let regex;
    // The order matters here, and this may report false positives for unlisted browsers.
    if (regex = userAgent.match(/(Firefox\/\d+\.?\d);?/)) {
        // "Mozilla/5.0 (X11; Linux i686; rv:104.0) Gecko/20100101 Firefox/104.0"
        return regex[0];
    } else if (regex = userAgent.match(/Trident\/(\d+\.?\d)[\s;]?/)) {
        // "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729)"
        return `IE/${regex[1]}`;
    } else if (regex = userAgent.match(/Edge\/(\d+\.?\d)[\s;]?/)) {
        // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
        return `Edge (Legacy)/${regex[1]}`;
    } else if (regex = userAgent.match(/Edg\/(\d+\.?\d)[\s;]?/)) {
        // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36 Edg/104.0.1293.70"
        return `Edge (Chromium)/${regex[1]}`;
    } else if (regex = userAgent.match(/Chrome\/(\d+\.?\d)[\s;]?/)) {
        // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36"
        return regex[0];
    } else if (regex = userAgent.match(/Safari\/(\d+\.?\d)[\s;]?/)) {
        // "Mozilla/5.0 (iPhone; CPU iPhone OS 15_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1"
        return `Safari/${regex[1]}`;
    } else {
        return "Other";
    }
}
