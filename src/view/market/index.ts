import SettingPanel from "src/view/_common/SettingPanel";
import NextPage from "src/view/_common/NextPage";
import UserSetting from "src/utils/UserSetting";
import Progress from "./Progress";
import Scale from "./Scale";
import "./market.global.scss";

function init() {

    let settingPanelInit = false;
    let unload = {};
    $(document).ajaxSend(function (event, xhr, header, result) {
        if (/^\/api\/market\/goods/.exec(header.url)) {
            if (!settingPanelInit) {
                settingPanelInit = true;
                SettingPanel.init();
                NextPage.init();
            }
            destroy(unload);
            // unload = Progress.init();
            // header.url += `&page_size=${UserSetting.pageSize}`;
            header.url += `&page_size=4`;
        }
    });

    $(document).ajaxSuccess(function (event, xhr, header, result) {
        if (/^\/api\/market\/goods/.exec(header.url) && result.data && result.data.items.length != 0) {
            // unload["progress"] = Progress.init();
            unload["scale"] = Scale.init(result);
        }
    });

}

function destroy(obj) {
    for (const key in obj) {
        obj[key]();
    }
    obj = {};
}

export default {
    init
}