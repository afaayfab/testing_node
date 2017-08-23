<template>
  <div>
    <div class="my-1 row">
      <div class="col-md-6">
        <b-form-fieldset horizontal label="Rows per page" :label-cols="6">
          <b-form-select :options="pageOptions" v-model="perPage" />
        </b-form-fieldset>
      </div>
      <div class="col-md-6">
        <b-form-fieldset horizontal label="Filter" :label-cols="3">
          <b-form-input v-model="filter" placeholder="Type to Search" />
        </b-form-fieldset>
      </div>
    </div>

    <div class="row my-1">
      <div class="col-sm-8">
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" />
      </div>
      <div class="col-sm-4 text-md-right">
        <b-button :disabled="!sortBy" @click="sortBy = null">Clear Sort</b-button>
      </div>
    </div>

    <!-- Main table element -->
    <b-table :empty-text="emptyText" striped hover show-empty :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage" :filter="filter" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" @filtered="onFiltered">
      <template slot="time"  scope="row">{{row.value}}</template>
      <template slot="level" scope="row">{{row.value}}</template>
      <template slot="content" scope="row">{{row.value}}</template>
    </b-table>

    <p>
      Sort By: {{ sortBy || 'n/a' }}, Direction: {{ sortDesc ? 'descending' : 'ascending' }}
    </p>

    <!-- Details modal -->
    <b-modal id="modal1" @hide="resetModal" ok-only>
      <h4 class="my-1 py-1" slot="modal-header">Index: {{ modalDetails.index }}</h4>
      <pre>{{ modalDetails.data }}</pre>
    </b-modal>

  </div>
</template>

<script>
const items = [
 
]

import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueSession from 'vue-session'
import VueSocketio from 'vue-socket.io';

Vue.use(VueSocketio, 'http://localhost:8081');
Vue.use(VueSession)
Vue.use(VueAxios, axios)

export default {
  data() {
    return {
      items: items,
      emptyText: 'No records to show',
      fields: {
        time: { label: 'Time', sortable: true },
        level: { label: 'Level', sortable: true, 'class': 'text-center' },
        content: { label: 'Content', formatter: 'formatContent' }
      },
      currentPage: 1,
      perPage: 5,
      totalRows: items.length,
      pageOptions: [{ text: 5, value: 5 }, { text: 10, value: 10 }, { text: 15, value: 15 }],
      sortBy: null,
      sortDesc: false,
      filter: null,
      modalDetails: { index: '', data: '' }
    }
  },
  methods: {
    details(item, index, button) {
      this.modalDetails.data = JSON.stringify(item, null, 2);
      this.modalDetails.index = index;
      this.$root.$emit('show::modal', 'modal1', button);
    },
    resetModal() {
      this.modalDetails.data = '';
      this.modalDetails.index = '';
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    formatContent(text, event){
      var temp = '<div style="width:450px;  word-wrap: break-word;">'+text+'</div>'
      console.log(temp)
      return temp
    }
  },
  sockets: {
    connect: function() {
      console.log('socket connected')
    },
    logFile: function(val) {
      var thelog = JSON.parse(val)
      var element = {}
      element.time = thelog.timestamp
      element.level = thelog.level
      element.content = thelog.message   
      var variant 
      if(thelog.level==='info'){
        variant = 'success'
      }else if(thelog.level==='warn'){
        variant = 'warning'
      }else if(thelog.level==='error'){
        variant = 'danger'
      }else{
        variant = 'active'
      }
      element._rowVariant = variant
      items.unshift(element)
      console.log(val)
    }
  },
  beforeCreate: function() {

    if (!this.$session.exists()) {
      this.$router.push('/')
    }
  }
}
</script>

<style>
.logDiv {
  width: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  margin: auto;
  left: 50%;
  top: 50%;
}
</style>