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
import TreeView from "./tree/TreeView"
import Item from './tableSubcomponents/item'

//Vue.use(TreeView)
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
            //jsonSource: [],
            jsonSource : JSON.parse('[{\"type\":\"task-received\",\"uuid\":\"c293343f-71ac-4a7a-b2d1-6491d50e5c23\",\"rootId\":null,\"parentId\":null,\"decription\":\"(\'pruebas\',)\",\"children\":[{\"uuid\":\"6a85a2c5-eced-4aab-a061-eb8e1e2e842e\",\"description\":\"(\'WORK-0\',)\",\"num\":3,\"children\":[{\"uuid\":\"4d73a149-146c-4e47-a611-98c41f5b344c\",\"description\":\"(\'JOB-0\',)\",\"num\":3,\"children\":[{\"uuid\":\"7aad55fd-a45b-4324-88e3-c6d8de3edb8a\",\"description\":\"(\'PROCESS-0\',)\",\"num\":3,\"children\":[]},{\"uuid\":\"5ce72bef-8de6-4847-a33a-1ede48623e38\",\"description\":\"(\'PROCESS-1\',)\",\"num\":3,\"children\":[]}]},{\"uuid\":\"4a78aa4f-c93d-4962-bd27-6f175a0a0f87\",\"description\":\"(\'JOB-1\',)\",\"num\":3,\"children\":[{\"uuid\":\"5b86e2f5-ccc2-4dc8-8af8-5444802d8c98\",\"description\":\"(\'PROCESS-0\',)\",\"num\":3,\"children\":[]},{\"uuid\":\"7912fe2d-9bff-4d18-a553-5e5b685ac18a\",\"description\":\"(\'PROCESS-1\',)\",\"num\":3,\"children\":[]}]}]},{\"uuid\":\"67aae82a-0fe1-4a27-a0ea-a1b87b858e79\",\"description\":\"(\'WORK-1\',)\",\"num\":3,\"children\":[{\"uuid\":\"4bb73527-141a-4567-9258-e86d1fd1e8b3\",\"description\":\"(\'JOB-0\',)\",\"num\":3,\"children\":[{\"uuid\":\"17d039d2-e4a5-4032-a073-55aa6ed1cd03\",\"description\":\"(\'PROCESS-0\',)\",\"num\":3},{\"uuid\":\"a3bde92b-b10e-4df0-b4ff-18c497dd63fd\",\"description\":\"(\'PROCESS-1\',)\",\"num\":3}]},{\"uuid\":\"63a1bef8-8638-4532-ae90-68466b334d42\",\"description\":\"(\'JOB-1\',)\",\"num\":3,\"children\":[{\"uuid\":\"63babc4a-07c0-48a3-a5b2-0cdc948a4a8e\",\"description\":\"(\'PROCESS-0\',)\",\"num\":3},{\"uuid\":\"2cf50c1b-d44c-4b74-87a0-7863a2b0902f\",\"description\":\"(\'PROCESS-1\',)\",\"num\":3}]}]}]}]'),
            treeData: {},//JSON.parse("{\"hostname\":\"celery@BDPROCDES\",\"pid\":5692,\"timestamp\":1506334613.2528439,\"type\":\"task-received\",\"uuid\":\"c8f8bf68-32c7-4a90-94e0-01e241b942c5\",\"rootId\":null,\"parentId\":null,\"decription\":\"('pruebas',)\",\"children\":[{\"uuid\":\"f7cb7e50-1b1c-4a9b-b0f8-1d1785dce5c6\",\"decription\":\"('WORK-0',)\",\"children\":[{\"uuid\":\"77013db4-825b-433c-95ae-02d0ed699ca1\",\"decription\":\"('JOB-0',)\",\"children\":[{\"uuid\":\"b04ee931-2c98-42a8-b005-15458366f68e\",\"decription\":\"('PROCESS-0',)\",\"children\":[]},{\"uuid\":\"0cef4c07-fdc9-4342-8faf-004ce15f42a3\",\"decription\":\"('PROCESS-1',)\",\"children\":[]}]},{\"uuid\":\"6a3dfc0b-4482-42b3-a92d-fbe18e3c5040\",\"decription\":\"('JOB-1',)\",\"children\":[{\"uuid\":\"5ddbe9d7-8fba-4ec8-a879-c72ccfe56381\",\"decription\":\"('PROCESS-0',)\",\"children\":[]},{\"uuid\":\"74a3635b-8e90-40b3-a137-957faef0d9a1\",\"decription\":\"('PROCESS-1',)\",\"children\":[]}]}]},{\"uuid\":\"b8c69f40-cca4-4b72-9372-dce1cf023b97\",\"decription\":\"('WORK-1',)\",\"children\":[{\"uuid\":\"b57722b0-f0d0-4243-8af6-d6938ec435c2\",\"decription\":\"('JOB-0',)\",\"children\":[{\"uuid\":\"61a999c3-a4ca-435c-b601-7227c92cb970\",\"decription\":\"('PROCESS-0',)\"},{\"uuid\":\"a86e34e0-ca33-46f8-8df8-0898262fc4ff\",\"decription\":\"('PROCESS-1',)\"}]},{\"uuid\":\"ced285da-42a2-441f-b01d-3907984ed98e\",\"decription\":\"('JOB-1',)\",\"children\":[{\"uuid\":\"b1d9fd36-75e6-4b89-b54d-8e342db5d811\",\"decription\":\"('PROCESS-0',)\"},{\"uuid\":\"b9b871a2-6444-4dd8-bf2d-2e277162f032\",\"decription\":\"('PROCESS-1',)\"}]}]}]}"),
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
                    newChild.num = 3
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
                console.log(JSON.stringify(this.jsonSource))
            }

            if (element.type === 'task-received' && element.rootId == undefined) {
                //  var root = {element.description: element}     
                var root = {}
        
                root.type = celerytask.type
                root.uuid = celerytask.uuid
                root.rootId = celerytask.root_id
                root.parentId = celerytask.parent_id
                root.decription = celerytask.args
                this.jsonSource.push(root)
            }

            if (element.status === 'TERCER NIVEL') {

            }

        }
    },
    components: {
        TreeView,
        Item
    }
}
</script>