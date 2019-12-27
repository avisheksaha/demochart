<template>
  <div class="container-fluid">
    <!-- {{gotStates}} -->
    <div class="row px-3 pb-4">
      <div class="col-md-4">
        <label class="my-1 mr-2" for="inlineFormCustomSelectPref"
          >Select State</label
        >
        <div v-if="gotStates.length > 0">
          <select
            class="custom-select my-1 mr-sm-2"
            v-model="selectState"
            id="inlineFormCustomSelectPref"
          >
            <option selected>Choose...</option>
            <option
              v-for="(gotState, index) in gotStates"
              :key="index"
              :value="gotState"
              >{{ gotState.name }}</option
            >
          </select>
        </div>
      </div>
      <div class="col-md-4" v-if="selectState">
        <label class="my-1 mr-2" for="inlineFormCustomSelectPref"
          >Select Districts</label
        >
        <select
          class="custom-select my-1 mr-sm-2"
          v-model="selectDistrict"
          @change="stateSelected(selectDistrict)"
          id="inlineFormCustomSelectPref"
        >
          <option selected>Choose...</option>
          <option
            v-for="(district, index) in selectState.districts"
            :key="index"
            :value="district"
            >{{ district }}</option
          >
        </select>
      </div>
    </div>
    <div class="row">
      <div class="col-md-3">
        <div class="card bg-dark">
          <div class="card-body text-white">
            <h6>Total number of Small Growers in {{ this.xyz.district }}</h6>
            <h2 class="mt-5">{{ this.xyz.Grower_count }}</h2>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-dark">
          <div class="card-body text-white">
            <h6>Total area under tea plantation of STG</h6>
            <h2 class="mt-5">{{ this.xyz.total_plantation }} ha</h2>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-dark">
          <div class="card-body text-white">
            <h6>Total factories in {{ this.xyz.district }}</h6>
            <h2 class="mt-5">{{ this.factoryCount }}</h2>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-dark">
          <div class="card-body text-white">
            <h6>Total made Tea yesterday</h6>
            <h2 class="mt-5">23345 kg</h2>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-2 mb-2">
      <div class="col-md-6">
        <div class="card p-4 bg-dark">
          <barqrcode-chart
            :chart-data="datacollectionBarQrCode"
            :options="optionsbar"
            :height="306"
          ></barqrcode-chart>
        </div>
      </div>
      <div class="col-md-6">
        <div style="height: 100%;">
          <l-map
            style="height: 100%; width: 100%"
            :zoom="zoom"
            :center="center"
          >
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
            <l-marker :lat-lng="markerLatLng"></l-marker>
          </l-map>
        </div>
      </div>
    </div>

    <div class="row mb-2">
      <div class="col-md-4">
        <div class="card p-4 bg-dark">
          <doughnutmalefemale-chart
            :chart-data="datacollectionDoughnutMaleFemale"
            :options="options"
          ></doughnutmalefemale-chart>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card p-4 bg-dark">
          <doughnutcaste-chart
            :chart-data="datacollectionDoughnutCaste"
            :options="optionssemidough"
          ></doughnutcaste-chart>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card p-4 bg-dark">
          <barareavsgrower-chart
            :chart-data="datacollectionBarAreaVsGrowerCode"
            :options="optionsbarareavsgrower"
            :height="306"
          ></barareavsgrower-chart>
        </div>
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

// import DoughnutfactoryChart from "./charts/DoughnutfactoryChart.js";

const options = {
  responsive: true,
  maintainAspectRatio: true,
  cutoutPercentage: 50,

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
  }
};

