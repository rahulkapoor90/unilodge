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
    getQueryStringValues: function () {
        let values = {};

        _.chain(window.location.search)
            .replace('?', '')
            .split('&')
            .forEach(kvp => {
                var s = _.split(kvp, "=");
                values[s[0]] = decodeURIComponent(s[1]);
            })
            .value();

        return values;
    }
}