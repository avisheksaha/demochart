<template>
  <div
    class="container-fluid overflow-hidden full-height"
    style="padding-left: 0px !important; padding-right: 8px !important;"
  >
    <div class="row full-height">
      <div class="col-md-7 full-height pr-0">
        <l-map style="height: 100%; width:100%" :zoom="zoom" :center="center">
          <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
          <l-marker
            v-for="marker in markers"
            :key="marker.factory_id"
            :lat-lng="marker.position"
            @click="openFactoryModal(marker)"
          >
            <l-tooltip>{{marker.factory_id}}</l-tooltip>
            <l-popup :content="marker.factory_name"></l-popup>
          </l-marker>
          <l-polygon :lat-lngs="polygon.latlngs" :color="polygon.color"></l-polygon>

          <!-- <l-marker
            v-for="marker in markers"
            :key="marker.id"
            :draggable="true"
            :lat-lng="marker.position"
            @dragend="updateCordinates"
          ></l-marker>-->
          <!-- <l-circle :lat-lng="center" :radius="circle.radius" :color="circle.color" /> -->
        </l-map>
        <div v-if="factoryDetailsInModal">
          <b-modal v-model="modalFactory">
            <div>
              <h6>
                Factory Id:
                <span
                  style="font-size:20px; padding-left:3px;"
                >{{factoryDetailsInModal.factory_id}}</span>
              </h6>
              <h6>
                Factory RC_No:
                <span
                  style="font-size:20px; padding-left:3px;"
                >{{factoryDetailsInModal.factory_rc_number}}</span>
              </h6>
              <h6>
                Factory Name:
                <span
                  style="font-size:20px; padding-left:3px;"
                >{{factoryDetailsInModal.factory_name}}</span>
              </h6>
              <h6>
                State:
                <span style="font-size:20px; padding-left:3px;">{{selectState.name}}</span>
              </h6>
              <h6>
                District:
                <span style="font-size:20px; padding-left:3px;">{{selectDistrict}}</span>
              </h6>
            </div>
          </b-modal>
        </div>
      </div>
      <div class="col-md-5 full-height pl-2">
        <div class="row row1">
          <div class="col-md-6 full-height">
            <label class="text-white" for="inlineFormCustomSelectPref">Select State</label>
            <div v-if="gotStates.length > 0">
              <select
                class="custom-select"
                v-model="selectState"
                @change="stateSelected(selectState.id)"
                id="inlineFormCustomSelectPref"
              >
                <option value="null" disabled>Choose a state</option>
                <option
                  v-for="(gotState, index) in gotStates"
                  :key="index"
                  :value="gotState"
                >{{ gotState.name }}</option>
              </select>
            </div>
          </div>
          <div class="col-md-6 full-height" v-if="selectState">
            <label class="text-white" for="inlineFormCustomSelectPref">Select Districts</label>
            <select
              class="custom-select"
              v-model="selectDistrict"
              @change="districtSelected(selectDistrict)"
              id="inlineFormCustomSelectPref1"
            >
              <option selected>All</option>
              <option
                v-for="(district, index) in selectState.districts"
                :key="index"
                :value="district"
              >{{ district }}</option>
            </select>
          </div>
        </div>
        <div class="row row2">
          <div class="col-md-6 full-height pr-0">
            <div class="card bg-dark text-white ht20">
              <span class="px-4 pt-2" style="font-size: 20px;">Total Factories: {{factoryCtg.total}}</span>
            </div>
            <div class="card bg-dark text-white pb-2 ht80">
              <piefactorycatg-chart
                :chart-data="datacollectionFactoryCatgPie"
                :options="optionspie"
                :style="myStyles"
              ></piefactorycatg-chart>
            </div>
          </div>
          <div class="col-md-6 full-height pl-1">
            <div
              class="card bg-dark ht50 text-white px-4 py-2 d-flex justify-content-center align-items-center"
            >
              <div>
                <h5>Total Installed Capacity</h5>
              </div>
              <div>
                <h1 class="mt-2">
                  {{factoryCtg.Installed_Capacity || 0}}
                  <span style="font-size:24px;">kg</span>
                </h1>
              </div>
            </div>
            <div
              class="card ht49 bg-dark text-white d-flex justify-content-center align-items-center px-4 py-2"
            >
              <div>
                <h5>Registered with Chai-Sahyog</h5>
              </div>
              <div>
                <h1 class="mt-2">{{factoryCtg.Registered_Factory}}</h1>
              </div>
            </div>
          </div>
        </div>
        <div class="row row3">
          <div class="col-md-6 full-height pr-0">
            <div class="card bg-dark full-height"></div>
          </div>
          <div class="col-md-6 full-height pl-1">
            <div class="card bg-dark full-height"></div>
          </div>
        </div>
        <!-- <div class="row row4">
          <div class="col-md-12 full-height">
            <div class="card full-height"></div>
          </div>
        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
