<template>
  <div>

    <Card title="Bộ Lọc">
      <div class="row">

        <Form-Element title="Ứng viên về" size="col-xl-4 col-md-6">
          <el-date-picker format="dd/MM/yyyy" v-model="filter.dateRange" type="daterange" align="right" unlink-panels range-separator="T" start-placeholder="Ngày bắt đầu" end-placeholder="Ngày kết thúc" :picker-options="dateOptions" />
        </Form-Element>

        <div class="col-xl-2 col-lg-6" style="margin-top:44px">
          <el-button type="success" @click="getDataApplicant"> <i class="el-icon-search"></i> Tìm kiếm</el-button>
        </div>
      </div>
    </Card>

    <div class="row">
      <div class="col-6">
        <Chart-Card title="Tổng quan" chartType="Line" :chartOptions="overviewOptions" :chartData="overviewData" />
      </div>
      <div class="col-6" v-for="(rec, index) in listRec" :key="index">
        <Chart-Card :title="rec" chartType="Line" :chartOptions="overviewOptions" :chartData="getChartDataByRec(rec)" />
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Card, FormElement, ChartCard } from '@/components/index.ts'
import { Button, Notification, Input, Select, DatePicker, Option, Loading } from 'element-ui'
import request from '@/plugins/request'
import { subDays, subMonths } from 'date-fns'
import { IApplicant, IApplicantHistory } from '@/interface/Applicant'
import { getOverviewChartData, getChartDataByRec } from '@/mapper/javietReport'
import { JavietDoc } from '@/interface/Javiet'

@Component({
  components: {
    Card,
    ChartCard,
    FormElement,
    [Button.name]: Button,
    [Input.name]: Input,
    [Select.name]: Select,
    [Option.name]: Option,
    [DatePicker.name]: DatePicker
  }
})
export default class JavietReport extends Vue {
  filter = {}
  listRec = []
  loading = false
  rawData: JavietDoc[] = []
  overviewData = {}

  get dateOptions() {
    const today = new Date()
    return {
      shortcuts: [
        {
          text: this.$t('3 ngày gần đây'),
          onClick(picker: any) {
            picker.$emit('pick', [subDays(today, 3), today])
          }
        },
        {
          text: this.$t('1 tuần gần đây'),
          onClick(picker: any) {
            picker.$emit('pick', [subDays(today, 7), today])
          }
        },
        {
          text: this.$t('1 tháng gần đây'),
          onClick(picker: any) {
            picker.$emit('pick', [subMonths(today, 1), today])
          }
        },
        {
          text: this.$t('3 tháng gần đây'),
          onClick(picker: any) {
            picker.$emit('pick', [subMonths(today, 3), today])
          }
        }
      ]
    }
  }

  overviewOptions = {
    low: 0,
    showArea: true
  }

  created() {
    this.loading = true
    this.getDataApplicant().then(() => {})
  }

  async getListRec() {
    return request.get('javiet/admin/list-recruiter').then(rs => {
      this.listRec = rs.data
    })
  } 

  getChartDataByRec(rec: string) {
    return getChartDataByRec(this.rawData, rec)
  }

  async getDataApplicant() {
    return request.post('javiet/admin/list-applicant', this.filter).then(rs => {
      this.rawData = rs.data
      this.getListRec()
      this.overviewData = getOverviewChartData(this.rawData)
    })
  }
}
</script>

