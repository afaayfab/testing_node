<template>
  <div class="center">
    <b-form>
      <h5>User:</h5>
      <b-form-input v-model="username" style="margin-bottom:5px" type="text" placeholder="Enter your username" :formatter="format"></b-form-input>

      <h5>Password:</h5>
      <b-form-input v-model="password" type="password" placeholder="Enter your password" :formatter="format"></b-form-input>
      <b-button @click="getAuth" variant="success" style="cursor:pointer; margin-top:5px">Login</b-button>
    </b-form>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueSession from 'vue-session'

Vue.use(VueSession)
Vue.use(VueAxios, axios)
export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  beforeCreate: function() {
    if (this.$session.exists()) {
      this.$router.push('/login')
    }
  },
  methods: {

    format(value, el) {
      return value.toLowerCase()
    },
    getAuth() {
      Vue: axios.post('/auth', {
        user: this.username,
        password: this.password
      }).then((response) => {
        if (response.status === 200) {
          this.$session.start()
          this.$session.set('authToken', response.data.token)
          // Vue.http.headers['x-access-token'] = response.body.token
          this.$router.push('/main')
        }
      })
    }
  }

}
</script>

<style>
.center {
  position: absolute;
  transform: translate(-50%, -50%);
  margin: auto;
  left: 50%;
  top: 50%;
  width: 30%;
  border: 3px solid green;
  padding: 15px;
  border-radius: 25px;
  text-align: initial;
}
</style>