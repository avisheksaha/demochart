<template>
  <div
    class="container-fluid full-height overflow-hidden"
    style="padding-left:8px !important; padding-right:8px !important;"
  >
    <!-- {{gotStates}} -->
    <div class="row row1">
      <div class="col-md-4">
        <label class="my-1 mr-2 text-white" for="inlineFormCustomSelectPref">Select State</label>
        <div v-if="gotStates.length > 0">
          <select
            class="custom-select my-1 mr-sm-2"
            v-model="selectState"
            @change="stateSelected(selectState.id)"
            id="inlineFormCustomSelectPref"
          >
            <option value="null" disabled>Select a State</option>
            <option
              v-for="(gotState, index) in gotStates"
              :key="index"
              :value="gotState"
            >{{ gotState.name }}</option>
          </select>
        </div>
      </div>
      <div class="col-md-4" v-if="selectState">
        <label class="my-1 mr-2 text-white" for="inlineFormCustomSelectPref">Select Districts</label>
        <select
          class="custom-select my-1 mr-sm-2"
          v-model="selectDistrict"
          @change="districtSelected(selectDistrict)"
          id="inlineFormCustomSelectPref"
        >
          <option value="null">Select a district</option>
          <option
            v-for="(district, index) in selectState.districts"
            :key="index"
            :value="district"
          >{{ district }}</option>
        </select>
      </div>
    </div>
    <div class="row row2">
      <div class="col-md-4 pr-0 full-height">
        <div class="row ht20">
          <div class="col-md-6 pr-0 full-height">
            <div class="card bg-dark full-height">
              <div
                class="card-body text-white"
                style="padding-top:10px !important; padding-bottom:0px !important;"
              >
                <h6 class="titleCard">Total number of Small Growers</h6>
                <h2 class="cardValue mt-1">{{this.growersDataState.Grower_count}}</h2>
              </div>
            </div>
          </div>
          <div class="col-md-6 full-height" style="padding-left:5px !important;">
            <div class="card bg-dark full-height">
              <div
                class="card-body text-white"
                style="padding-top:10px !important; padding-bottom:0px !important;"
              >
                <h6 class="titleCard">Total area under plantation</h6>
                <h2 class="cardValue mt-1">{{this.growersDataState.total_plantation}}</h2>
              </div>
            </div>
          </div>
        </div>
        <div class="row ht80">
          <div class="col-md-12 full-height">
            <div class="card bg-dark full-height">
              <barareavsgrower-chart
                :chart-data="datacollectionBarAreaVsGrowerCode"
                :options="optionsbarareavsgrower"
                :styles="myStyles"
              ></barareavsgrower-chart>
            </div>
          </div>
        </div>
      </div>
      <div
        class="col-md-4 full-height"
        style="padding-left: 5px !important; padding-right: 0px !important;"
      >
        <div style="height: 100%;">
          <l-map style="height: 100%; width: 100%" :zoom="zoom" :center="center">
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
            <l-marker :lat-lng="markerLatLng"></l-marker>
          </l-map>
        </div>
      </div>
      <div class="col-md-4 full-height" style="padding-left: 5px;">
        <div class="card px-4 bg-dark full-height">
          <barqrcode-chart
            :chart-data="datacollectionBarQrCode"
            :options="optionsbar"
            :styles="myStyles"
          ></barqrcode-chart>
        </div>
      </div>
    </div>
    <div class="row row3">
      <div class="col-md-3 full-height" style="padding-right:0px !important;">
        <div class="card bg-dark full-height px-4">
          <doughnutmalefemale-chart
            :chart-data="datacollectionDoughnutMaleFemale"
            :options="options"
            :style="myStyles"
          ></doughnutmalefemale-chart>
        </div>
      </div>
      <div
        class="col-md-3 full-height"
        style="padding-right:0px !important; padding-left:5px !important;"
      >
        <div class="card px-4 bg-dark full-height">
          <doughnutcaste-chart
            :chart-data="datacollectionDoughnutCaste"
            :options="optionssemidough"
            :style="myStyles"
          ></doughnutcaste-chart>
        </div>
      </div>
      <div
        class="col-md-3 full-height"
        style="padding-left:5px !important; padding-right:0px !important;"
      >
        <div class="card bg-dark ht20 d-flex flex-row justify-content-center align-items-center">
          <div>
            <h6 class="text-white">Total factories:</h6>
          </div>
          <div class="pl-2 text-white">
            <h4>{{ this.factoryCtgState.total }}</h4>
          </div>
        </div>
        <div class="card bg-dark ht80">
          <piefactorycatg-chart
            :chart-data="datacollectionFactoryCatgPie"
            :options="optionspie"
            :style="myStyles"
          ></piefactorycatg-chart>
        </div>
      </div>
      <div class="col-md-3 full-height" style="padding-left:5px !important;">
        <div class="card bg-dark full-height"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";

