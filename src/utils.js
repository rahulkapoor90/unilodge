import _ from 'lodash'

export default {
    getAmount: function (value, fee, ccy, operator) {
        if (!ccy || isNaN(value) ||  isNaN(fee)) {
            return null;
        }
        const numberOfDecimalPlaces = Math.log(ccy.subunit_to_unit) / Math.log(10);
        const options = {
            minimumFractionDigits: numberOfDecimalPlaces,
            maximumFractionDigits: numberOfDecimalPlaces
        }

        let values = {};

        if (operator == "+") {
            values["unformatted"] = {
                total: (value + fee).toLocaleString(undefined, options),
                fee: fee.toLocaleString(undefined, options)
            };
        } else if (operator == "*") {
            values["unformatted"] = {
                total: (value / (100 - fee) * 100).toLocaleString(undefined, options),
                fee: ((value / (100 - fee) * 100) - value).toLocaleString(undefined, options)
            }
        }
        if (ccy.symbol_first === true) {
            values["formatted"] = {
                total: (ccy.symbol || ccy.code) + values.unformatted.total,
                fee: (ccy.symbol || ccy.code) + values.unformatted.fee
            };        
        } else {
            values["formatted"] ={
                total: values.unformatted.total + (ccy.symbol || ccy.code),
                fee: values.unformatted.fee + (ccy.symbol || ccy.code)
            };
        }
        return values
    },
    getCallbackId: function () {
        let url = _.chain(window.location.search)
            .replace('?', '')    
            .value()
        const encoded = encodeURI(url)
        return encoded
    },
    getQueryStringValues: function () {
        let values = {};

        _.chain(window.location.search)
            .replace('?', '')
            .split('&')
            .forEach(param => {
                let kvp = param.split("=");
                let key = kvp[0];
                let value = decodeURIComponent(kvp[1]);
                let openBrace = key.indexOf("[");
                let closeBrace = key.indexOf("]");
                if (openBrace > 0) {
                    const trimmedKey = key.substring(0, openBrace);
                    if (values.hasOwnProperty(trimmedKey) === false) {
                    values[trimmedKey] = {};
                    }
                    const nestedKey = key.substring(openBrace + 1, closeBrace);
                    values[trimmedKey][nestedKey] = value;
                } else {
                    values[key] = value;
                }
                })       
            .value();

        let sum = 0;
        for (const prop in values.a) {
            sum += parseFloat(values.a[prop], 10);
        }
        values["amount"] = sum         

        return values;
    }
}