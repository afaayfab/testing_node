<template>

    <!--<Tasks></Tasks>-->
    <div class="taskDiv">
      <Tasks></Tasks>
      <Logs></Logs>
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
  top: 5%;
}
</style>