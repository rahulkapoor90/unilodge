<template>
    <div class="quick-pay">
        <div class="card text-center">
            <div class="card-header">
                <img src="@/assets/flywire.png" height="20px"/>
            </div>
            <div class="card-body">
                <img v-if="client.logo" :src="client.logo" :alt="client.name" />
                <h4>{{ ui.title }}
                  <small class="text-muted">{{ ui.subTitle }}</small>
                </h4>
                <div v-if="formattedAmount" class="payment-info">
                    <h3>
                      <small>Please pay</small>
                      {{ formattedAmount }}
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
          payment: 'payment'
        }),
        ...mapGetters([
          'formattedAmount',
          'client',
          'displayParameters',
          'canPay',
          'shouldRequestPayerInfo'
       ])
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
          amount: this.payment.amount,
          recipientFields: this.payment.parameters,
          requestPayerInfo: this.shouldRequestPayerInfo,
          nonce: new Date().getMilliseconds(),
          firstName: this.payment.firstName,
          lastName: this.payment.lastName,
          email: this.payment.email,
          phone: this.payment.phone,
          address: this.payment.address,
          city: this.payment.city,
          country: this.payment.country,

          callbackUrl: this.payment.callbackUrl,
          callbackId: this.payment.callbackId,

          onInvalidInput: (errs) => {
            that.$store.dispatch('paymentSetErrors', errs)
          },
          onCompleteCallback: (args) => {
            // eslint-disable-next-line no-console
            console.log(args);
            that.$store.dispatch('complete', args);
            that.$router.push('complete');
          },
          onCancel: () => {
              // eslint-disable-next-line no-console
              console.info("Payment window cancelled");
          },
          payables: this.payment.payables
        }

        popup = window.FlywirePayment.initiate(config);
        popup.render();
      }
    }
}
</script>

<style lang="scss">
    .quick-pay {
        width: 400px;
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

    .errors {
        background-color: #D3556B;
        color: white;
        margin: 5px -20px;
        padding: 5px 0;

        span {
            display: block;
        }
    }

    
</style>