// Vue.component("l-map", Vue2Leaflet.LMap);
// Vue.component("l-tile-layer", Vue2Leaflet.LTileLayer);
// Vue.component("l-circle", Vue2Leaflet.LCircle);
// import LineChart from "./charts/LineChart.js";
// import BarChart from "./charts/BarChart.js";
// import PieChart from "./charts/PieChart.js";
import DoughnutmalefemaleChart from "./charts/DoughnutmalefemaleChart.js";
import BarqrcodeChart from "./charts/BarqrcodeChart.js";
import BarareavsgrowerChart from "./charts/BarareavsgrowerChart.js";
import DoughnutcasteChart from "./charts/DoughnutcasteChart.js";
import PiefactorycatgChart from "./charts/PiefactorycatgChart.js";

// import DoughnutfactoryChart from "./charts/DoughnutfactoryChart.js";

const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutoutPercentage: 65,
  segmentShowStroke: false,

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
    fontSize: 14,
    fontFamily: "'Helvetica Neue',Helvetica, Arial, sans-serif",
    text: "Male Female ratio small Tea Growers"
  }
  // rotation: 1 * Math.PI,
  // circumference: 1 * Math.PI
};

const optionsbar = {
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    // position: "right",
    labels: {
      // This more specific font property overrides the global property
      fontColor: "white"
    }
  },
  scales: {
    yAxes: [
      {
        display: true,
        ticks: {
          fontColor: "white"
        }
      }
    ],
    xAxes: [
      {
        display: true,
        ticks: {
          fontColor: "white"
        }
      }
    ]
  },
  title: {
    display: true,
    fontColor: "white",
    fontSize: 14,
    fontFamily: "'Helvetica Neue',Helvetica, Arial, sans-serif",
    text: "QR code generation progress"
  }
};

const optionsbarareavsgrower = {
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    // position: "right",
    labels: {
      // This more specific font property overrides the global property
      fontColor: "white"
    }
  },
  scales: {
    yAxes: [
      {
        display: true,
        scaleLabel: {
          display: true,
          labelString: "Number of Growers",
          fontColor: "white"
        },
        ticks: {
          fontColor: "white"
        }
      }
    ],
    xAxes: [
      {
        display: true,
        scaleLabel: {
          display: true,
          labelString: "Area Under Plantation",
          fontColor: "white"
        },
        ticks: {
          fontColor: "white"
        }
      }
    ]
  },
  title: {
    display: true,
    fontColor: "white",
    fontSize: 14,
    fontFamily: "'Helvetica Neue',Helvetica, Arial, sans-serif"
    // text: "Number of growers under certain area of plantation "
  }
};

const optionssemidough = {
  responsive: true,
  maintainAspectRatio: false,
  cutoutPercentage: 70,

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
  rotation: 1 * Math.PI,
  circumference: 1 * Math.PI,
  title: {
    display: true,
    fontColor: "white",
    fontSize: 14,
    fontFamily: "'Helvetica Neue',Helvetica, Arial, sans-serif",
    text: "Grower Caste-wise Distribution"
  }
};

