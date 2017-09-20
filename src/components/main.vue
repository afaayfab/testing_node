<template>
  <!--<Tasks></Tasks>-->
  <div style="margin-top: 60px;">
    <b-button variant="success" v-on:click="launchTask()">Launch Task</b-button>

    <template v-if="!showTasks">
      <b-button style="top:1%;margin:auto;" v-on:click="changeTask(showTasks)" variant="success">Show Tasks</b-button>
    </template>
    <template v-else>
      <b-button style="top:1%;margin:auto;" v-on:click="changeTask(showTasks)" variant="success">HIde Tasks</b-button>
    </template>

    <template v-if="!showCommands">
      <b-button style="top:1%;margin:auto;" v-on:click="changeCommand(showCommands)" variant="success">Show Commands</b-button>
    </template>
    <template v-else>
      <b-button style="top:1%;margin:auto;" v-on:click="changeCommand(showCommands)" variant="success">Hide Commands</b-button>
    </template>

    <div class="taskDiv">
      <Tasks v-if="showTasks"></Tasks>
      <Commands v-if="showCommands"></Commands>
      <Logs></Logs>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueSession from 'vue-session'
import Tasks from './tasks';
import Logs from './logs'
import Commands from './commandsTasks'
import VueSocketio from 'vue-socket.io';

import config from '../utils/config';

Vue.use(VueSocketio, 'http://'+config.host+':'+config.port);
Vue.use(VueSession)
Vue.use(VueAxios, axios)
export default {
  data() {
    return {
      showTasks: false,
      showCommands: false
    }
  },
  beforeCreate: function() {

    console.log("me creo ya")
  },
  sockets: {
    connect: function() {
      console.log('socket connected')
    },
    /*,
    logFile: function(val) {
      console.log(val)
    }*/
  },
  beforeCreate: function() {

    if (!this.$session.exists()) {
      this.$router.push('/')
    }
  },
  methods: {
    launchTask(){
        console.log("Se crea una tarea Celery")
        Vue: axios.get('/api/launchTask').then((response) => {
            console.log("Creada la tarea Celery, res: " + response)
            if (response.status === 200) {
                console.log("Se llama a consumeCommands")               
            }
        })
    },
    changeCommand(showCommands) {
      if (showCommands) {
        this.showCommands = false
        console.log("2º" + this.showCommands)
      } else {
        this.showCommands = true
        console.log("3º" + this.showCommands)
      }
    },
    changeTask(showTasks) {
      console.log("1º" + this.showTasks)
      if (showTasks) {
        this.showTasks = false
        console.log("2º" + this.showTasks)
      } else {
        this.showTasks = true
        console.log("3º" + this.showTasks)
      }
    }
  },
  components: {
    Tasks,
    Logs,
    Commands
  }
}
</script>

<style>
.taskDiv {
  width: 80%;
  position: absolute;
  transform: translate(-50%, 0%);
  margin: auto;
  left: 50%;
  top: 20%;
}
</style>