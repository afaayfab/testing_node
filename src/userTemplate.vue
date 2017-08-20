<<template>
    <form id="addUser" method="post">
  <p>
    <input type="text" v-model="name">
    {{name}}
  </p>
   <p>
    <input type="text" v-model="surname">
    {{surname}}
  </p>
   <p>
    <input type="text" v-model="user">
    {{user}}
  </p>
   <p>
    <input type="password" v-model="password">
    {{password}}
  </p>
  <p>
    <a href="#" @click.prevent="addUser">Guardar</a>
  </p>

</form>
</template>


<script>
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

export default {
  data () {
  return {
    name: '',
    surname: '',
    user: '',
    password: ''
  }
},
  methods: {
      addUser (){
         console.log("hola")
        Vue: axios.post('/api/user',{
                name: this.name,
                surname: this.surname,
                user: this.user,
                password: this.password
            }).then((response) => {
         })
 

      }
    }
}

</script>