import PiefactorycatgChart from "./charts/PiefactorycatgChart.js";

import {
  LMap,
  LTileLayer,
  LMarker,
  LPolygon,
  LTooltip,
  LPopup
} from "vue2-leaflet";
const optionspie = {
  responsive: true,
  maintainAspectRatio: false,
  pieceLabel: {
    render: "value",
    precision: 1
  },
  showAllTooltips: true,
  animation: {
    animateRotate: true,
    animateScale: true
  },
  legend: {
    // position: "right",
    labels: {
      // This more specific font property overrides the global property
      fontColor: "white"
    }
  },
  title: {
    display: true,
    fontColor: "white",
    fontSize: 16,
    fontFamily: "'Helvetica Neue',Helvetica, Arial, sans-serif",
    text: "Factory Category"
  }
};
export default {
  data() {
    return {
      modalFactory: false,
      factoryDetailsInModal: null,
      myStyles: {
        height: "100%"
      },
      zoomControl: false,
      attributionControl: false,
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 8,
      center: [28.6139, 77.209],
      markers: [],
      polygon: {
        latlngs: [
          [28.468691297348148, 93.515625],
          [27.117812842321225, 91.28540039062501],
          [26.020999877418795, 90.06591796875001],
          [26.207198534534083, 90.78689575195314],
          [24.956180020055925, 92.71911621093751],
          [26.55904998407556, 94.46594238281251],
          [27.702983735525862, 97.10815429687501],
          [29.401319510041485, 96.20727539062503],
          [28.468691297348148, 93.515625]
        ],
        color: "green"
      },
      coordinates: [],

      // circle: {
      //   radius: 10000,
      //   color: "red"
      // },

      gotStates: [],
      selectState: null,
      factoryCtg: {},
      locationsState: null,

      datacollectionFactoryCatgPie: null,
      optionspie,

      selectDistrict: null,

      districts: []
    };
  },
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPolygon,
    PiefactorycatgChart,
    LTooltip,
    LPopup
  },
  watch: {
    selectState(newValue, oldValue) {
      if (newValue != oldValue) {
        this.selectDistrict = null;
      }
    }
  },
  mounted() {
    this.receiveStates();
  },
  methods: {
    receiveStates() {
      this.axios
        .get("http://f87fb9d3.ngrok.io/api/v1/state-list")
        .then(response => {
          this.gotStates = response.data.data;
        })
        .catch();
    },

    stateSelected(selectedStateId) {
      // this.selectDistrict = null;
      this.factoryCatgState(selectedStateId);
      this.factoryLocnState(selectedStateId);
    },

    factoryCatgState(selectedStateId) {
      this.factoryCtg = {};

      this.axios
        .get(
          `http://f87fb9d3.ngrok.io/api/v1/state/factory-category/${selectedStateId}`
        )
        .then(response => {
          this.factoryCtg = response.data.data;

          this.datacollectionFactoryCatgPie = {
            labels: ["BLF", "EF", "IT"],
            datasets: [
              {
                borderWidth: 0,
                label: "Data One",
                backgroundColor: ["#CD5C5C", "#a9c722", "#c77722"],
                data: [
                  this.factoryCtg.BLF,
                  this.factoryCtg.EF,
                  this.factoryCtg.IT
                ]
              }
            ]
          };
        })
        .catch();
    },

    factoryLocnState(selectedStateId) {
      this.axios
        .get(
          `http://f87fb9d3.ngrok.io/api/v1/state/factory/location/${selectedStateId}`
        )
        .then(response => {
          // this.markers = response.data.data.factoryloc;
          this.center = response.data.data.location;
          let floc = response.data.data.factory_location;
          console.log(floc);
          this.markers.splice(0, this.markers.length);
          floc.forEach(element => {
            let flocVar = {
              factory_id: element.factory_id,
              factory_name: element.factory_name,
              factory_rc_number: element.factory_rc_number,
              position: element.position,
              visible: true,
              icon: this.myMarkerIcon
            };
            this.markers.push(flocVar);
          });
        })
        .catch();
    },

    districtSelected(selectedDistrictName) {
      if (this.selectDistrict == null) {
        return;
      }
      this.factoryCatg(selectedDistrictName);
      this.factoryLocn(selectedDistrictName);
    },

    factoryCatg(selectedDistrictName) {
      this.factoryCtg = {};
      this.axios
        .get(
          `http://f87fb9d3.ngrok.io/api/v1/district/factory-category/${selectedDistrictName}`
        )
        .then(response => {
          this.factoryCtg = response.data.data;
          this.datacollectionFactoryCatgPie = {
            labels: ["BLF", "EF", "IT"],
            datasets: [
              {
                label: "Data One",
                borderWidth: 0,
                backgroundColor: ["#CD5C5C", "#a9c722", "#c77722"],
                data: [
                  this.factoryCtg.BLF,
                  this.factoryCtg.EF,
                  this.factoryCtg.IT
                ]
              }
            ]
          };
        })
        .catch();
    },
    factoryLocn(selectedDistrictName) {
      this.axios
        .get(
          `http://f87fb9d3.ngrok.io/api/v1/district/factory/location/${selectedDistrictName}`
        )
        .then(response => {
          // this.markers = response.data.data.factoryloc;
          this.center = response.data.data.location;
          let floc = response.data.data.factory_location;
          console.log(floc);
          this.markers.splice(0, this.markers.length);
          floc.forEach(element => {
            let flocVar = {
              factory_id: element.factory_id,
              factory_name: element.factory_name,
              factory_rc_number: element.factory_rc_number,
              position: element.position,
              visible: true,
              icon: this.myMarkerIcon
            };
            this.markers.push(flocVar);
          });
        })
        .catch();
    },

    openFactoryModal(marker) {
      console.log(marker);
      this.modalFactory = true;
      this.factoryDetailsInModal = marker;
      console.log(this.selectState.name);
      console.log(this.selectDistrict);
    }
    // updateCordinates(event) {
    //   // console.log("sdsdsd");
    //   var latlng = event.target.getLatLng();
    //   console.log(latlng);
    //   this.center = [latlng.lat, latlng.lng];
    //   console.log(this.coordinates);

    //   // console.log(latlng.lat, latlng.lng);
    //   // (this.coordinates.lat = latlng.lat), (this.coordinates.lng = latlng.lng);
    // }
  }
};
</script>

<style scoped>
.row1 {
  height: 10%;
}
.row2 {
  margin-top: 4px;
  margin-bottom: 0px;
  height: 46%;
}
.row3 {
  margin-top: 4px;
  margin-bottom: 4px;
  height: 39%;
}
/* .row4 {
  height: 21%;
} */
.ht20 {
  height: 20%;
}
.ht50 {
  height: 50%;
}
.ht49 {
  margin-top: 4px;
  height: 49%;
}
.ht80 {
  height: 79%;
  margin-top: 4px;
}
.full-height {
  height: 100%;
}
</style>