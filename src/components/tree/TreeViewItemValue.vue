<template>
  <div>
    <span class="tree-view-item-key">{{keyString}}</span>
    <input v-if="modifiable" class="tree-view-item-value" :class="getValueType(data)" v-model="valueString" @keyup.enter="onUpdateData" @blur="onUpdateData">

    <span v-if="isBarTag(valueFormed)"  :class="getValueType(data)">   
      <progress-bar style="width: 50%;" v-if="isBar(valueFormed)" v-model="progressValue"></progress-bar>
      <div v-else class="rojo">{{ valueFormed }}</div>
    </span>

    
    <span v-show="error">{{ error }}</span>
  </div>
</template>


<script>
import _ from 'lodash'
import Vue from 'vue'
Vue.component('progress-bar', require('vue-progress-bar'));

export default {
  name: 'tree-view-item',
  props: ['data', 'modifiable', 'key-string'],
  components:{
      'progress-bar': require('vue-progress-bar')
  },
  data: function() {    
    return {
      progressValue:0,
      options: {
        color: '#007FFF',
        strokeWidth: 5,
        svgStyle: {
          width: '20%'
        }

      },
      valueString: this.data && this.data.toString(),
      error: false,
    }
  },
  computed: {
    valueFormed: function() {
      return this.getValue(this.data)
    }
  },
  mounted: function() {


  },
  methods: {
    isBar: function(value) {
      if(_.isNumber(value)){
        this.progressValue = parseInt(value)
      }
      return _.isNumber(value)
    },
    isBarTag: function(value){
      return _.isNumber(value)
    },
    onUpdateData: function() {
      try {
        let v = this.typedValue(this.valueString)
        this.error = false
        this.$emit('change-data', [], v)
      }
      catch (err) {
        this.error = err
      }
    },
    typedValue: function(v) {
      if (v == '') { throw 'empty' }

      let dataType = this.getValueType(this.data, '')

      switch (dataType) {
        case 'number':
          if (_.isNaN(_.toNumber(v))) {
            throw 'only number'
          }
          return _.toNumber(v)
        case 'boolean':
          if (v.toLowerCase() === 'true') { return true }
          if (v.toLowerCase() === 'false') { return false }
          throw 'true or false'
        case 'string':
        default:
          return v
      }
    },
    getValue: function(value) {
      if (_.isNumber(value)) {
        return value
      }
      if (_.isNull(value)) {
        return "null"
      }
      if (_.isString(value)) {
        return "\"" + value + "\"";
      }
      return value;
    },
    getValueType: function(value, prefix = "tree-view-item-value-") {
      if (_.isNumber(value)) {
        return prefix + "number"
      }
      if (_.isFunction(value)) {
        return prefix + "function"
      }
      if (_.isBoolean(value)) {
        return prefix + "boolean"
      }
      if (_.isNull(value)) {
        return prefix + "null"
      }
      if (_.isString(value)) {
        return prefix + "string";
      }
      return prefix + "unknown";
    }
  }
}
</script>
<style>
.rojo {
  color: red
}
</style>

</style>
