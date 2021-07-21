import _ from 'lodash'

export default {
    formatAmount: function (amount, ccy) {
        if (!ccy || isNaN(amount)) {
            return null;
        }

        const numberOfDecimalPlaces = Math.log(ccy.subunit_to_unit) / Math.log(10);

        const options = {
            minimumFractionDigits: numberOfDecimalPlaces,
            maximumFractionDigits: numberOfDecimalPlaces
        }

        return (ccy.symbol_first === true)
            ? (ccy.symbol || ccy.code) + amount.toLocaleString(undefined, options)
            : amount.toLocaleString(undefined, options) + (ccy.symbol || ccy.code);
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