<template>
  <div
    class="container-fluid overflow-hidden full-height"
    style="padding-left: 0px !important; padding-right: 0px !important;"
  >
    <div class="row full-height">
      <div class="col-md-12 full-height">
        <l-map style="height: 100%; width:100%" :zoom="zoom" :center="center">
          <l-control-polyline-measure :options="options" position="topright" />
          <l-control-layers position="topright"></l-control-layers>
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
          <!-- other map components -->
        </l-map>
      </div>
    </div>
  </div>
</template>

<script>
import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LTooltip,
  LControlLayers
} from "vue2-leaflet";
import LControlPolylineMeasure from "vue2-leaflet-polyline-measure";
const options = {
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
    alert(item) {
      alert("this is " + JSON.stringify(item));
    }
  }
};
</script>

<style scoped>
.full-height {
  height: 100%;
}
</style>
