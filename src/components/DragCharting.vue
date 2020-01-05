<template>
  <div
    class="container-fluid mb-2 overflow-hidden"
    style="padding-left: 0px !important; padding-right: 0px !important;"
  >
    <div class="row">
      <div class="col-md-7">
        <div style="height: 100vh;">
          <l-map style="height: 100%; width: 100%" :zoom="zoom" :center="center">
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
            <l-marker :lat-lng="markerLatLng"></l-marker>
          </l-map>
        </div>
      </div>
      <div class="col-md-5">
        <div class="row">
          <div class="col-md-6" style="padding-left:0px !important;">
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
          <div
            class="col-md-6"
            v-if="selectState"
            style="padding-left:0px !important; padding-right: 25px !important;"
          >
            <label class="my-1 mr-2" for="inlineFormCustomSelectPref">Select Districts</label>
            <select
              class="custom-select my-1 mr-sm-2"
              v-model="selectDistrict"
              @change="districtSelected(selectDistrict)"
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
        <div class="row mt-2">
          <div
            class="col-md-5"
            style="height:250px; padding-left: 0px !important; padding-right:0px !important;"
          >
            <div class="card bg-dark">
              <div class="card-body text-white py-2 px-4">
                <h6>Total factories</h6>
                <h2 v-if="this.factoryCtg.total > 0" class="mt-4">{{ this.factoryCtg.total }}</h2>
                <h2 class="mt-4" v-else>{{ this.factoryCtgState.total }}</h2>
              </div>
            </div>
          </div>
          <div class="col-md-7" style="height:250px; padding-right:25px !important;">
            <div class="card bg-dark">
              <div class="card-body py-2">
                <piefactorycatg-chart
                  :chart-data="datacollectionFactoryCatgPie"
                  :options="optionspie"
                  :height="220"
                  :width="100"
                ></piefactorycatg-chart>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div
            class="col-md-5"
            style="padding-left: 0px !important; padding-right: 0px !important;"
          >
            <div class="card bg-dark">
              <div
                class="card-body text-white"
                style="padding-top:10px !important; padding-bottom:5px !important;"
              >
                <h6>Total number of Small Growers</h6>
                <h2 v-if="this.xyz.Grower_count > 0" class="mt-5">{{this.xyz.Grower_count}}</h2>
                <h2 class="mt-5" v-else>{{this.xyzState.Grower_count}}</h2>
                <!-- <h2 class="mt-4">{{ this.xyzState.Grower_count }}</h2> -->
              </div>
            </div>
          </div>
          <div class="col-md-7" style="padding-right: 25px !important;">
            <div class="card bg-dark">
              <div
                class="card-body text-white"
                style="padding-top:10px !important; padding-bottom:5px !important;"
              >
                <h6>Total area under plantation of STG</h6>
                <!-- <h6>of STG in {{ this.xyz.district }}</h6> -->
                <h2
                  v-if="this.xyz.total_plantation > 0"
                  class="mt-5"
                >{{ this.xyz.total_plantation }} ha</h2>
                <h2 class="mt-5" v-else>{{this.xyzState.total_plantation}}</h2>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="card bg-dark" style="margin-top: 4px;">
            <barareavsgrower-chart
              :chart-data="datacollectionBarAreaVsGrowerCode"
              :options="optionsbarareavsgrower"
              :height="250"
            ></barareavsgrower-chart>
          </div>
        </div>
      </div>
    </div>

    <div class="row px-3 pb-4">
      <div class="col-md-4">
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
      <div class="col-md-4" v-if="selectState">
        <label class="my-1 mr-2" for="inlineFormCustomSelectPref">Select Districts</label>
        <select
          class="custom-select my-1 mr-sm-2"
          v-model="selectDistrict"
          @change="districtSelected(selectDistrict)"
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
    <div class="row">
      <div class="col-md-5" style="padding-right:0px !important;">
        <div class="row">
          <div class="col-md-6" style="padding-right:0px !important;">
            <div class="card bg-dark">
              <div
                class="card-body text-white"
                style="padding-top:10px !important; padding-bottom:5px !important;"
              >
                <h6>Total number of Small Growers</h6>
                <h2 v-if="this.xyz.Grower_count > 0" class="mt-5">{{this.xyz.Grower_count}}</h2>
                <h2 class="mt-5" v-else>{{this.xyzState.Grower_count}}</h2>
                <!-- <h2 class="mt-4">{{ this.xyzState.Grower_count }}</h2> -->
              </div>
            </div>
          </div>
          <div class="col-md-6" style="padding-left:5px !important;">
            <div class="card bg-dark">
              <div
                class="card-body text-white"
                style="padding-top:10px !important; padding-bottom:5px !important;"
              >
                <h6>Total area under plantation of STG</h6>
                <!-- <h6>of STG in {{ this.xyz.district }}</h6> -->
                <h2
                  v-if="this.xyz.total_plantation > 0"
                  class="mt-5"
                >{{ this.xyz.total_plantation }} ha</h2>
                <h2 class="mt-5" v-else>{{this.xyzState.total_plantation}}</h2>
              </div>
            </div>
          </div>
        </div>
        <div class="card bg-dark" style="margin-top: 4px;">
          <barareavsgrower-chart
            :chart-data="datacollectionBarAreaVsGrowerCode"
            :options="optionsbarareavsgrower"
            :height="380"
          ></barareavsgrower-chart>
        </div>
      </div>
      <div class="col-md-7" style="padding-left: 5px !important;">
        <div style="height: 100%;">
          <l-map style="height: 100%; width: 100%" :zoom="zoom" :center="center">
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
            <l-marker :lat-lng="markerLatLng"></l-marker>
          </l-map>
        </div>
      </div>
    </div>
    <div class="row" style="padding-top:5px;">
      <div class="col-md-3" style="padding-right:0px !important;">
        <div class="card bg-dark px-4" style="height:360px;">
          <doughnutmalefemale-chart
            :chart-data="datacollectionDoughnutMaleFemale"
            :options="options"
            :height="350"
          ></doughnutmalefemale-chart>
        </div>
      </div>
      <div class="col-md-3" style="padding-right:0px !important; padding-left:5px !important;">
        <div class="card p-4 bg-dark" style="height:360px;">
          <barqrcode-chart
            :chart-data="datacollectionBarQrCode"
            :options="optionsbar"
            :height="306"
          ></barqrcode-chart>
        </div>
      </div>
      <div class="col-md-3" style="padding-right:0px !important; padding-left:5px !important;">
        <div class="card bg-dark px-4 pb-2" style="height:360px;">
          <doughnutcaste-chart
            :chart-data="datacollectionDoughnutCaste"
            :options="optionssemidough"
            :height="350"
          ></doughnutcaste-chart>
        </div>
      </div>
      <div class="col-md-3" style="padding-left:5px !important;">
        <div class="card bg-dark" style="height:360px;">
          <div
            class="card-body text-white"
            style="padding-top:10px !important; padding-bottom:5px !important;"
          >
            <h6>Total factories</h6>
            <h2 v-if="this.factoryCtg.total > 0" class="mt-4">{{ this.factoryCtg.total }}</h2>
            <h2 class="mt-4" v-else>{{ this.factoryCtgState.total }}</h2>
            <div class="card bg-dark px-4 pb-2">
              <piefactorycatg-chart
                :chart-data="datacollectionFactoryCatgPie"
                :options="optionspie"
                :height="220"
              ></piefactorycatg-chart>
            </div>
          </div>
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
import PiefactorycatgChart from "./charts/PiefactorycatgChart.js";

