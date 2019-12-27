<template>
  <div>
    <!-- {{gotStates}} -->
    <!-- <div class="row px-3 pb-4">
      <div class="col-md-4">
        <label class="my-1 mr-2" for="inlineFormCustomSelectPref">Select State</label>
        <div v-if="gotStates.length > 0">
          <select
            class="custom-select my-1 mr-sm-2"
            v-model="selectState"
            id="inlineFormCustomSelectPref"
          >
            <option selected>Choose...</option>
            <option
              v-for="(gotState,index) in gotStates"
              :key="index"
              :value="gotState"
            >{{gotState.name}}</option>
          </select>
        </div>
      </div>
      <div class="col-md-4" v-if="selectState">
        <label class="my-1 mr-2" for="inlineFormCustomSelectPref">Select Districts</label>
        <select
          class="custom-select my-1 mr-sm-2"
          v-model="selectDistrict"
          @change="stateSelected(selectDistrict)"
          id="inlineFormCustomSelectPref"
        >
          <option selected>Choose...</option>
          <option
            v-for="(district,index) in selectState.districts"
            :key="index"
            :value="district"
          >{{district}}</option>
        </select>
      </div>
    </div>-->
    <div class="row">
      <div class="col-md-3">
        <div class="card bg-dark p-4" style>
          <!-- {{xyz.article}} -->
          <doughnutmalefemale-chart
            :chart-data="datacollectionDoughnutMaleFemale"
            :options="options"
          ></doughnutmalefemale-chart>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-dark p-4">
          <doughnutfactory-chart :chart-data="datacollectionDoughnutFactory" :options="options"></doughnutfactory-chart>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-dark p-4">
          <!-- <doughnut-chart :chart-data="datacollectionDoughnut"></doughnut-chart> -->
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-dark p-4">
          <!-- <doughnut-chart :chart-data="datacollectionDoughnut"></doughnut-chart> -->
        </div>
      </div>
    </div>
    <!-- <div class="row">
      <div class="col-md-6">
        <pie-chart :chart-data="datacollectionPie"></pie-chart>
      </div>
      <div class="col-md-6">
        <doughnut-chart :chart-data="datacollectionDoughnut"></doughnut-chart>
      </div>
    </div>-->
    <!-- {{xyz}} -->
    <!-- <button @click="fillData()">Randomize</button> -->
  </div>
</template>

<script>
// import LineChart from "./charts/LineChart.js";
// import BarChart from "./charts/BarChart.js";
// import PieChart from "./charts/PieChart.js";
import DoughnutmalefemaleChart from "./charts/DoughnutmalefemaleChart.js";
import DoughnutfactoryChart from "./charts/DoughnutfactoryChart.js";

const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutoutPercentage: 65,
  //   display: true,
  //   circular: true,
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
  }
};

export default {
  components: {
    // LineChart,
    // BarChart,
    // PieChart,
    DoughnutmalefemaleChart,
    DoughnutfactoryChart
  },
  data() {
    return {
      selectState: null,
      selectDistrict: null,
      districts: [],
      options,
      // datacollectionLine: null,
      // datacollectionBar: null,
      // datacollectionPie: null,
      datacollectionDoughnutMaleFemale: null,
      datacollectionDoughnutFactory: null,

      gotStates: [],
      xyz: {},
      factoryCount: 0
    };
  },
  mounted() {
    // this.fillDataLine();
    // this.fillDataBar();
    // this.fillDataPie();
    // this.receiveStates();
    // this.fillDataDoughnut();

    this.getMaleFemaleCount();
    this.getFactoryCount();
  },
  methods: {
    // receiveStates() {
    //   this.axios
    //     .get("http://1709b804.ngrok.io/api/v1/state-list")
    //     .then(response => {
    //       this.gotStates = response.data.data;
    //     })
    //     .catch();
    // },

    // stateSelected(selectDistrict) {
    //   this.getMaleFemaleCount(selectDistrict);
    // },

    getMaleFemaleCount() {
      //`http://1709b804.ngrok.io/api/v1/district/${selectDistrict}`
      this.axios
        .get("http://helloworld.test/api/malefemale")
        .then(response => {
          this.xyz = response.data.data;
          this.datacollectionDoughnutMaleFemale = {
            labels: [
              "Male: " + this.xyz.article,
              "Female: " + this.xyz.comment
            ],
            datasets: [
              {
                label: "Data One",
                backgroundColor: ["#B83125", "#027585"],
                data: [this.xyz.article, this.xyz.comment]
              }
            ]
          };
        })
        .catch();
    },
    getFactoryCount() {
      // `http://1709b804.ngrok.io/api/v1/factory-count/${selectDistrict}`
      this.axios
        .get("http://helloworld.test/api/factory-count")
        .then(response => {
          this.factoryCount = response.data.data;
          this.datacollectionDoughnutFactory = {
            labels: ["Factory Count"],
            datasets: [
              {
                label: "Data One",
                backgroundColor: ["#B83125", "#027585"],
                data: [this.factoryCount]
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