const optionspie = {
  responsive: true,
  maintainAspectRatio: false,
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
    fontSize: 14,
    fontFamily: "'Helvetica Neue',Helvetica, Arial, sans-serif",
    text: "Factory Category"
  }
};

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    // LineChart,
    // BarChart,
    // PieChart,
    DoughnutmalefemaleChart,
    BarqrcodeChart,
    BarareavsgrowerChart,
    DoughnutcasteChart,
    PiefactorycatgChart
    // DoughnutfactoryChart
  },
  data() {
    return {
      myStyles: {
        height: "100%"
      },
      zoomControl: false,
      attributionControl: false,
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 12,
      center: [28.6139, 77.209],
      markerLatLng: [28.6139, 77.209],

      gotStates: [],
      selectState: null,
      selectDistrict: null,

      districts: [],
      options,
      optionsbar,
      optionsbarareavsgrower,
      optionssemidough,
      optionspie,
      // datacollectionLine: null,
      // datacollectionBar: null,
      // datacollectionPie: null,
      datacollectionDoughnutMaleFemale: null,
      datacollectionBarQrCode: null,
      datacollectionDoughnutCaste: null,
      datacollectionBarAreaVsGrowerCode: null,
      datacollectionFactoryCatgPie: null,

      growersDataState: {},

      district_name: "",
      state_name: "",
      factoryCtgState: {}
    };
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

    // this.fillDataLine();
  },
  methods: {
    receiveStates() {
      this.axios
        .get("http://019ce0f3.ngrok.io/api/v1/state-list")
        .then(response => {
          this.gotStates = response.data.data;
        })
        .catch();
    },

    stateSelected(selectedStateId) {
      this.getGrowersDataState(selectedStateId);
      this.factoryCatgState(selectedStateId);
    },
    getGrowersDataState(selectedStateId) {
      this.axios
        .get(`http://019ce0f3.ngrok.io/api/v1/state/${selectedStateId}`)
        .then(response => {
          this.growersDataState = response.data.data;
          this.state_name = response.data.state;
          this.datacollectionDoughnutMaleFemale = {
            labels: ["Male", "Female"],
            datasets: [
              {
                label: "Data One",
                backgroundColor: ["#B83125", "#027585"],
                borderWidth: 0,
                data: [
                  this.growersDataState.Male_count,
                  this.growersDataState.Female_count
                ]
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
                borderWidth: 0,
                pointBorderColor: "#249EBF",
                data: [
                  this.growersDataState.pending,
                  this.growersDataState.processing,
                  this.growersDataState.onprint,
                  this.growersDataState.downloaded,
                  this.growersDataState.dispatched,
                  this.growersDataState.printed
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
                borderWidth: 0,
                pointBorderColor: "#249EBF",
                data: [
                  this.growersDataState.uptoTwo,
                  this.growersDataState.uptoFour,
                  this.growersDataState.uptoSix,
                  this.growersDataState.uptoEight,
                  this.growersDataState.uptoTen
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
                borderWidth: 0,
                data: [
                  this.growersDataState.ST,
                  this.growersDataState.SC,
                  this.growersDataState.OBC,
                  this.growersDataState.MOBC,
                  this.growersDataState.GEN
                ]
              }
            ]
          };
          this.center = this.growersDataState.location;
          this.markerLatLng = this.growersDataState.location;
        })
        .catch();
    },

    factoryCatgState(selectedStateId) {
      this.axios
        .get(
          `http://019ce0f3.ngrok.io/api/v1/state/factory-category/${selectedStateId}`
        )
        .then(response => {
          this.factoryCtgState = response.data.data;
          this.datacollectionFactoryCatgPie = {
            labels: ["BLF", "EF", "IT"],
            datasets: [
              {
                label: "Data One",
                backgroundColor: ["#CD5C5C", "#a9c722", "#c77722"],
                borderWidth: 0,
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

    districtSelected(selectedDistrictName) {
      if (this.selectDistrict == null) {
        return;
      }
      this.getGrowersDataDistrict(selectedDistrictName);
      this.factoryCatgDistrict(selectedDistrictName);
    },
    getGrowersDataDistrict(selectedDistrictName) {
      this.growersDataState = {};

      this.axios
        .get(`http://019ce0f3.ngrok.io/api/v1/district/${selectedDistrictName}`)
        .then(response => {
          this.growersDataState = response.data.data;
          this.district_name = response.data.district;
          this.datacollectionDoughnutMaleFemale = {
            labels: ["Male", "Female"],
            datasets: [
              {
                label: "Data One",
                borderWidth: 0,
                backgroundColor: ["#B83125", "#027585"],
                data: [
                  this.growersDataState.Male_count,
                  this.growersDataState.Female_count
                ]
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
                borderWidth: 0,
                backgroundColor: [
                  "#2E9CA6",
                  "#DC3F76",
                  "#7446B9",
                  "#C0C0C0",
                  "#F96232",
                  "#9FB328"
                ],
                pointBackgroundColor: "white",
                pointBorderColor: "#249EBF",
                data: [
                  this.growersDataState.pending,
                  this.growersDataState.processing,
                  this.growersDataState.onprint,
                  this.growersDataState.downloaded,
                  this.growersDataState.dispatched,
                  this.growersDataState.printed
                ]
              }
            ]
          };
          this.datacollectionBarAreaVsGrowerCode = {
            labels: ["0-2 ha", "2.1-4 ha", "4.1-6 ha", "6.1-8 ha", "8.1-10.2"],
            datasets: [
              {
                label: "Number of growers under certain area of Plantation",
                borderWidth: 0,
                backgroundColor: [
                  "#4A759E",
                  "#4A759E",
                  "#4A759E",
                  "#4A759E",
                  "#4A759E"
                ],
                pointBackgroundColor: "white",
                pointBorderColor: "#249EBF",
                data: [
                  this.growersDataState.uptoTwo,
                  this.growersDataState.uptoFour,
                  this.growersDataState.uptoSix,
                  this.growersDataState.uptoEight,
                  this.growersDataState.uptoTen
                ]
              }
            ]
          };
          this.datacollectionDoughnutCaste = {
            labels: ["ST", "SC", "OBC", "MOBC", "GEN"],
            datasets: [
              {
                label: "Data One",
                borderWidth: 0,
                backgroundColor: [
                  "#2E9CA6",
                  "#DC3F76",
                  "#7446B9",
                  "#C0C0C0",
                  "#F96232"
                ],
                data: [
                  this.growersDataState.ST,
                  this.growersDataState.SC,
                  this.growersDataState.OBC,
                  this.growersDataState.MOBC,
                  this.growersDataState.GEN
                ]
              }
            ]
          };
          this.center = this.growersDataState.location;
          this.markerLatLng = this.growersDataState.location;
        })
        .catch();
    },
    factoryCatgDistrict(selectedDistrictName) {
      this.factoryCtgState = {};
      this.axios
        .get(
          `http://019ce0f3.ngrok.io/api/v1/district/factory-category/${selectedDistrictName}`
        )
        .then(response => {
          this.factoryCtgState = response.data.data;
          this.datacollectionFactoryCatgPie = {
            labels: ["BLF", "EF", "IT"],
            datasets: [
              {
                label: "Data One",
                borderWidth: 0,
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
    }

    // fillDataLine() {
    //   this.datacollectionLine = {
    //     labels: ["January", "February", "March", "April", "May"],
    //     datasets: [
    //       {
    //         label: "Data One",
    //         backgroundColor: ["#c77722"],
    //         data: [40, 39, 10, 40, 39]
    //       }
    //     ]
    //   };
    // },
  }
};
</script>

<style>
.small {
  max-width: 600px;
  margin: 150px auto;
}
.row1 {
  height: 10%;
}
.row2 {
  margin-bottom: 4px;
  height: 54%;
}
.row3 {
  height: 34%;
}

.full-height {
  height: 100%;
}
.ht20 {
  height: 20%;
}
.ht80 {
  margin-top: 1%;
  height: 79%;
}
@media only screen and (min-width: 801px) and (max-width: 1024px) {
}
@media only screen and (min-width: 1025px) and (max-width: 1366px) {
  .titleCard {
    font-size: 12px;
  }
  .cardValue {
    font-size: 22px;
  }
}
@media only screen and (min-width: 1367px) and (max-width: 1920px) {
  .titleCard {
    font-size: 14px;
  }
  .cardValue {
    font-size: 26px;
  }
}
</style>
