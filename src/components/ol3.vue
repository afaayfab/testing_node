<template>
  <div>
    <button @click="getExtent()">dame datos</button>
    <div id="map">
      <vl-map ref="map">
        <vl-view ref="view" :center="center" :zoom="zoom" :rotation="rotation" />
        <vl-geoloc @change="updateGeoloc" />
        <vl-layer-tile>
          <vl-source-osm />
        </vl-layer-tile>
        <vl-layer-vector v-if="position.length" id="position-layer" :z-index="100" :overlay="true">
          <vl-style-container>
            <vl-style-icon src="https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/128/Map-Marker-Marker-Outside-Azure.png" :scale="0.3" :anchor="[0.5, 1]" />
          </vl-style-container>
          <vl-source-vector>
            <vl-feature id="my-position" :z-index="999">
              <vl-geom-point :coordinates="position" />
            </vl-feature>
          </vl-source-vector>
        </vl-layer-vector>

      </vl-map>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
//import VueLayers from 'vuelayers'
import proj from 'ol/proj'
import { Map, View, TileLayer, OsmSource } from 'vuelayers'

Vue.use(Map)
Vue.use(View)
Vue.use(TileLayer)
Vue.use(OsmSource)

//Vue.use(VueLayers)

export default {
  data() {
    return {
      zoom: 2,
      center: [0, 0],
      rotation: 0,
      selected: [],
      countries: [],
      position: [],
      layers: {
        osm: true,
        countries: true,
        wms: false,
        wmts: false
      },
      sourceCode: false
    }
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
  mounted: function() {
    var extent = this.$refs.map.map.getView()//.calculateExtent(this.$refs.map.map.getSize());
    var mapSize = this.$refs.map.map.getSize()
    console.log(mapSize)
    console.log(extent)
  },
  methods: {
    getExtent() {
      var mapSize = this.$refs.map.map.getSize()
      var extent = this.$refs.view.view.calculateExtent(this.$refs.map.map.getSize());
      extent = proj.transformExtent(extent, 'EPSG:900913', 'EPSG:4326');
      var left = extent[0];
      var botton = extent[1];
      var right = extent[2];
      var top = extent[3];
      var zoom = evt.map.getView().getZoom();      
      
      //var url = 'http://ccodes.ttsistemas.com/CControl/' + urlPartial
      var jsonInfo = "{'date':1503666143897,'ln':'40.4740797949876','types':'[{\'id\':\'id18\'},{\'id\':\'id19\'},{\'id\':\'id801\'},{\'id\':\'id801002\'},{\'id\':\'id801003\'},{\'id\':\'id801001\'},{\'id\':\'id16\'},{\'id\':\'id901\'},{\'id\':\'id901001\'},{\'id\':\'id901002\'},{\'id\':\'id20\'},{\'id\':\'id700\'},{\'id\':\'id701002\'},{\'id\':\'id701001\'},{\'id\':\'id701004\'},{\'id\':\'id702002\'},{\'id\':\'id702001\'},{\'id\':\'id701003\'},{\'id\':\'id501001\'},{\'id\':\'id403\'},{\'id\':\'id403014\'},{\'id\':\'id403015\'},{\'id\':\'id403008\'},{\'id\':\'id403011\'},{\'id\':\'id403001\'},{\'id\':\'id403004\'},{\'id\':\'id403003\'},{\'id\':\'id403002\'},{\'id\':\'id403005\'},{\'id\':\'id403013\'},{\'id\':\'id403007\'},{\'id\':\'id403006\'},{\'id\':\'id403010\'},{\'id\':\'id403009\'},{\'id\':\'id403012\'},{\'id\':\'id300\'},{\'id\':\'id402\'},{\'id\':\'id401\'},{\'id\':\'id404\'},{\'id\':\'id405\'},{\'id\':\'id301\'},{\'id\':\'id302\'},{\'id\':\'id302003\'},{\'id\':\'id302008\'},{\'id\':\'id302014\'},{\'id\':\'id302006\'},{\'id\':\'id302001\'},{\'id\':\'id302002\'},{\'id\':\'id302005\'},{\'id\':\'id302007\'},{\'id\':\'id302010\'},{\'id\':\'id302009\'},{\'id\':\'id302016\'},{\'id\':\'id302004\'},{\'id\':\'id21\'},{\'id\':\'id200\'},{\'id\':\'id202\'},{\'id\':\'id201\'},{\'id\':\'id201001\'},{\'id\':\'id201002\'},{\'id\':\'id201003\'}]','ls':'40.30724952322339','ld':'-3.4378542968554755','zoom':12,'mapId':1,'adm':'N','lang':'es','li':'-3.9068331786914126'}"
      var parsed = JSON.parse(jsonInfo)
      console.log(extent)
    },
    updateGeoloc({ position }) {
      this.position = position

    }
  },
  components: {


  }
}
</script>
<style>
/* CSS file needs to be imported separately. */
</style>