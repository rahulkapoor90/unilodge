<template>
    <div class="complete">
        <div class="card text-center">
            <div class="card-header">
                <img src="@/assets/flywire.png" height="20px"/>
            </div>
            <div class="card-body">
                <img v-if="client.logo" :src="client.logo" :alt="client.name" />
                <h4>{{ ui.title }}
                  <small class="text-muted">{{ ui.subTitle }}</small>
                </h4>
                <div v-if="formattedAmount" class="payment-info" :class="result.status">
                    <h3>
                      <small>Your payment for</small>
                      {{ formattedAmount }}
                      <small v-if="result.status==='success'">was successful!</small>
                      <small v-else-if="result.status==='pending'">must now be sent to Flywire</small>
                      <small v-else>was unsucessful!</small>
                    </h3>
                </div>
                <ul class="list-group list-group-flush">
                    <li v-if="displayParameters.length > 0" class="list-group-item">
                        <dl>
                        <template v-for="p in displayParameters">
                            <dt :key="p.key + '_dt'">{{ p.label }}</dt>
                            <dd :key="p.key + '_dl'">{{ p.value }}</dd>
                        </template>
                            <dt>Payment Refrerence</dt>
                            <dd>{{ result.reference }}</dd>
                        </dl>
                    </li>
                </ul>
            </div>
            <div class="card-footer">
                <button v-if="isError" class="btn btn-primary" v-on:click="onRetry">Try Again</button>
                <img v-else src="@/assets/flywire.png" height="20px"/>
            </div>
        </div>
    </div>
</template>

<script>

import { mapGetters, mapState } from 'vuex'

export default {
    name: 'complete',
    computed: {
        ...mapState({
          ui: 'ui',
          result: 'result'
        }),
        ...mapGetters([
          'formattedAmount',
          'client',
          'displayParameters',
          'isError'
       ])
    },
    methods: {
      onRetry: function() {
        this.$router.push('/');
      }
    }
}
</script>

<style lang="scss">
    .complete {
        width: 400px;
        margin: 50px auto;

        .card-body {
            padding-bottom: 0;
        }
    }
    .error, .cancel, .failure {
      background-color: #D3556B;
    }
    .pending {
      background-color: #EDD462;
    }
    .success {
      background-color: #48B985;
    }
</style>

