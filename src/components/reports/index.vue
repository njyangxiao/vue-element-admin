<template>
  <div>
    <nav-crumbs>
      <template #level1>数据统计</template>
      <template #level2>数据报表</template>
    </nav-crumbs>
    <el-card class="box-card">
      <div id="main" style="width:600px;height:400px"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";

export default {
  name: "name",
  data() {
    return {
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  mounted() {
    this.useEchart();
  },
  methods: {
    async useEchart() {
      var myChart = echarts.init(document.getElementById("main"));
      var data = await this.$api.getReports(1).then((res) => {
        const {
          data,
          meta: { msg, status },
        } = res.data;
        if (status == 200) {
          return data;
        } else {
          this.$message.error(msg);
        }
      });
      var result = { ...this.options, ...data };
      myChart.setOption(result);
      
    },
  },
  components: {},
};
</script>

<style lang="scss" scoped></style>
