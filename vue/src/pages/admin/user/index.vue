<template>
  <div>
    <card title="Filter">
      <div class="row">
        <FormElement size="col-md-4" title="Tìm kiếm">
          <el-input v-model="filter.search" />
        </FormElement>

        <FormElement size="col-md-4" title="Vai trò">
          <el-select v-model="filter.role" multiple>
            <el-option v-for="role in listRole" :label="role" :value="role" :key="role"></el-option>
          </el-select>
        </FormElement>

        <FormElement size="col-md-4" title="Công ty">
          <el-select v-model="filter.company" multiple>
            <el-option v-for="company in listCompany" :label="company" :value="company" :key="company"></el-option>
          </el-select>
        </FormElement>

        <div class="col-md-12" style="margin-top:42px">
          <el-button @click="getListUser" type="info" icon="ti-search"> Lọc User</el-button>
          <el-button @click="$router.push({name: 'createUser'})" type="default" icon="el-icon-plus"> Thêm User</el-button>
        </div>
      </div>
    </card>
    <card v-loading="loading">
      <el-table :data="listUser" style="width: 100%">
        <el-table-column type="index" min-width="50" />
        <el-table-column prop="username" label="Username" min-width="150" />
        <el-table-column prop="role" label="Role" min-width="150" />
        <el-table-column prop="company" label="Company" min-width="150" />
        <el-table-column prop="lang" label="Language" min-width="150" />
        <el-table-column label="Công cụ" min-width="200">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" circle type="info" size="small" @click="$router.push({name: 'updateUser', params: {id: scope.row._id}})" />
            <el-button icon="el-icon-delete" circle type="danger" size="small" @click="confirmDeleteUser(scope.$index)" />
            <el-tooltip class="item" effect="dark" content="Xem CRM như thành viên này" placement="top">
              <el-button icon="ti-arrow-right" circle type="success" size="small" @click="loginAsUser(scope.$index)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Card, FormElement } from '@/components/index'
import { Input, Select, Option, Button, Table, TableColumn, MessageBox, Notification, Tooltip } from 'element-ui'
import request from '@/plugins/request'
import { COMPANY } from '@/interface/Company'
import { ROLE, IUser } from '@/interface/User'
import { values } from 'lodash'

@Component({
  components: {
    Card,
    FormElement,
    [Input.name]: Input,
    [Select.name]: Select,
    [Option.name]: Option,
    [Button.name]: Button,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Tooltip.name]: Tooltip
  }
})
export default class AdminUser extends Vue {
  filter = {
    search: '',
    role: '',
    company: ''
  }
  listUser: IUser[] = []
  listCompany = values(COMPANY)
  listRole = values(ROLE)
  loading = false

  created() {
    this.getListUser()
  }

  getListUser() {
    this.loading = true
    request.post('admin/list-user', this.filter).then(rs => {
      this.listUser = rs.data
      this.loading = false
    })
  }

  confirmDeleteUser(index: number) {
    MessageBox.confirm('Thao tác xóa thành viên sẽ không thể khôi phục, bạn chắc chứ?', {
      confirmButtonText: 'Chắc chắn xóa',
      cancelButtonText: 'Quay lại',
      type: 'warning'
    }).then(() => {
      this.deleteUser(index)
    })
  }

  deleteUser(index: number) {
    request.delete(`admin/user/${this.listUser[index]._id}`).then(rs => {
      this.listUser.splice(index, 1)
      Notification.success('Đã xóa thành viên')
    })
  }

  loginAsUser(index: number) {
    this.$store.commit('APP_READY', false)
    request
      .get(`admin/login-as/${this.listUser[index]._id}`)
      .then(rs => {
        this.$store.commit('LOGIN_SUCCESS', rs.data)
        this.$router.push({ name: 'home' })
      })
      .finally(() => this.$store.commit('APP_READY'))
  }
}
</script>

<style lang="scss" scope="">
label {
  display: block;
}
</style>
