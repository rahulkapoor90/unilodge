import Vue from "vue";
import Vuex from "vuex";
import _ from "lodash";

import dataService from "./api/flywireApi";
import utils from "./utils";

Vue.use(Vuex);

const initialState = {
  ui: {
    isLoading: false,
    title: null,
    subTitle: null,
    configErrors: [],
    paymentErrors: [],
  },
  portal: {
    env: null,
    portalCode: null,
    recipient: {},
  },
  payment: {
    amount: null,
    firstName: null,
    lastName: null,
    email: null,
    phone: null,
    address: null,
    city: null,
    country: null,
    callbackUrl: null,
    callbackId: null,
    payables: [],
    parameters: {},
  },
  result: {
    status: null,
    reference: null,
    paymentMethod: null,
  },
};

const getters = {
  formattedAmount: (state) => {
    return utils.formatAmount(
      state.payment.amount,
      state.portal.recipient.currency
    );
  },
  client: (state) => {
    return {
      name: state.portal.recipient.name,
      logo: state.portal.recipient.logo_url,
    };
  },
  displayParameters: (state) => {
    return _.chain(state.payment.parameters)
      .map((value, key) => {
        var field = _.find(state.portal.recipient.fields, { id: key }) || {
          view_options: {},
        };
        return {
          key,
          value,
          label: field.view_options.label,
          hidden: field.view_options.hidden,
        };
      })
      .filter({ hidden: false })
      .value();
  },
  shouldRequestPayerInfo: (state) => {
    return (
      !state.payment.firstName ||
      !state.payment.lastName ||
      !state.payment.email ||
      !state.payment.phone ||
      !state.payment.address ||
      !state.payment.city ||
      !state.payment.country
    );
  },
  canPay: (state) => {
    return !state.ui.isLoading && state.ui.configErrors.length === 0;
  },
  isError: (state) => {
    return (
      !state.ui.isLoading &&
      state.result.status !== "success" &&
      state.result.status !== "pending"
    );
  },
};

const mutations = {
  UI_START_LOADING(state) {
    state.ui.isLoading = true;
  },
  UI_STOP_LOADING(state) {
    state.ui.isLoading = false;
  },
  UI_INIT(state, payload) {
    (state.ui.title = payload.title), (state.ui.subTitle = payload.subTitle);
  },
  UI_ADD_CONFIG_ERROR(state, payload) {
    state.ui.configErrors.push(payload.error);
  },
  UI_ADD_PAYMENT_ERRORS(state, payload) {
    state.ui.paymentErrors = payload.errors;
  },
  UI_CLEAR_ERRORS(state) {
    state.ui.configErrors = [];
    state.ui.paymentErrors = [];
  },
  PAYMENT_INIT(state, payload) {
    state.payment.amount = payload.amount;
    state.payment.firstName = payload.firstName;
    state.payment.lastName = payload.lastName;
    state.payment.email = payload.email;
    state.payment.phone = payload.phone;
    state.payment.address = payload.address;
    state.payment.city = payload.city;
    state.payment.country = payload.country;
    state.payment.callbackUrl = payload.callbackUrl;
    state.payment.callbackId = payload.callbackId;
    state.payment.parameters = payload.parameters;
    if (payload.payoutCode) {
      state.payment.payables = [
        {
          description:'Split Payment Payout',
          recipient:payload.payoutCode,
          amount:payload.payoutAmount
       },
      ]
    }
    
  },
  PORTAL_INIT(state, payload) {
    state.portal.env = payload.env;
    state.portal.portalCode = payload.portalCode;
    state.portal.recipient = payload.recipient;
  },
  RESULT_INIT(state, payload) {
    (state.result.status = payload.status),
      (state.result.reference = payload.reference),
      (state.result.paymentMethod = payload.paymentMethod);
  },
};

const actions = {
  load: ({ commit }) => {
    commit("UI_START_LOADING");
    let { amount, firstName, lastName, email, phone, address, city, country, env = "demo", code, callbackUrl, callbackId, title, subTitle, payoutCode, payoutAmount, ...params } = utils.getQueryStringValues();

    function addConfigErrorIf(fn, message) {
      if (fn()) {
        commit("UI_ADD_CONFIG_ERROR", { error: message });
      }
    }

    addConfigErrorIf(() => !code, "Code not supplied");
    addConfigErrorIf(() => code && code.length !== 3, `Invalid code (${code}) - must be 3 letters.`);
    addConfigErrorIf(() => !amount, "Payment amount not supplied");
    addConfigErrorIf(() => amount && (isNaN(amount) || parseFloat(amount) <= 0), `Invalid payment amount (${amount})`);
    addConfigErrorIf(() => callbackUrl && !callbackId, `Must supply a callbackId when supplying a callbackUrl.`);
    addConfigErrorIf(() => payoutCode && payoutCode.length !== 3, `Invalid payout code (${payoutCode}) - must be 3 letters.`);
    addConfigErrorIf(() => payoutCode && !payoutAmount, `Must supply a payoutAmount when supplying a payoutCode.`);
    addConfigErrorIf(() => payoutAmount && (isNaN(payoutAmount) || parseFloat(payoutAmount) <= 0), `Invalid payout amount (${payoutAmount})`);

    commit("PAYMENT_INIT", { amount: parseFloat(amount), firstName, lastName, email, phone, address, city, country, callbackUrl, callbackId, payoutCode, payoutAmount: parseFloat(payoutAmount), parameters: params });
    commit("UI_INIT", { title, subTitle });

    const recipientPromise = dataService.getRecipient(code, env);

    Promise.all([recipientPromise]).then((values) => {
      addConfigErrorIf(() => !values[0].id, `Client not found (${code})`);

      commit("PORTAL_INIT", { env, portalCode: code, recipient: values[0] });
      commit("UI_STOP_LOADING");
    });
  },
  paymentSetErrors: ({ commit }, value) => {
    commit("UI_ADD_PAYMENT_ERRORS", {
      errors: value,
    });
  },
  pay: ({ commit }) => {
    commit("UI_CLEAR_ERRORS");
  },
  complete: ({ commit }, value) => {
    let { reference, status, payment_method: paymentMethod } = value;

    commit("RESULT_INIT", {
      status,
      reference,
      paymentMethod,
    });
  },
};

const debug = process.env.NODE_ENV !== "production";

const store = new Vuex.Store({
  strict: debug,
  state: initialState,
  getters,
  mutations,
  actions,
});

export default store;
