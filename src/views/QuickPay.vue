<template>
    <div class="quick-pay">
        <div class="card text-center">
            <div class="card-body">
                <img v-if="client.logo" :src="client.logo" :alt="client.name" />
                <h4>{{ ui.title }}
                  <small class="text-muted">{{ ui.subTitle }}</small>
                </h4>
                <div v-if="ui.isLoading" class="spinner-border">
                    <span class="sr-only">Loading...</span>
                </div>
                <div v-if="selectedMethod" class="payment-info">
                    <h3>
                      <small>Please pay</small>
                      {{ selectedMethod.value.total.formatted }} {{ portal.recipient.currency.code }}
                    </h3>
                </div>
                <div v-if="ui.configErrors.length > 0 || ui.paymentErrors.length > 0" class="errors">
                    <template v-for="e in ui.configErrors">
                        <span :key="e">{{ e }}</span>
                    </template>
                    <template v-for="e in ui.paymentErrors">
                        <span :key="e.id">{{ e.msg }}</span>
                    </template>
                </div>
                <div v-if="paymentMethods.length > 0" class="payment-method">
                    <h3 class="payment-select">
                      <small>Select your payment method:</small>
                    </h3>
                    <div v-for="paymentMethod in paymentMethods" :key="paymentMethod.description.title" class="list-group">
                        <label class="list-group-item">
                            <div class="d-flex align-items-center justify-content-between payment-methods">
                                <div>
                                    <input v-model="selectedMethod" :value="paymentMethod" type="radio">
                                </div>
                                <div class="description">
                                    <p class="mb-1">{{ paymentMethod.description.title }}</p>
                                    <small class="mb-1">{{ paymentMethod.description.sub }}</small>
                                </div>
                                <div class="amount">
                                    <p>{{ paymentMethod.value.total.formatted }} {{ portal.recipient.currency.code }}</p>
                                    <span v-if="paymentMethod.value.processing.amount > 0" class="badge badge-light">includes a {{ paymentMethod.value.processing.formatted }} fee</span>
                                </div>
                            </div>
                        </label>
                    </div>
                </div>
                <ul class="list-group list-group-flush">
                    <li v-if="displayParameters.length > 0" class="list-group-item">
                        <dl>
                            <template v-for="p in displayParameters">
                                <dt :key="p.key + '_dt'">{{ p.label }}</dt>
                                <dd :key="p.key + '_dl'">{{ p.value }}</dd>
                            </template>
                        </dl>
                    </li>
                </ul>
            </div>
            <div class="card-footer">
                <button :disabled="!canPay" class="btn btn-primary" v-on:click="onPay">Make Payment</button>
            </div>
        </div>
    </div>
</template>

<script>

import { mapGetters, mapState } from 'vuex'

export default {
    name: 'quick-pay',
    computed: {
        ...mapState({
          ui: 'ui',
          portal: 'portal',
          payment: 'payment',
          selectedMethod: 'selectedMethod'
        }),
        ...mapGetters([
          'paymentMethods',
          'client',
          'displayParameters',
          'canPay'
       ]),
       selectedMethod: {
           get() {
               return this.$store.state.selectedMethod;
           },
           set(value) {
               this.$store.commit("SET_SELECTED_METHOD", value)
           }
       }
    },
    mounted: function() {
      this.$store.dispatch('load');
    },
    methods: {
      onPay: function() {
        var that = this;
        var popup = null;

        this.$store.dispatch('pay')

        const config = {
          env: this.portal.env,
          recipientCode: this.portal.portalCode,
          amount: this.selectedMethod.value.total.amount,
          recipientFields: this.payment.parameters,
          requestPayerInfo: true,
          requestRecipientInfo: true,
          skipCompletedSteps: true,
          nonce: new Date().getMilliseconds(),
          firstName: this.payment.firstName,
          lastName: this.payment.lastName,
          email: this.payment.email,
          phone: this.payment.phone,
          address: this.payment.address,
          city: this.payment.city,
          country: this.payment.country,

          callbackUrl: "https://hooks.zapier.com/hooks/catch/5305195/borwi0j/",
          callbackId: `${this.payment.callbackId}&a[29]=${this.selectedMethod.value.processing.amount}`,

          paymentOptionsConfig: {
              filters: {
                  type: this.selectedMethod.type,
                  currency: this.selectedMethod.currency
              }
          },
          onInvalidInput: (errs) => {
            that.$store.dispatch('paymentSetErrors', errs)
          },
          onCompleteCallback: (args) => {
            that.$store.dispatch('complete', args);
            that.$router.push('complete');
          }
        }

        popup = window.FlywirePayment.initiate(config);
        popup.render();
      }
    }
}
</script>

<style lang="scss">
    .quick-pay {
        max-width: 700px;
        margin: 50px auto;

        .card-body {
            padding-bottom: 0;
        }
    }
    h4, h3 {
        small {
            display: block;
            font-size: 1rem;
        }
    }
    .payment-info, .form-group { 
        margin-top: 8px;
    }
    
    .payment-info{ 
        background-color: #1274C4;
        color: white;
        margin: 0 -20px;
        padding: 5px 0;
    }

    .payment-select {
        margin: 10px 0;
    }

    .payment-method{ 
        margin: 0px;
        padding: 5px 0;

        .payment-methods>div {
            padding:5px;
        }
    }

    .description{
        text-align: left;
    }

    .amount{
        text-align: right;
        white-space: nowrap;
    }

    .form-check{
        text-align: left;
    }

    .errors {
        background-color: #D3556B;
        color: white;
        margin: 5px -20px;
        padding: 5px 0;

        span {
            display: block;
        }
    }

    .spinner-border {
        margin:10px;
    }
    
</style>

