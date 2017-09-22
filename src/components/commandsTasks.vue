<template>
    <div>

        <tree-view :data="jsonSource" :options="{maxDepth: 10}"></tree-view>

        <div id="taskTable" class="table table-striped">
            <table>
                <thead>
                    <th>ParentId</th>
                    <th>UUID</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>#Tasks</th>
                </thead>
                <tbody>
                    <tr v-for="row in rows" v-bind:id="row.uuid">
                        <td v-model="row.parentId">{{row.parentId}}</td>
                        <td v-model="row.uuid">{{row.uuid}}</td>
                        <td v-model="row.decription">{{row.decription}}</td>
                        <td v-model="row.type">{{row.type}}</td>
                        <td v-model="row.status">{{row.status}}</td>
                        <td v-model="row.ntasks">{{row.ntasks}}</td>
                    </tr>
                </tbody>
            </table>
        </div>

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
            <template slot="description" scope="row">{{row.value}}</template>
            <template slot="type" scope="row">{{row.value}}</template>
            <template slot="timestamp" scope="row">{{row.value}}</template>
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
import TreeView from "vue-json-tree-view"
Vue.use(TreeView)
Vue.use(VueAxios, axios)
import config from '../utils/config';

Vue.use(VueSocketio, 'http://' + config.host + ':' + config.port);
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
            jsonSource: [],
            rows: [],
            items: items,
            emptyText: 'no hay datos',
            fields: {
                decription: { label: 'Description', sortable: true },
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
        addRowCommands(parentUid, rowRegistry) {
            if (parentUid != undefined) {
                var found = false
                for (var i in this.rows) {
                    if (this.rows[i].uuid === parentUid) {
                        if (this.rows[i] === 'TERCER NIVEL') {
                            var tasks = this.rows[i].ntasks;
                            if (tasks === undefined || tasks === null) {
                                tasks = 0
                            }
                            tasks++
                            this.rows[i].ntasks = tasks
                        } else {
                            this.rows.splice(i + 1, 0, rowRegistry)
                            found = true
                            break
                        }

                    }
                }
                if (!found) {
                    this.rows.push(rowRegistry)
                }
            } else {
                this.rows.push(rowRegistry)
            }

        },
        addSource(sourceActual, item) {

            var found = false
            for (var i in sourceActual) {
                if (sourceActual[i].uuid === item.parentId) {
                    if (sourceActual[i].children == undefined) {
                        sourceActual[i].children = []
                    }
                    var newChild = {}
                    newChild.uuid = item.uuid
                    newChild.description = item.decription
                    sourceActual[i].children.push(newChild)
                    found = true                    
                }
            }
            if (!found) {
                for (var i in sourceActual) {
                    if (sourceActual[i].children == undefined) {
                        sourceActual[i].children = []
                    }
                    this.addSource(sourceActual[i].children, item)                    
                }
            }


        },
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
            var total = JSON.parse(val).length
            var celerytask
            if (total == 1) {
                celerytask = JSON.parse(val)[0]
            } else {
                celerytask = JSON.parse(val)

            }

            var element = {}
            element.hostname = celerytask.hostname
            element.pid = celerytask.pid
            element.timestamp = celerytask.timestamp
            element.type = celerytask.type
            element.uuid = celerytask.uuid
            element.rootId = celerytask.root_id
            element.parentId = celerytask.parent_id
            element.decription = celerytask.args
            if (JSON.stringify(element) === JSON.stringify({})) {
                console.log("AQUI->>>" + val)
            }

            items.unshift(element)

            if (element.type === 'task-sent') {
                this.addRowCommands(celerytask.parent_id, element)
                this.addSource(this.jsonSource, element)
            }

            if (element.type === 'task-received' && element.rootId == undefined) {

                this.jsonSource.push(element)
            }

            if (element.status === 'TERCER NIVEL') {

            }

        }
    },
}
</script>