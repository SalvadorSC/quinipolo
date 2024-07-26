document.addEventListener("DOMContentLoaded", (event) => {
  // if document has paypal container then render paypal buttons
  console.log("paypalScript.js loaded");
  window.paypal
    .HostedButtons({
      hostedButtonId: "ZF4Z5LG3ANGG4",
    })
    .render("#paypal-container-ZF4Z5LG3ANGG4");
});
