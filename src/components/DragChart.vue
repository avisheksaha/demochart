<template>
  <div
    class="container-fluid overflow-hidden"
    style="padding-left: 0px !important; padding-right: 0px !important;"
  >
    <div class="row">
      <div class="col-md-7" style="height: 500px;">
        <l-map style="height: 100%; width: 100%;" :zoom="zoom" :center="center">
          <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
          <l-marker
            v-for="marker in markers"
            :key="marker.id"
            :draggable="true"
            :lat-lng="marker.position"
            @dragend="updateCordinates"
          ></l-marker>
          <l-circle :lat-lng="center" :radius="circle.radius" :color="circle.color" />
        </l-map>
      </div>
      <div class="col-md-5">
        <div class="text-white">Lat= {{coordinates}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LCircle } from "vue2-leaflet";
export default {
  data() {
    return {
      zoomControl: false,
      attributionControl: false,
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 10,
      center: [28.6139, 77.209],
      markers: [
        {
          id: "m1",
          position: [28.6139, 77.209],
          visible: true,
          icon: this.myMarkerIcon
        }
      ],
      // markerLatLng: [28.6139, 77.209],

      circle: {
        radius: 10000,
        color: "red"
      },
      coordinates: []
    };
  },
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LCircle
  },
  methods: {
    updateCordinates(event) {
      // console.log("sdsdsd");
      var latlng = event.target.getLatLng();
      console.log(latlng);
      this.center = [latlng.lat, latlng.lng];
      console.log(this.coordinates);

      // console.log(latlng.lat, latlng.lng);
      // (this.coordinates.lat = latlng.lat), (this.coordinates.lng = latlng.lng);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>