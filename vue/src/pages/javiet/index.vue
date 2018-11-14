<template>
  <div>

    <Card title="Bộ Lọc">
      <div class="row">
        <Form-Element title="Tìm kiếm" size="col-xl-2 col-md-6">
          <el-input v-model="filter.search" placeholder="Tìm theo tên, SĐT, UID"></el-input>
        </Form-Element>

        <Form-Element title="Ngày import" size="col-xl-4 col-md-6">
          <el-date-picker format="dd/MM/yyyy" v-model="filter.dateRange" type="daterange" align="right" unlink-panels range-separator="T" start-placeholder="Ngày bắt đầu" end-placeholder="Ngày kết thúc" :picker-options="dateOptions" />
        </Form-Element>

        <Form-Element title="Bước" size="col-xl-2 col-md-6">
          <el-select v-model="filter.engageStatus" multiple>
            <el-option v-for="(value, key) in listEngageStatus" :value="key" :label="value" :key="key" />
          </el-select>
        </Form-Element>

        <div class="col-xl-2 col-lg-6" style="margin-top:44px">
          <el-button @click="getListHistory" type="success"> <i class="el-icon-search"></i> Tìm kiếm</el-button>
        </div>
      </div>
    </Card>

    <Card v-loading="loading">
      <el-table border :data="listHistory" class="w100 ttc">
        <el-table-column label="STT" width="50">
          <template slot-scope="scope">
            <b>{{ scope.$index + 1 + (pagination.page - 1) * pagination.limit}}</b>
          </template>
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="scopeApplicant">
            <el-table border :data="scopeApplicant.row.listEngage" style="width: 100%">
              <el-table-column width="120">
                <template slot-scope="scope">
                  <b>Tư vấn lần {{scope.$index + 1}}</b>
                </template>
              </el-table-column>
              <el-table-column label="Thời gian" width="150">
                <template slot-scope="scope">
                  <span>{{ scope.row.createdAt | date('HH:mm dd/MM') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Cập nhật" width="150">
                <template slot-scope="scope">
                  <span>{{ scope.row.updatedAt | date('HH:mm dd/MM') }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="method" label="Hình thức" width="100" />
              <el-table-column prop="content" label="Kết quả" />
              <el-table-column prop="note" label="Ghi chú cho iHR" />
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="Tư vấn" width="60">
          <template slot-scope="scope">
            <el-button @click="goToDetailPage(scope.row._id)" icon="el-icon-edit" circle type="warning" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="Trạng thái" width="200">
          <template slot-scope="scope">
            <el-select v-model="scope.row.engageStatus" @change="update(scope.$index)">
              <el-option v-for="(value, key) in listEngageStatus" :value="key" :label="value" :key="key" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="Ngày import" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.createdAt | date('dd/MM hh:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applicant.name" label="Họ và tên" width="140" />
        <el-table-column label="Năm" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.applicant.birthday">{{ scope.row.applicant.birthday | date('dd/MM/yyyy') }}</span>
            <span v-else>{{ scope.row.applicant.yearOfBirth }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applicant.phone" label="SĐT" width="110" />
        <el-table-column label="Facebook" width="120">
          <template slot-scope="scope">
            <a v-if="parseInt(scope.row.applicant.uid)" :href="`https://fb.com/${scope.row.applicant.uid}`" target="_blank">Trang cá nhân</a>
          </template>
        </el-table-column>
        <el-table-column prop="applicant.note" label="Ghi chú" min-width="400">
          <template slot-scope="scope" class="text-center">
            <span>{{getTransformedNote(scope.row.applicant)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applicant.province" label="Tỉnh" width="120" />
        <el-table-column prop="applicant.page" label="Nguồn" width="100" />
      </el-table>
      <br />
      <el-pagination @size-change="changeLimit" @current-change="changePage" :current-page.sync="pagination.page" :page-sizes="[10, 20, 50, 100, 200]" :page-size="pagination.limit" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"></el-pagination>
    </Card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Card, FormElement } from '@/components/index.ts'
import { Table, TableColumn, Pagination, Button, Notification, Input, Select, DatePicker, Option, Loading } from 'element-ui'
import request from '@/plugins/request'
import { subDays, subMonths } from 'date-fns'
import { IApplicant, IApplicantHistory } from '@/interface/Applicant'
import {JAVIET_STEP} from '@/interface/Javiet'

@Component({
  components: {
    Card,
    FormElement,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Pagination.name]: Pagination,
    [Button.name]: Button,
    [Input.name]: Input,
    [Select.name]: Select,
    [Option.name]: Option,
    [DatePicker.name]: DatePicker
  }
})
export default class Javiet extends Vue {
  listHistory: any[] = []

  filter = {}

  loading = false

  listEngageStatus = JAVIET_STEP

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

  pagination = {
    limit: 10,
    page: 1,
    total: 1
  }

  changePage(page: number) {
    this.pagination.page = page
    this.getListHistory()
  }

  changeLimit(limit: number) {
    this.pagination.limit = limit
    this.pagination.page = 1
    this.getListHistory()
  }

  created() {
    this.getListHistory()
  }

  getListHistory() {
    this.loading = true
    request
      .post('javiet/list-applicant', { pagination: this.pagination, filter: this.filter })
      .then(rs => {
        this.listHistory = rs.data.docs
        this.pagination.limit = rs.data.limit
        this.pagination.page = rs.data.page
        this.pagination.total = rs.data.total
      })
      .finally(() => (this.loading = false))
  }

  update(index: number) {
    const history = this.listHistory[index]
    const loading = Loading.service({})
    request
      .put(`javiet/update-history-status`, { engageStatus: parseInt(history.engageStatus), historyId: history._id })
      .then(() => Notification.success('Cập nhật thành công'))
      .finally(() => loading.close())
  }

  updateApplicant(index: number) {
    const { applicant } = this.listHistory[index]
    const loading = Loading.service({})
    request
      .put(`javiet/update-applicant-status`, { status: applicant.status, applicantId: applicant._id })
      .then(() => Notification.success('Cập nhật thành công'))
      .finally(() => loading.close())
  }

  getTransformedNote(applicant: IApplicant) {
    return applicant.note ? applicant.note.replace(/(?:\r\n|\r|\n)/g, '. ') : ''
  }

  goToDetailPage(historyId: string) {
    this.$router.push({
      name: 'javietDetail',
      params: { historyId }
    })
  }
}
</script>

