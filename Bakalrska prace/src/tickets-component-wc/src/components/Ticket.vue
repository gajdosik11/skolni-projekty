<!-- xgajdo24
  komponenta příjme datat zpracuje je, nahraje je do předlo a při požadavku na stáhnutí vstupenku zpracuje exportuje do PDF
-->
<!-- šablona pro vstupenku-->
<template>
  <div>
    <div class="ticket-body" ref="printTicket">
      <b-row>
        <b-col class="col-3 qrcode">
          <QrcodeVue renderAs="svg" :value="ticket.id"></QrcodeVue>
        </b-col>
        <b-col class="col-6 main-text">
          <h2><span>{{ ticket.name }}</span></h2>
          <b-row class="date-and-place">
            <div class="date">
              <p>Datum akce: <span class="highlited-3">{{
                  [ticket.date, "YYYY-MM-DD"] | moment("ddd, DD.MM.YYYY")
                }}</span>
              </p>
            </div>
            <div class="place">
              <p>Místo konání: <span class="highlited-3">{{ ticket.place }}</span></p>
            </div>
          </b-row>
          <b-row class="details">
            <b-col>
              <p>Počet vstupů <span class="highlited-3">Jeden</span></p>
            </b-col>
            <div class="vl"></div>
            <b-col>
              <p>V hodnotě<span class="highlited-3">{{ ticket.price }} Kč</span></p>
            </b-col>
          </b-row>
          <b-row class="note">
            <div>
              <p class="small">Vstupenka na událost {{ ticket.name }} byla zakoupena skrze portál ticketeer.</p>
            </div>
          </b-row>
        </b-col>
        <b-col class="rotated col-3">
          <h2><span>{{ ticket.name }}</span></h2>
          <b-row class="date-and-place">
            <div class="date">
              <h6>Datum akce: <span
                  class="font-weight-bold">{{ [ticket.date, "YYYY-MM-DD"] | moment("ddd, DD.MM.YYYY") }}</span></h6>
            </div>
            <div class="place">
              <h6>Místo konání: <span class="font-weight-bold">{{ ticket.place }}</span></h6>
            </div>
          </b-row>
          <b-row class="rotated-details">
            <div>
              <p>Počet vstupů <span class="font-weight-bold">Jeden</span></p>
            </div>
            <div>
              <p>v hodnotě <span class="font-weight-bold">{{ ticket.price }} Kč</span></p>
            </div>
            <div class="w-100 d-flex justify-content-center">
              <h6>{{ ticket.id }}</h6>
            </div>
          </b-row>
        </b-col>
      </b-row>
    </div>
    <b-button ref="button" size="sm" v-on:click="createPDF()" variant="primary">Stáhnout vstupenku</b-button>
  </div>
</template>

<script>

import Vue from 'vue'
import QrcodeVue from 'qrcode.vue'
import {BButton, BCol, BRow} from "bootstrap-vue";
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import html2canvas from '@crcastle/html2canvas';
import jsPDF from 'jspdf';
/* moment zpracovává datumy do hezky čitelného formátu*/
const moment = require('moment')
require('moment/locale/cs')

Vue.use(require('vue-moment'), {
  moment
})

export default {
  name: 'ticket',
  props: {
    ticket: Object,
  },
  methods: {
    /*metoda pro vytvoření pdf a zpracování html šablony na obrázek*/
    createPDF() {
      window.scrollTo(0,0);
      html2canvas(this.$refs.printTicket, {scale: 1}).then(function (canvas) {
        const imgData = canvas.toDataURL('image/png');
        const doc = new jsPDF({
          unit: 'mm',
          format: [162, 585],
          orientation: 'landscape',
        })
        doc.addImage(imgData, 'JPG', 0, 0);
        doc.save('vstupenka.pdf');
      });
    }
  },
  components: {
    QrcodeVue,
    BCol, BRow, BButton
  }
}
</script>

<style scoped>

p {
  font-size: 12px;
}

h2 {
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #000;
  line-height: 0.1em;
  margin: 10px 0 20px;
  font-size: 40px;
}

h2 span {
  background-image: linear-gradient(top, transparent 45%, white 45%, white 65%, transparent 65%);
  background-image: -webkit-linear-gradient(top, transparent 45%, white 45%, white 65%, transparent 65%);
  padding: 0 10px;
}

.margin-bottom {
  margin-bottom: 1rem;
}


.highlited-3 {
  font-size: 20px;
  font-weight: bold;
}


h6 {
  font-size: 12px;
}

.vl {
  border-left: 4px solid black;
  margin-left: -2px;
  flex: 0 0 auto;
}

.row {
  align-items: center;
  width: 100%;
}


.ticket-body {
  max-width: 780px;
  min-width: 780px;
  border: solid 3px black;
  padding: .5rem;
  margin: .2rem;
}

.qrcode {
  text-align: center;
}

.main-text {
  align-self: stretch;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.main-text p span {
  display: block;
}

.date-and-place {
  flex-direction: column;
  align-items: flex-start;
}

.date-and-place p {
  margin-bottom: 0;
}

.date-and-place p span {
  display: inline;
}

.details {
  align-items: stretch;
}

.details .col {
  text-align: center;
}

.note {
  justify-content: center;
}

.note p {
  margin: 0;
}

.rotated {
  transform: rotate(90deg);
  border-bottom: dashed;
  padding: 0;
}

.rotated h2 {
  margin-bottom: 40px;
}

.rotated p {
  margin-bottom: 0;
}

.rotated-details {
  flex-direction: column;
  align-items: flex-start;
}

.rotated .row {
  margin: 0;
}

@media only screen and (max-width: 680px) {
  .rotated {
    display: none;
  }

  .main-text {
    flex: 0 0 75%;
    max-width: 75%;
  }
}

@media only screen and (max-width: 450px) {
  .rotated {
    display: none;
  }

  .qrcode {
    display: none;
  }

  .main-text {
    flex: 0 0 100%;
    max-width: 100%;
  }
}

</style>
