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
            <template slot="type" scope="row">{{row.value}}</template>
            <template slot="timestamp" scope="row">{{row.value}}</template>
            <template slot="pid" scope="row">{{row.value}}</template>
            <template slot="hostname" scope="row">{{row.value}}</template>
            <template slot="uuid" scope="row">{{row.value}}</template>
            <template slot="rootId" scope="row">{{row.value}}</template>
            <template slot="parentId" scope="row">{{row.value}}</template>
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
];

import VueSocketio from 'vue-socket.io';
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)
import config from '../utils/config';

Vue.use(VueSocketio, 'http://'+config.host+':'+config.port);
export default {
    beforeCreate: function() {
        console.log("Se crea una tarea Celery")
        Vue: axios.get('/api/consumeCommands').then((response) => {
            if (response.status === 200) {
                console.log('empieza el consumer de eventos de celery')
            }
        })
    },
    destroyed: function() {
        /*   console.log("Se destruye la instancia")
          Vue: axios.get('/api/unsubscribe/task').then((response) => {
              if (response.status === 200) {
                  console.log("sacar loader y todo")
              } else {
                  console.log("sacar popup-error")
              }
          }) */
    },
    data() {
        return {
            items: items,
            emptyText: 'no hay datos',
            fields: {
                type: { label: 'Type', sortable: true },
                rootId: { label: 'RootId', sortable: true },
                parentId: { label: 'ParentId', sortable: true },
                timestamp: { label: 'Timestamp', sortable: true, 'class': 'text-center' },
                pid: { label: 'PID' },
                hostname: { label: 'hostname' },
                uuid: { label: 'UUID' }
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
        getItem(id) {
            var item
            for (var i in this.items) {
                if (this.items[i].task === id) {
                    item = this.items[i]
                    break
                }
            }
            console.log(item)
        }
    },
    sockets: {
        connect: function() {
            console.log('Conectado a socket Commands')
        },
        disconnect: function() {

        },
        celeryCommands: function(val) {
            var celerytask = JSON.parse(val)[0]
            var element = {}
            element.hostname = celerytask.hostname
            element.pid = celerytask.pid
            element.timestamp = celerytask.timestamp
            element.type = celerytask.type
            element.uuid = celerytask.uuid
            element.rootId = celerytask.root_id
            element.parentId = celerytask.parent_id
            items.unshift(element)
            console.log(val)
        }
    },
}
</script>