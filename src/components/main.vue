<template>
  <!--<Tasks></Tasks>-->
  <div style="margin-top: 60px;">
    <template v-if="!showTasks">
      <b-button  style="top:1%;margin:auto;" v-on:click="changeTask(showTasks)" variant="success">Show Tasks</b-button>
     </template>
    <template v-else>
      <b-button  style="top:1%;margin:auto;" v-on:click="changeTask(showTasks)" variant="success">HIde Tasks</b-button>
    </template>

    <div class="taskDiv">
      <Tasks v-if="showTasks"></Tasks>
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
import VueSocketio from 'vue-socket.io';

Vue.use(VueSocketio, 'http://localhost:8081');
Vue.use(VueSession)
Vue.use(VueAxios, axios)
export default {
  data() {
    return { showTasks: false }
  },
  beforeCreate: function() {

    console.log("me creo ya")
  },
  sockets: {
    connect: function() {
      console.log('socket connected')
    }
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
    Logs
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