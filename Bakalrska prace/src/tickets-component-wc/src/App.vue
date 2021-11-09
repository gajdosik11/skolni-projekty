<!-- xgajdo24
  komponenta, vytvoří dočasné datat aby bylo zamezeno erorům, příjmá data od angularu,
  přeposílá dál do individuálních instancí komponenty Ticket
-->
<template>
  <div id="ticket-wrapper">
    <div v-for="(ticket) in tickets" v-bind:key="ticket.id">
      <Ticket :ticket="ticket"/>
    </div>
  </div>
</template>

<script>

import Ticket from './components/Ticket.vue'

export default {
  name: 'VueTickets',
  components: {
    Ticket
  },
  props: {
    tickets: {
      default: function () {
        return [
          {
            "date": "2000-01-01",
            "id": "Default1",
            "name": "Default",
            "uId": "Default",
            "place": "Default",
            "waves": [
              {
                "count": "1",
                "eventId": "Default",
                "expiration": "2000-01-01",
                "id": "Default",
                "price": "1",
                "soldOut": false,
                "tickets": [
                  {
                    "available": false,
                    "id": "Default",
                    "paid": false,
                    "price": "1",
                    "uId": "Default",
                    "used": false,
                    "waveId": "Default"
                  }
                ]
              }
            ]
          },
          {
            "date": "2000-01-01",
            "id": "Default2",
            "name": "Default",
            "uId": "Default",
            "place": "Default",
            "waves": [
              {
                "count": "1",
                "eventId": "Default",
                "expiration": "2000-01-01",
                "id": "Default",
                "price": "1",
                "soldOut": false,
                "tickets": [
                  {
                    "available": false,
                    "id": "Default",
                    "paid": false,
                    "price": "1",
                    "uId": "Default",
                    "used": false,
                    "waveId": "Default"
                  }
                ]
              }
            ]
          }
        ]
      }
    },
  }
}
</script>

<style>
@import "./../node_modules/bootstrap/dist/css/bootstrap.css";
@import "./../node_modules/bootstrap-vue/dist/bootstrap-vue.css";

svg {
  width: 100% !important;
  height: 100% !important;
}

#ticket-wrapper {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  text-align: left;
  background-color: #fff;
  box-sizing: border-box;
  max-width: 813px;
}
</style>
