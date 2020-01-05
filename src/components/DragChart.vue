<template>
  <div
    class="container-fluid overflow-hidden"
    style="padding-left: 0px !important; padding-right: 0px !important;"
  >
    <div class="row">
      <div class="col-md-7" style="height: 100vh;">
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
        <div class="row">
          <div class="col-md-6">
            <label class="my-1 mr-2 text-white" for="inlineFormCustomSelectPref">Select State</label>
            <div v-if="gotStates.length > 0">
              <select
                class="custom-select my-1 mr-sm-2"
                v-model="selectState"
                @change="stateSelected(selectState.id)"
                id="inlineFormCustomSelectPref"
              >
                <option selected>Choose...</option>
                <option
                  v-for="(gotState, index) in gotStates"
                  :key="index"
                  :value="gotState"
                >{{ gotState.name }}</option>
              </select>
            </div>
          </div>
          <div class="col-md-6" v-if="selectState">
            <label class="my-1 mr-2 text-white" for="inlineFormCustomSelectPref">Select Districts</label>
            <select
              class="custom-select my-1 mr-sm-2"
              v-model="selectDistrict"
              id="inlineFormCustomSelectPref"
            >
              <option selected>Choose...</option>
              <option
                v-for="(district, index) in selectState.districts"
                :key="index"
                :value="district"
              >{{ district }}</option>
            </select>
          </div>
        </div>
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
      coordinates: [],

      selectState: null,
      selectDistrict: null,
      xyz: {
        Grower_count: 0,
        total_plantation: 0
      },
      xyzState: {
        Grower_count: 0,
        total_plantation: 0
      },
      factoryCount: 0,
      factoryCountState: 0,
      district_name: "",
      state_name: "",
      factoryCtg: {
        total: 0,
        blf: 0,
        ef: 0,
        it: 0
      },
      factoryCtgState: {
        total: 0,
        blf: 0,
        ef: 0,
        it: 0
      },
      districts: [],
      gotStates: []
    };
  },
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LCircle
  },
  mounted() {
    this.receiveStates();
  },
  methods: {
    receiveStates() {
      this.axios
        .get("http://774dc56d.ngrok.io/api/v1/state-list")
        .then(response => {
          this.gotStates = response.data.data;
        })
        .catch();
    },
    stateSelected(selectState) {
      this.getMaleFemaleCountState(selectState);
      this.getFactoryCountState(selectState);
      this.factoryCatgState(selectState);
    },
    getMaleFemaleCountState(selectState) {
      this.axios
        .get(`http://774dc56d.ngrok.io/api/v1/state/${selectState}`)
        .then(response => {
          this.xyzState = response.data.data;
          this.state_name = response.data.state;
          this.datacollectionDoughnutMaleFemale = {
            labels: ["Male", "Female"],
            datasets: [
              {
                label: "Data One",
                backgroundColor: ["#B83125", "#027585"],
                data: [this.xyzState.Male_count, this.xyzState.Female_count]
              }
            ]
          };
          this.datacollectionBarQrCode = {
            labels: [
              "Pending",
              "Processing",
              "On-Print",
              "Downloaded",
              "Dispatched",
              "Printed"
            ],
            datasets: [
              {
                label: "QR code generation Progress",
                backgroundColor: [
                  "#2E9CA6",
                  "#DC3F76",
                  "#7446B9",
                  "#C0C0C0",
                  "#F96232",
                  "#9FB328"
                ],
                pointBackgroundColor: "white",
                borderWidth: 1,
                pointBorderColor: "#249EBF",
                data: [
                  this.xyzState.pending,
                  this.xyzState.processing,
                  this.xyzState.onprint,
                  this.xyzState.downloaded,
                  this.xyzState.dispatched,
                  this.xyzState.printed
                ]
              }
            ]
          };
          this.datacollectionBarAreaVsGrowerCode = {
            labels: ["0-2 ha", "2.1-4 ha", "4.1-6 ha", "6.1-8 ha", "8.1-10.2"],
            datasets: [
              {
                label: "Number of growers under certain area of Plantation",
                backgroundColor: [
                  "#4A759E",
                  "#4A759E",
                  "#4A759E",
                  "#4A759E",
                  "#4A759E"
                ],
                pointBackgroundColor: "white",
                borderWidth: 1,
                pointBorderColor: "#249EBF",
                data: [
                  this.xyzState.uptoTwo,
                  this.xyzState.uptoFour,
                  this.xyzState.uptoSix,
                  this.xyzState.uptoEight,
                  this.xyzState.uptoTen
                ]
              }
            ]
          };
          this.datacollectionDoughnutCaste = {
            labels: ["ST", "SC", "OBC", "MOBC", "GEN"],
            datasets: [
              {
                label: "Data One",
                backgroundColor: [
                  "#2E9CA6",
                  "#DC3F76",
                  "#7446B9",
                  "#C0C0C0",
                  "#F96232"
                ],
                data: [
                  this.xyzState.ST,
                  this.xyzState.SC,
                  this.xyzState.OBC,
                  this.xyzState.MOBC,
                  this.xyzState.GEN
                ]
              }
            ]
          };
          this.center = this.xyzState.location;
          this.markerLatLng = this.xyzState.location;
        })
        .catch();
    },
    getFactoryCountState(selectState) {
      this.axios
        .get(`http://774dc56d.ngrok.io/api/v1/factory-count/${selectState}`)
        .then(response => {
          console.log("dsdsds");
          this.factoryCountState = response.data.data;
          // this.datacollectionDoughnutFactory = {
          //   labels: ["Factory Count"],
          //   datasets: [
          //     {
          //       label: "Data One",
          //       backgroundColor: ["#B83125", "#027585"],
          //       data: [this.factoryCount]
          //     }
          //   ]
          // };
        })
        .catch();
    },
    factoryCatgState(selectState) {
      this.axios
        .get(
          `http://774dc56d.ngrok.io/api/v1/state/factory-category/${selectState}`
        )
        .then(response => {
          this.factoryCtgState = response.data.data;
          this.datacollectionFactoryCatgPie = {
            labels: ["BLF", "EF", "IT"],
            datasets: [
              {
                label: "Data One",
                backgroundColor: ["#CD5C5C", "#a9c722", "#c77722"],
                data: [
                  this.factoryCtgState.BLF,
                  this.factoryCtgState.EF,
                  this.factoryCtgState.IT
                ]
              }
            ]
          };
        })
        .catch();
    },

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