// import DoughnutfactoryChart from "./charts/DoughnutfactoryChart.js";

const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutoutPercentage: 65,

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
      zoomControl: false,
      attributionControl: false,
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 12,
      center: [28.6139, 77.209],
      markerLatLng: [28.6139, 77.209],

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
      gotStates: [],
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
      }
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

    districtSelected(selectDistrict) {
      this.getMaleFemaleCount(selectDistrict);
      this.getFactoryCount(selectDistrict);
      this.factoryCatg(selectDistrict);
    },
    getMaleFemaleCount(selectDistrict) {
      // `http://4077d282.ngrok.io/api/v1/district/${selectDistrict}`
      // "http://helloWorld.test/api/malefemale"
      this.axios
        .get(`http://774dc56d.ngrok.io/api/v1/district/${selectDistrict}`)
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
          this.center = this.xyz.location;
          this.markerLatLng = this.xyz.location;
        })
        .catch();
    },
    getFactoryCount(selectDistrict) {
      // `http://4077d282.ngrok.io/api/v1/factory-count/${selectDistrict}`
      // "http://helloWorld.test/api/factory"
      this.axios
        .get(`http://774dc56d.ngrok.io/api/v1/factory-count/${selectDistrict}`)
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
    },
    factoryCatg(selectDistrict) {
      this.axios
        .get(
          `http://774dc56d.ngrok.io/api/v1/district/factory-category/${selectDistrict}`
        )
        .then(response => {
          this.factoryCtg = response.data.data;
          this.datacollectionFactoryCatgPie = {
            labels: ["BLF", "EF", "IT"],
            datasets: [
              {
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
  }
};
</script>

<style>
.small {
  max-width: 600px;
  margin: 150px auto;
}
</style>
