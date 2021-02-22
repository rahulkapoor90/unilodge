
export default {
  getRecipient(portalCode, env) {
    return fetch(`https://payment.${env == 'demo' ? 'demo.' : ''}flywire.com/v3/recipients/${portalCode}`)
      .then(response => {
        return response.json();
      })
  }
}