const optionssemidough = {
  responsive: true,
  maintainAspectRatio: true,
  cutoutPercentage: 50,

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
    DoughnutcasteChart
    // DoughnutfactoryChart
  },
  data() {
    return {
      zoomControl: false,
      attributionControl: false,
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 12,
      center: [47.41322, -1.219482],
      markerLatLng: [47.31322, -1.219482],

      selectState: null,
      selectDistrict: null,
      districts: [],
      options,
      optionsbar,
      optionsbarareavsgrower,
      optionssemidough,
      // datacollectionLine: null,
      // datacollectionBar: null,
      // datacollectionPie: null,
      datacollectionDoughnutMaleFemale: null,
      datacollectionBarQrCode: null,
      datacollectionDoughnutCaste: null,
      datacollectionBarAreaVsGrowerCode: null,
      gotStates: [],
      xyz: {},
      factoryCount: 0,
      district_name: ""
    };
  },
  mounted() {
    // this.fillDataLine();
    // this.fillDataBar();
    // this.fillDataPie();
    this.receiveStates();
    // this.fillDataDoughnut();
  },
  methods: {
    receiveStates() {
      this.axios
        .get("http://a50cec0d.ngrok.io/api/v1/state-list")
        .then(response => {
          this.gotStates = response.data.data;
        })
        .catch();
    },

    stateSelected(selectDistrict) {
      this.getMaleFemaleCount(selectDistrict);
      this.getFactoryCount(selectDistrict);
    },
    getMaleFemaleCount(selectDistrict) {
      // `http://4077d282.ngrok.io/api/v1/district/${selectDistrict}`
      // "http://helloWorld.test/api/malefemale"
      this.axios
        .get(`http://a50cec0d.ngrok.io/api/v1/district/${selectDistrict}`)
        .then(response => {
          this.xyz = response.data.data;
          this.district_name = response.data.district;
          this.datacollectionDoughnutMaleFemale = {
            labels: ["Male", "Female"],
            datasets: [
              {
                label: "Data One",
                backgroundColor: ["#B83125", "#027585"],
                data: [this.xyz.Male_count, this.xyz.Female_count]
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
                  this.xyz.pending,
                  this.xyz.processing,
                  this.xyz.onprint,
                  this.xyz.downloaded,
                  this.xyz.dispatched,
                  this.xyz.printed
                ]
              }
            ]
          };
          this.datacollectionBarAreaVsGrowerCode = {
            labels: ["0-2 ha", "2.1-4 ha", "4.1-6 ha", "6.1-8 ha", "8.1-10.2"],
            datasets: [
              {
                label: "Data One",
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
                  this.xyz.uptoTwo,
                  this.xyz.uptoFour,
                  this.xyz.uptoSix,
                  this.xyz.uptoEight,
                  this.xyz.uptoTen
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
                  this.xyz.ST,
                  this.xyz.SC,
                  this.xyz.OBC,
                  this.xyz.MOBC,
                  this.xyz.GEN
                ]
              }
            ]
          };
        })
        .catch();
    },
    getFactoryCount(selectDistrict) {
      // `http://4077d282.ngrok.io/api/v1/factory-count/${selectDistrict}`
      // "http://helloWorld.test/api/factory"
      this.axios
        .get(`http://a50cec0d.ngrok.io/api/v1/factory-count/${selectDistrict}`)
        .then(response => {
          console.log("dsdsds");
          this.factoryCount = response.data.data;
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
    // fillDataBar() {
    //   this.datacollectionBar = {
    //     labels: ["January", "February", "March", "April", "May"],
    //     datasets: [
    //       {
    //         label: "Data One",
    //         backgroundColor: [
    //           "#CD5C5C",
    //           "#a9c722",
    //           "#c77722",
    //           "#22c738",
    //           "#d667c4"
    //         ],
    //         data: [40, 39, 20, 40, 39]
    //       }
    //     ]
    //   };
    // },
    // fillDataPie() {
    //   this.datacollectionPie = {
    //     labels: ["January", "February", "March", "April", "May"],
    //     datasets: [
    //       {
    //         label: "Data One",
    //         backgroundColor: [
    //           "#CD5C5C",
    //           "#a9c722",
    //           "#c77722",
    //           "#22c738",
    //           "#d667c4"
    //         ],
    //         data: [40, 39, 10, 40, 39]
    //       }
    //     ]
    //   };
    // },

    // receiveArticleComments() {
    //   this.axios
    //     .get("http://helloWorld.test/api/testChart")
    //     .then(response => {
    //       this.xyz = response.data.data;
    //     })
    //     .catch();
    // }
  }
};
</script>

<style>
.small {
  max-width: 600px;
  margin: 150px auto;
}
</style>
