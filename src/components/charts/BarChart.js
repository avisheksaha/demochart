import { Bar, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;

export default {
  extends: Bar,
  mixins: [reactiveProp],
  props: [
    "chartData",
    {
      responsive: true,
      maintainAspectRatio: false
    }
  ],
  mounted() {
    this.renderChart(this.chartData, this.options);
  }
};
