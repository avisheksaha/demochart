<template>
  <div
    class="container-fluid overflow-hidden full-height position-relative"
    style="padding-left: 0px !important; padding-right: 0px !important;"
  >
    <div
      class="position-absolute text-center d-flex align-items-center justify-content-center h-100 w-100"
      v-if="loadingBtn"
      style="z-index:10;background: rgba(0,0,0,0.8);"
    >
      <div
        class="spinner-border text-light"
        style="width: 5rem; height: 5rem;z-index:9;"
        role="status"
      >
        <span class="sr-only text-white">Loading...</span>
      </div>
    </div>

    <div
      v-if="rightSidebarFactories"
      class="position-absolute"
      style="width: 350px; right: 0; bottom:0; top:0; height: 100%; z-index: 999;"
    >
      <div
        v-if="showLines"
        class="full-height text-white pl-4 pr-2"
        style="background-color: #17202D;"
      >
        <div class="pt-4 text-center" style="font-size: 22px;">Factory Details</div>
        <hr />
        <p>
          <span>Name:</span>
          <span class="pl-4" style="font-size: 20px;">{{factoryDataInSidebar.factory_name}}</span>
        </p>
        <p>
          <span>RC_No:</span>
          <span class="pl-4" style="font-size: 20px;">{{factoryDataInSidebar.factory_name}}</span>
        </p>
        <p class="mt-3" style="font-size: 20px;">
          <u>Growers Associated:</u>
        </p>
        <p
          class="growersDataSidebar"
          style="font-size: 18px;"
          v-for="(grower,index) in factoryDataInSidebar.growers"
          :key="index"
        >
          <span>&bull;</span>
          {{grower.grower_name}}
        </p>
      </div>
      <div
        v-if="toggleDataInSidebar"
        class="full-height text-white pl-4 pr-2"
        style="background-color: #17202D;"
      >
        <div class="pt-4 text-center" style="font-size: 22px;">Grower Details</div>
        <hr />
        <p>
          <span>Grower ID:</span>
          <span class="pl-4" style="font-size: 20px;">{{growerDataInSidebar.grower_id}}</span>
        </p>
        <p>
          <span>Name:</span>
          <span class="pl-4" style="font-size: 20px;">{{growerDataInSidebar.grower_name}}</span>
        </p>
      </div>
    </div>
    <div class="row h10">
      <div class="col-md-6">
        <div class="row">
          <div class="col-md-6 full-height">
            <label class="text-white" for="inlineFormCustomSelectPref">Select State</label>
            <div v-if="gotStates.length > 0">
              <select class="custom-select" v-model="selectState" id="inlineFormCustomSelectPref">
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
              <option value="null" disabled>Select a District</option>
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

          <div v-if="toggleFactoryLocations">
            <div v-for="(factoryLoc,index) in factoryLocations" :key="index">
              <div v-if="factoryLoc.type === 'blf'">
                <l-marker :lat-lng="factoryLoc.position" @click="toggledrawLines(factoryLoc)">
                  <l-icon :icon-size="dynamicSize" icon-url="/blfMarker.png"></l-icon>
                  <l-tooltip>{{ factoryLoc.factory_name }}</l-tooltip>
                  <l-popup>{{ factoryLoc.factory_name }}</l-popup>
                </l-marker>
              </div>
              <div v-if="factoryLoc.type === 'ef'">
                <l-marker :lat-lng="factoryLoc.position" @click="toggledrawLines(factoryLoc)">
                  <l-icon :icon-size="dynamicSize" icon-url="/efMarker.png"></l-icon>
                  <l-tooltip>{{ factoryLoc.factory_name }}</l-tooltip>
                  <l-popup>{{ factoryLoc.factory_name }}</l-popup>
                </l-marker>
              </div>
              <div v-if="factoryLoc.type === 'it'">
                <l-marker :lat-lng="factoryLoc.position" @click="toggledrawLines(factoryLoc)">
                  <l-icon :icon-size="dynamicSize" icon-url="/itMarker.png"></l-icon>
                  <l-tooltip>{{ factoryLoc.factory_name }}</l-tooltip>
                  <l-popup>{{ factoryLoc.factory_name }}</l-popup>
                </l-marker>
              </div>
            </div>
          </div>
          <div v-if="toggleFactMapGrower">
            <l-circle-marker
              v-for="(grower,index) in factoryMapGrowerLocations.growers"
              :key="index"
              :lat-lng="grower.position"
              :radius="circle.radius"
              :color="circle.color"
              :fillColor="circle.fillColor"
              :fillOpacity="circle.fillOpacity"
            >
              <l-tooltip>{{ grower.grower_name }}</l-tooltip>
              <!-- <l-popup>{{ grower.grower_id }}</l-popup> -->
            </l-circle-marker>
            <l-polyline :lat-lngs="polyline.latlngs" :color="polyline.color"></l-polyline>
          </div>

          <div v-if="toggleGrowerLocations">
            <l-circle-marker
              v-for="(growerLoc,index) in growersLocations.growersLocations"
              :key="index"
              :lat-lng="growerLoc.position"
              :radius="circle.radius"
              :color="circle.color"
              :fillColor="circle.fillColor"
              :fillOpacity="circle.fillOpacity"
            >
              <l-icon :icon-size="dynamicSize" icon-url="/itMarker.png"></l-icon>
              <l-tooltip>{{ growerLoc.grower_id }}</l-tooltip>
              <l-popup>{{ growerLoc.grower_id }}</l-popup>
            </l-circle-marker>
          </div>

          <div v-if="showTeaboardLocation">
            <l-marker
              v-for="(teaboardOffice,index) in plantationLocations.teaboardOffices"
              :key="index"
              :lat-lng="teaboardOffice.position"
            >
              <l-icon :icon-size="dynamicSize" icon-url="/teaOfficeMarker.png"></l-icon>
              <l-tooltip>{{ teaboardOffice.office_id }}</l-tooltip>
              <l-popup>{{ teaboardOffice.office_id }}</l-popup>
            </l-marker>
          </div>
          <div v-if="toggleBlfLocations">
            <div v-for="(blfLoc,index) in factoryLocations" :key="index">
              <div v-if="blfLoc.type==='blf'">
                <l-marker :lat-lng="blfLoc.position">
                  <l-icon :icon-size="dynamicSize" icon-url="/blfMarker.png"></l-icon>
                  <l-tooltip>{{ blfLoc.factory_name }}</l-tooltip>
                  <l-popup>{{ blfLoc.factory_name }}</l-popup>
                </l-marker>
              </div>
            </div>
          </div>
          <div v-if="toggleEfLocations">
            <div v-for="(efLoc,index) in factoryLocations" :key="index">
              <div v-if="efLoc.type==='ef'">
                <l-marker :lat-lng="efLoc.position">
                  <l-icon :icon-size="dynamicSize" icon-url="/efMarker.png"></l-icon>
                  <l-tooltip>{{ efLoc.factory_name }}</l-tooltip>
                  <l-popup>{{ efLoc.factory_name }}</l-popup>
                </l-marker>
              </div>
            </div>
          </div>
          <div v-if="toggleItLocations">
            <div v-for="(itLoc,index) in factoryLocations" :key="index">
              <div v-if="itLoc.type==='it'">
                <l-marker :lat-lng="itLoc.position">
                  <l-icon :icon-size="dynamicSize" icon-url="/itMarker.png"></l-icon>
                  <l-tooltip>{{ itLoc.factory_name }}</l-tooltip>
                  <l-popup>{{ itLoc.factory_name }}</l-popup>
                </l-marker>
              </div>
            </div>
          </div>
          <!-- <div style="z-index: 99999">
            <img src="../assets/logo.png" />
          </div>-->
          <!-- <l-marker :lat-lng="grab.position" @click="drawLines(grab)"></l-marker> -->

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
    <!-- <p>buttons</p> -->
    <div class="row h10 px-4">
      <div class="col text-center my-auto mx-auto border-right">
        <button
          v-if="toggleFactoryLocations"
          type="button"
          class="btn btn-light btn-lg btn-block"
          @click="openFactoryLocations"
        >Factories & Growers</button>
        <button
          v-else
          type="button"
          class="btn btn-outline-light btn-lg btn-block"
          @click="openFactoryLocations"
        >Factories & Growers</button>
      </div>

      <!-- <div class="col text-center my-auto mx-auto border-right">
        <button
          v-if="toggleGrowerLocations"
          type="button"
          class="btn btn-light btn-lg btn-block"
          @click="openGrowerLocations"
        >Growers</button>
        <button
          v-else
          type="button"
          class="btn btn-outline-light btn-lg btn-block"
          @click="openGrowerLocations"
        >Growers</button>
      </div>-->
      <div class="col text-center my-auto mx-auto border-right" @click="openTeaboardLocations">
        <button v-if="showTeaboardLocation" type="button" class="btn btn-light btn-lg btn-block">
          <span>Tea-board Office</span>
          <span class="pl-2">
            <img src="/teaOfficeMarker.png" width="26" height="26" />
          </span>
        </button>
        <button v-else type="button" class="btn btn-outline-light btn-lg btn-block">
          <span>Tea-board Office</span>
          <span class="pl-2">
            <img src="/teaOfficeMarker.png" width="26" height="26" />
          </span>
        </button>
      </div>
      <div class="col text-center my-auto mx-auto border-right">
        <button
          v-if="toggleBlfLocations"
          type="button"
          class="btn btn-light btn-lg btn-block"
          @click="openBlfLocations"
        >
          <span>BLF</span>
          <span class="pl-2">
            <img src="/blfMarker.png" width="26" height="26" />
          </span>
        </button>
        <button
          v-else
          type="button"
          class="btn btn-outline-light btn-lg btn-block"
          @click="openBlfLocations"
        >
          <span>BLF</span>
          <span class="pl-2">
            <img src="/blfMarker.png" width="26" height="26" />
          </span>
        </button>
      </div>
      <div class="col text-center my-auto mx-auto border-right">
        <button
          v-if="toggleEfLocations"
          type="button"
          class="btn btn-light btn-lg btn-block"
          @click="openEfLocations"
        >
          <span>EF</span>
          <span class="pl-2">
            <img src="/efMarker.png" width="26" height="26" />
          </span>
        </button>
        <button
          v-else
          type="button"
          class="btn btn-outline-light btn-lg btn-block"
          @click="openEfLocations"
        >
          <span>EF</span>
          <span class="pl-2">
            <img src="/efMarker.png" width="26" height="26" />
          </span>
        </button>
      </div>
      <div class="col text-center my-auto mx-auto" style="z-index: 9999;">
        <button
          v-if="toggleItLocations"
          type="button"
          class="btn btn-light btn-lg btn-block"
          @click="openItLocations"
        >
          <span>IT</span>
          <span class="pl-2">
            <img src="/itMarker.png" width="26" height="26" />
          </span>
        </button>
        <button
          v-else
          type="button"
          class="btn btn-outline-light btn-lg btn-block"
          @click="openItLocations"
        >
          <span>IT</span>
          <span class="pl-2">
            <img src="/itMarker.png" width="26" height="26" />
          </span>
        </button>
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
      loadingBtn: false,
      toggleFactMapGrower: false,
      toggleFactoryMapGrowerLocations: false,
      toggleFactoryLocations: true,
      toggleGrowerLocations: false,
      toggleBlfLocations: false,
      toggleEfLocations: false,
      toggleItLocations: false,
      selectState: null,
      selectDistrict: null,
      gotStates: [],
      iconSize: 32,
      rightSidebarFactories: false,
      factoryDataInSidebar: null,
      toggleDataInSidebar: false,
      growerDataInSidebar: null,
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
      zoom: 10,
      center: [26.1433, 91.7898],
      circle: {
        center: [26.1433, 91.7898],
        radius: 4,
        color: "#ff5100",
        fillColor: "#ff5100",
        fillOpacity: 1
      },
      factoryLocations: [
        {
          factory_id: 101,
          type: "blf",
          factory_name: "Arena Tea Factory",
          position: [27.520451064122113, 95.24322509765624]
        },
        {
          factory_id: 102,
          type: "it",
          factory_name: "ITPlant1 Tea Factory",
          position: [27.4778163898063, 95.31600952148438]
        },
        {
          factory_id: 103,
          type: "it",
          factory_name: "ITPlant2 Tea Factory",
          position: [27.498, 95.34]
        },
        {
          factory_id: 104,
          type: "ef",
          factory_name: "MMMM Tea Factory",
          position: [27.55, 95.1678]
        }
      ],
      growersLocations: [
        {
          grower_id: 1,
          grower_name: "First Grower",
          position: [27.36201054924028, 94.82025146484375]
        },
        {
          grower_id: 2,
          grower_name: "Second Grower",
          position: [27.36810861957394, 94.88616943359375]
        },
        {
          grower_id: 3,
          grower_name: "Third Grower",
          position: [27.409566585950014, 94.95208740234375]
        },
        {
          grower_id: 4,
          grower_name: "Fourth Grower",
          position: [27.424195097553206, 94.85458374023438]
        },
        {
          grower_id: 5,
          grower_name: "Fifth Grower",
          position: [27.36810861957394, 94.94247436523438]
        }
      ],
      plantationLocations: {
        teaboardOffices: [
          {
            office_id: "O-441",
            position: [27.497308575744988, 95.01937866210938]
          },
          {
            office_id: "0-442",
            position: [27.452227661315074, 94.87518310546875]
          },
          {
            office_id: "0-443",
            position: [27.453446306882164, 94.9658203125]
          },
          {
            office_id: "0-443",
            position: [27.468069003215714, 95.02487182617188]
          }
        ],

        blf: [
          {
            factory_id: 101,
            factory_name: "Arena Tea Factory",
            position: [27.4727, 94.913]
          },
          {
            factory_id: 102,
            factory_name: "Hamilton Tea Factory",
            position: [27.665, 94.926]
          }
        ],
        ef: [
          {
            factory_id: 103,
            factory_name: "Ef1 Tea Factory",
            position: [27.62, 94.89]
          },
          {
            factory_id: 104,
            factory_name: "Ef2 Tea Factory",
            position: [27.63, 94.86]
          }
        ],
        it: [
          {
            factory_id: 105,
            factory_name: "IT1 Tea Factory",
            position: [27.66, 94.83]
          },
          {
            factory_id: 106,
            factory_name: "IT2 Tea Factory",
            position: [27.654, 94.45]
          }
        ]
      },
      factoryMapGrowerLocations: {
        factory_id: 101,
        factory_name: "Arena Tea Factory",
        position: [27.520451064122113, 95.24322509765624],
        growers: [
          {
            grower_id: 1,
            grower_name: "First Grower",
            position: [27.36201054924028, 94.82025146484375]
          },
          {
            grower_id: 2,
            grower_name: "Second Grower",
            position: [27.36810861957394, 94.88616943359375]
          },
          {
            grower_id: 3,
            grower_name: "Third Grower",
            position: [27.409566585950014, 94.95208740234375]
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
  mounted() {
    this.receiveStates();
    this.abc;
  },

  methods: {
    receiveStates() {
      this.loadingBtn = true;
      this.axios
        .get("https://teaboardapi.sumato.tech/api/v1/state-list")
        .then(response => {
          this.loadingBtn = false;
          this.gotStates = response.data.data;
        })
        .catch();
    },
    districtSelected(selectedDistrictName) {
      if (this.selectDistrict == null) {
        return;
      }
      this.factoryLocn(selectedDistrictName);
    },
    factoryLocn(selectedDistrictName) {
      this.axios
        .get(
          `https://teaboardapi.sumato.tech/api/v1/district/factory/location/${selectedDistrictName}`
        )
        .then(response => {
          // this.markers = response.data.data.factoryloc;
          this.center = response.data.data.location;
        })
        .catch();
    },
    openFactoryLocations() {
      if (
        this.toggleBlfLocations == true ||
        this.toggleEfLocations == true ||
        this.toggleItLocations == true
      ) {
        this.toggleBlfLocations = false;
        this.toggleEfLocations = false;
        this.toggleItLocations = false;
      }
      this.toggleFactoryLocations = !this.toggleFactoryLocations;
      if (this.toggleFactoryLocations == false) {
        this.showLines = false;
        this.toggleFactMapGrower = false;
        console.log("xxxx");
      }
    },
    openGrowerLocations() {
      this.toggleGrowerLocations = !this.toggleGrowerLocations;
    },
    openBlfLocations() {
      if (
        this.toggleFactoryLocations == true ||
        this.toggleEfLocations == true ||
        this.toggleItLocations == true
      ) {
        this.toggleFactoryLocations = false;
        this.toggleEfLocations = false;
        this.toggleItLocations = false;
      }
      this.toggleBlfLocations = !this.toggleBlfLocations;
    },
    openEfLocations() {
      if (
        this.toggleFactoryLocations == true ||
        this.toggleBlfLocations == true ||
        this.toggleItLocations == true
      ) {
        this.toggleFactoryLocations = false;
        this.toggleBlfLocations = false;
        this.toggleItLocations = false;
      }
      this.toggleEfLocations = !this.toggleEfLocations;
    },
    openItLocations() {
      if (
        this.toggleFactoryLocations == true ||
        this.toggleBlfLocations == true ||
        this.toggleEfLocations == true
      ) {
        this.toggleFactoryLocations = false;
        this.toggleBlfLocations = false;
        this.toggleEfLocations = false;
      }
      this.toggleItLocations = !this.toggleItLocations;
    },

    openFactoryGrowerLocations() {
      this.showFactoryGrowerLocations = !this.showFactoryGrowerLocations;
    },
    toggledrawLines(factory) {
      //hit api to get response of factories associated with growers and store in factoryMapGrowerLocations
      // this.toggleDataInSidebar = false;
      this.showLines = !this.showLines;
      this.toggleGrowerLocations = true;
      this.toggleFactMapGrower = !this.toggleFactMapGrower;
      // this.drawLines(factory);
      this.drawLines();
      this.rightSidebarFactories = !this.rightSidebarFactories;
      this.factoryDataInSidebar = factory;
    },
    drawLines() {
      if (this.showLines == true) {
        var factLocn = this.factoryMapGrowerLocations;
        var factGrowersLocn = this.factoryMapGrowerLocations.growers;
        // var fact = factory;
        // console.log(fact, "kkkk");
        var latlngsff = Array();
        factGrowersLocn.forEach(element => {
          latlngsff.push(factLocn.position);
          latlngsff.push(element.position);
          this.polyline.latlngs = latlngsff;
        });
      }
      if (this.showLines == false && this.toggleFactMapGrower == false) {
        console.log(false);
        this.polyline.latlngs = [];
        // console.log(polyline.latlngs);
      }
    },
    togglegrowersDataSidebar(grower) {
      // this.showLines = false;
      this.toggleDataInSidebar = !this.toggleDataInSidebar;
      this.rightSidebarFactories = !this.rightSidebarFactories;
      this.growerDataInSidebar = grower;
      console.log(grower);
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
.growersDataSidebar {
  margin-bottom: 1px !important;
}
</style>
