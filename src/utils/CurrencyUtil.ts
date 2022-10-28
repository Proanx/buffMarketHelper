import UserSetting from "./UserSetting";
import CurrencyData from "src/assets/CurrencyData.json";

/**
 * @description
 *  小数： "167639.87", "167639", ".87", "87"
 *  整数： "186267",    "186267"
 * @author Pronax
 * @param {string} strPrice
 * @return {*} 
 */
function splitPrice(strPrice: string) {
    let steamCurrencyData = CurrencyData[UserSetting.steamCurrency];
    strPrice = strPrice.replace(steamCurrencyData.strThousandsSeparator, "");
    if (steamCurrencyData.strDecimalSymbol !== ".") {
        strPrice = strPrice.replace(steamCurrencyData.strDecimalSymbol, ".");
    }
    return strPrice.match(/(\d+)(\.(\d{1,2}))?/);
}

/**
 * @description
 * * 根据给定的货币代码添加相应的前缀、后缀
 * * 不对数字进行任何处理
 * @author Pronax
 * @param {string} origin
 * @param {string} [currencyCode=UserSetting.steamCurrency]
 * @return {*}  {string}
 */
function addSymbol(origin: string, currencyCode: string = UserSetting.steamCurrency): string {
    let currencyInfo = CurrencyData[currencyCode];
    if (currencyInfo.bSymbolIsPrefix) {
        return currencyInfo.strSymbol + currencyInfo.strSymbolAndNumberSeparator + origin;
    } else {
        return origin + currencyInfo.strSymbolAndNumberSeparator + currencyInfo.strSymbol;
    }
}

/**
 * @description 将分制单位转换为元，currencyCode有值时会自动添加货币前后缀（toLocale）
 * @author Pronax
 * @param {(number | string)} valueInCents
 * @param {(string | undefined)} [currencyCode=undefined]
 * @param {SymbolType} [symbolType=SymbolType.Decimal]
 * @return {*}  {string}
 */
function formatCurrency(valueInCents: number | string, currencyCode: string | undefined = undefined, symbolType: SymbolType = SymbolType.Decimal): string {
    let integer = `${parseInt(valueInCents = Math.abs(+valueInCents / 100 || 0).toFixed(2), 10)}`;

    if (symbolType != SymbolType.Decimal && currencyCode && CurrencyData[currencyCode]) {
        let currencyInfo = CurrencyData[currencyCode];

        let formatted;

        if (symbolType == SymbolType.Symbolized) {
            formatted = `${valueInCents}`;
        } else {
            const j = (integer.length > 3 ? integer.length % 3 : 0);
            const thousand_formatted = `${j ? integer.substr(0, j) + currencyInfo.strThousandsSeparator : ''}${integer.substr(j).replace(/(\d{3})(?=\d)/g, `$1${currencyInfo.strThousandsSeparator}`)}`;
            const decimal_formatted = `${currencyInfo.strDecimalSymbol}${Math.abs(<number><unknown>valueInCents - +integer).toFixed(2).slice(2)}`;
            formatted = `${thousand_formatted}${currencyInfo.bWholeUnitsOnly ? decimal_formatted.replace(`${currencyInfo.strDecimalSymbol}00`, '') : decimal_formatted}`;
        }

        let currencyReturn = currencyInfo.bSymbolIsPrefix
            ? `${currencyInfo.strSymbol}${currencyInfo.strSymbolAndNumberSeparator}${formatted}`
            : `${formatted}${currencyInfo.strSymbolAndNumberSeparator}${currencyInfo.strSymbol}`;

        if (symbolType != SymbolType.Symbolized) {
            if (currencyCode == 'USD') {
                return currencyReturn + ' USD';
            }
            else if (currencyCode == 'EUR') {
                return currencyReturn.replace(',00', ',--');
            }
        }
        return currencyReturn;
    }
    else {
        return valueInCents;
    }
}

/**
 * @description 计算税额 
 * * 11500 --> {
 * *    "steam_fee": 500,
 * *    "publisher_fee": 1000,
 * *    "fees": 1500,
 * *    "feed": 10000,
 * *    "amount": 11500
 * * }
 * @author Pronax
 * @param {number} amount
 * @return {*} 
 */
