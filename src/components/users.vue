<template>
  <div class="container-fluid">
    <div class="row">
      <div class="menurow col-sm-2 col-xs-2 col-md-2 well"> 2 Col</div>
      <div class="menurow col-sm-10 col-xs-10 col-md-10 well">
        <div class="formDiv">
          <form>
            <h5 class="formMarginBottom formLabelLeft">Name:</h5>
            <input class="formMarginBottom form-control" v-model="name" placeholder="user's name">
            <h5 class="formMarginBottom formLabelLeft">Lastname:</h5>
            <input class="formMarginBottom form-control" v-model="lastname" placeholder="user's lastname">
            <h5 class="formMarginBottom formLabelLeft">User:</h5>
            <input class="formMarginBottom form-control" v-model="user" placeholder="user's nickname">
            <h5 class="formMarginBottom formLabelLeft">Password:</h5>
            <input class="formMarginBottom form-control" v-model="password" placeholder="user's password">
            <button class="btn btn-success">Submit</button>
          </form>
        </div>
      </div>
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
import config from '../utils/config';

Vue.use(VueSocketio, 'http://'+config.host+':'+config.port);
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
.menurow {
  height: 100%;
}

.formMarginBottom {
  margin-bottom: 15px
}

.formLabelLeft {
  text-align: left;
}

.formDiv {
  width: 50%;
}
</style>