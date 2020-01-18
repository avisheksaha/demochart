<template>
  <div
    class="container-fluid overflow-hidden full-height"
    style="padding-left: 0px !important; padding-right: 0px !important;"
  >
    <div class="row h10"></div>
    <div class="row h80">
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
            layer-type="base"
          />

          <!-- :token="token" -->

          <!-- <l-marker
            v-for="marker in markers"
            :key="marker.id"
            :lat-lng="marker.position"
            :backgroundColor="green"
            :fillColor="circle.fillColor"
            @click="modalShow = !modalShow"
          >-->
          <div v-if="showFactoryGrowerLocations">
            <l-marker
              v-for="factory in dataLocations.factories"
              :key="factory.factory_id"
              :lat-lng="factory.position"
              @click="toggledrawLines(factory)"
            >
              <l-tooltip>{{ factory.factory_id }}</l-tooltip>
              <l-popup>{{ factory.factory_id }}</l-popup>
            </l-marker>

            <div v-for="(factoryGrower,index) in dataLocations.factories" :key="index">
              <l-circle-marker
                v-for="(grower,index) in factoryGrower.growers"
                :key="index"
                :lat-lng="grower.position"
                :radius="circle.radius"
                :color="circle.color"
                :fillColor="circle.fillColor"
                :fillOpacity="circle.fillOpacity"
              >
                <l-tooltip>{{ grower.grower_id }}</l-tooltip>
                <l-popup>{{ grower.grower_id }}</l-popup>
              </l-circle-marker>
            </div>
          </div>

          <div v-if="showTeaboardLocation">
            <l-marker
              v-for="(teaboardOffice,index) in dataLocations.teaboardOffices"
              :key="index"
              :lat-lng="teaboardOffice.position"
            >
              <l-icon :icon-size="dynamicSize" icon-url="/pin3.png"></l-icon>
              <l-tooltip>{{ teaboardOffice.office_id }}</l-tooltip>
              <l-popup>{{ teaboardOffice.office_id }}</l-popup>
            </l-marker>
          </div>
          <!-- <div style="z-index: 99999">
            <img src="../assets/logo.png" />
          </div>-->
          <!-- <l-marker :lat-lng="grab.position" @click="drawLines(grab)"></l-marker> -->
          <l-polyline :lat-lngs="polyline.latlngs" :color="polyline.color"></l-polyline>

          <!-- <l-circle-marker
            :lat-lng="circle.center"
            :radius="circle.radius"
            :color="circle.color"
            :fillColor="circle.fillColor"
            :fillOpacity="circle.fillOpacity"
          />-->
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
    <div class="row h10 px-4">
      <div class="col text-center my-auto mx-auto border-right">
        <button
          v-if="showFactoryGrowerLocations"
          type="button"
          class="btn btn-light btn-lg btn-block"
          @click="openFactoryGrowerLocations"
        >Factories and Growers</button>
        <button
          v-else
          type="button"
          class="btn btn-outline-light btn-lg btn-block"
          @click="openFactoryGrowerLocations"
        >Factories and Growers</button>
      </div>
      <div class="col text-center my-auto mx-auto border-right" @click="openTeaboardLocations">
        <button
          v-if="showTeaboardLocation"
          type="button"
          class="btn btn-light btn-lg btn-block"
        >Tea-board Office</button>
        <button v-else type="button" class="btn btn-outline-light btn-lg btn-block">Tea-board Office</button>
      </div>
      <div class="col text-center my-auto mx-auto border-right">
        <button type="button" class="btn btn-outline-light btn-lg btn-block">BLF</button>
      </div>
      <div class="col text-center my-auto mx-auto border-right">
        <button type="button" class="btn btn-outline-light btn-lg btn-block">EF</button>
      </div>
      <div class="col text-center my-auto mx-auto">
        <button type="button" class="btn btn-outline-light btn-lg btn-block">IT</button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  LMap,
  LPolyline,
  LTileLayer,
  LMarker,
  LIcon,
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
      iconSize: 32,
      showLines: false,
      showFactoryGrowerLocations: true,
      showTeaboardLocation: false,
      polyline: {
        latlngs: [],
        color: "green"
      },
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
        radius: 4,
        color: "#ff5100",
        fillColor: "#ff5100",
        fillOpacity: 1
      },
      dataLocations: {
        factories: [
          {
            factory_id: 101,
            position: [28.66, 77.23],
            growers: [
              {
                grower_id: 1,
                position: [28.6136, 77.23]
              },
              {
                grower_id: 2,
                position: [28.62, 77.21]
              },
              {
                grower_id: 3,
                position: [28.64, 77.228]
              },
              {
                grower_id: 4,
                position: [28.618, 77.224]
              },
              {
                grower_id: 5,
                position: [28.624, 77.218]
              }
            ]
          },
          {
            factory_id: 102,
            position: [28.67, 77.24],
            growers: [
              {
                grower_id: 9,
                position: [28.628, 77.25]
              },
              {
                grower_id: 10,
                position: [28.632, 77.29]
              }
            ]
          }
        ],
        teaboardOffices: [
          {
            office_id: "O-441",
            position: [28.63, 77.05]
          },
          {
            office_id: "0-442",
            position: [28.6345, 77.09]
          },
          {
            office_id: "0-443",
            position: [28.6998, 77.1]
          },
          {
            office_id: "0-443",
            position: [28.6789, 77.12124]
          },
          {
            grower_id: 5,
            position: [28.624, 77.218]
          }
        ]
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
    LIcon,
    LPolyline,
    LCircleMarker,
    LControlLayers,
    LTileLayer,
    LPopup,
    LTooltip,
    LControlPolylineMeasure
  },
  computed: {
    dynamicSize() {
      return [this.iconSize, this.iconSize * 1.15];
    }
  },
  methods: {
    openFactoryGrowerLocations() {
      this.showFactoryGrowerLocations = !this.showFactoryGrowerLocations;
    },
    toggledrawLines(factory) {
      this.showLines = !this.showLines;
      this.drawLines(factory);
    },
    drawLines(factory) {
      if (this.showLines == true) {
        var fact = factory;
        // console.log(fact, "kkkk");
        var latlngsff = Array();
        fact.growers.forEach(element => {
          latlngsff.push(factory.position);
          latlngsff.push(element.position);
          this.polyline.latlngs = latlngsff;
        });
      }
      if (this.showLines == false) {
        console.log(false);
        this.polyline.latlngs = [];
      }
    },
    openTeaboardLocations() {
      this.showTeaboardLocation = !this.showTeaboardLocation;
    },

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
.h10 {
  height: 10%;
}
.h20 {
  height: 20%;
}
.h70 {
  height: 70%;
}
.h80 {
  height: 80%;
}
.bottomTexts {
  font-size: 20px;
}
.bottomTexts:hover {
  font-size: 22px;
  background: white;
  color: #999999;
}
</style>