function calculateFeeAmount(amount: number) {
    if (!WalletInfo['wallet_fee']) {
        throw new Error("WalletInfo缺少信息");
    }

    let publisherFee = (typeof WalletInfo['wallet_publisher_fee_percent_default'] == 'undefined') ? "0" : WalletInfo['wallet_publisher_fee_percent_default'];

    // Since CalculateFeeAmount has a Math.floor, we could be off a cent or two. Let's check:
    let iterations = 0; // shouldn't be needed, but included to be sure nothing unforseen causes us to get stuck
    let nEstimatedAmountOfWalletFundsReceivedByOtherParty = parseInt(`${(amount - parseInt(WalletInfo['wallet_fee_base'])) / (parseFloat(WalletInfo['wallet_fee_percent']) + parseFloat(publisherFee) + 1)}`);

    let bEverUndershot = false;
    let fees = CalculateAmountToSendForDesiredReceivedAmount(nEstimatedAmountOfWalletFundsReceivedByOtherParty, publisherFee);
    while (fees.amount != amount && iterations < 10) {
        if (fees.amount > amount) {
            if (bEverUndershot) {
                fees = CalculateAmountToSendForDesiredReceivedAmount(nEstimatedAmountOfWalletFundsReceivedByOtherParty - 1, publisherFee);
                fees.steam_fee += (amount - fees.amount);
                fees.fees += (amount - fees.amount);
                fees.amount = amount;
                break;
            }
            else {
                nEstimatedAmountOfWalletFundsReceivedByOtherParty--;
            }
        }
        else {
            bEverUndershot = true;
            nEstimatedAmountOfWalletFundsReceivedByOtherParty++;
        }

        fees = CalculateAmountToSendForDesiredReceivedAmount(nEstimatedAmountOfWalletFundsReceivedByOtherParty, publisherFee);
        iterations++;
    }

    // fees.amount should equal the passed in amount
    fees.feed = fees.amount - fees.fees;
    return fees;
}

/**
 * @description 用于辅助calculateFeeAmount方法
 */
function CalculateAmountToSendForDesiredReceivedAmount(receivedAmount, publisherFee) {
    if (!WalletInfo['wallet_fee']) {
        return receivedAmount;
    }

    publisherFee = (typeof publisherFee == 'undefined') ? 0 : publisherFee;

    let nSteamFee = parseInt(`${Math.floor(Math.max(receivedAmount * parseFloat(WalletInfo['wallet_fee_percent']), +WalletInfo['wallet_fee_minimum']) + parseInt(WalletInfo['wallet_fee_base']))}`);
    let nPublisherFee = parseInt(`${Math.floor(publisherFee > 0 ? Math.max(receivedAmount * publisherFee, 1) : 0)}`);
    let nAmountToSend = receivedAmount + nSteamFee + nPublisherFee;

    return {
        steam_fee: nSteamFee,
        publisher_fee: nPublisherFee,
        fees: nSteamFee + nPublisherFee,
        amount: parseInt(nAmountToSend)
    };
}

/**
 * @description 返回挂刀比例，参数均为分制单位
 * @author Pronax
 * @param {(string | number)} buyPrice
 * @param {(string | number)} sellPrice
 * @return {*} 
 */
function scale(buyPrice: string | number, sellPrice: string | number) {
    let amountInfo = calculateFeeAmount(+sellPrice);
    return (amountInfo.feed / +buyPrice).toFixed(2);
}

/**
 * @description
 * *  eg. valueInCents = 4907856        阿根廷比索，以分为单位
 * *    0: 49078.56                     转换单位为元的字符串
 * *    1: ARS$ 49078.56                带有前缀/后缀
 * *    2: ARS$ 49.078,56               转为当地语言格式
 * @author Pronax
 * @enum {number}
 */
enum SymbolType {
    Decimal,
    Symbolized,
    Localilzation
}

const WalletInfo = {
    "wallet_currency": 23,
    "wallet_country": "CN",
    "wallet_state": "",
    "wallet_fee": "1",
    "wallet_fee_minimum": "1",
    "wallet_fee_percent": "0.05",
    "wallet_publisher_fee_percent_default": "0.10",
    "wallet_fee_base": "0",
    "wallet_balance": "20028",
    "wallet_delayed_balance": "0",
    "wallet_max_balance": "1300000",
    "wallet_trade_max_balance": "1170000"
}

export { splitPrice, addSymbol, formatCurrency, calculateFeeAmount, scale, SymbolType };