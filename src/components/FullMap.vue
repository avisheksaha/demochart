<template>
  <div
    class="container-fluid overflow-hidden full-height"
    style="padding-left: 0px !important; padding-right: 0px !important;"
  >
    <div class="row full-height">
      <div class="col-md-12 full-height">
        <l-map
          style="height: 100%; width:100%"
          :zoom="zoom"
          :center="center"
          @polylinemeasure:finish="abc"
        >
          <l-control-polyline-measure :options="options" position="topleft" />
          <l-control-layers position="topleft"></l-control-layers>
          <l-tile-layer
            v-for="tileProvider in tileProviders"
            :key="tileProvider.name"
            :name="tileProvider.name"
            :visible="tileProvider.visible"
            :url="tileProvider.url"
            :attribution="tileProvider.attribution"
            :token="token"
            layer-type="base"
          />
          <l-marker
            v-for="marker in markers"
            :key="marker.id"
            :lat-lng="marker.position"
            @click="modalShow = !modalShow"
          >
            <l-tooltip>{{ marker.id }}</l-tooltip>
            <l-popup>{{ marker.id }}</l-popup>
          </l-marker>
          <l-circle-marker
            :lat-lng="circle.center"
            :radius="circle.radius"
            :color="circle.color"
            :fillColor="circle.fillColor"
            :fillOpacity="circle.fillOpacity"
          />
          <!-- other map components -->
        </l-map>
        <b-modal v-model="modalShow">Hello From Modal!</b-modal>
        <b-modal v-model="modalShowPolylineFinish">
          <h5>Distance Covered:</h5>
          <h1>
            {{this.dist}}
            <span style="font-size: 27px;">km</span>
          </h1>
        </b-modal>
      </div>
    </div>
  </div>
</template>

<script>
import {
  LMap,
  LTileLayer,
  LMarker,
  LCircleMarker,
  LPopup,
  LTooltip,
  LControlLayers
} from "vue2-leaflet";
import LControlPolylineMeasure from "vue2-leaflet-polyline-measure";
const options = {
  unit: "kilometres",
  showBearings: false,
  clearMeasurementsOnStop: false,
  showClearControl: true,
  showUnitControl: false,
  popupOptions: {
    className: "leaflet-measure-resultpopup",
    autoPanPadding: [10, 10]
  }
};
export default {
  data() {
    return {
      modalShow: false,
      modalShowPolylineFinish: false,
      dist: null,

      options,
      zoomControl: false,
      attributionControl: false,
      tileProviders: [
        {
          name: "OpenStreetMap",
          visible: true,
          attribution:
            '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        },
        {
          name: "OpenTopoMap",
          visible: false,
          url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
          attribution:
            'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        }
      ],
      zoom: 12,
      center: [28.6139, 77.209],
      circle: {
        center: [28.6136, 77.207],
        radius: 5,
        color: "#26291a",
        fillColor: "#26291a",
        fillOpacity: 1
      },

      markers: [
        {
          id: 1,
          position: [28.6138, 77.21]
        },
        {
          id: 2,
          position: [28.614, 77.22]
        }
      ]
    };
  },
  components: {
    LMap,
    LMarker,
    LCircleMarker,
    LControlLayers,
    LTileLayer,
    LPopup,
    LTooltip,
    LControlPolylineMeasure
  },
  methods: {
    showme() {
      console.log("sdsdsd");
    },
    abc(currentLine) {
      console.log(currentLine.distance);
      let distVar = currentLine.distance;
      this.dist = (distVar / 1000).toFixed(2);
      this.modalShowPolylineFinish = true;
    },
    alert(item) {
      alert("this is " + JSON.stringify(item));
    }
  },
  mounted() {
    this.abc;
  }
};
</script>

<style scoped>
.full-height {
  height: 100%;
}
</style>
