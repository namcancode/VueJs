<template>
  <div>
    <div class="row">
      <div class="col-6 offset-3">
        <card title="Chi tiết thành viên" v-loading="loading">
          <h4 class="card-title" slot="header">
            <el-button icon="ti-arrow-left" circle type="info" @click="$router.push({name: 'listUser'})" /> Thông tin thành viên
          </h4>
          <div class="row">
            <form-element title="Username" size="col-12">
              <el-input v-model="data.username" />
            </form-element>

            <form-element title="Mật khẩu" size="col-12">
              <el-input v-model="data.password" type="password" />
            </form-element>

            <form-element title="Vai trò" size="col-12">
              <el-select v-model="data.role">
                <el-option v-for="role in listRole" :key="role" :label="role" :value="role" />
              </el-select>
            </form-element>

            <form-element title="Ngôn ngữ" size="col-12">
              <el-select v-model="data.lang">
                <el-option label="vi" value="vi" />
                <el-option label="en" value="en" />
              </el-select>
            </form-element>

            <form-element size="col-12">
              <el-button type="success" v-if="userId" @click="updateUser"> Cập nhật user</el-button>
              <el-button type="success" v-else @click="createUser"> Tạo user</el-button>
            </form-element>
          </div>
        </card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Card } from '@/components/index'
import { Input, Select, Option, Button, Table, TableColumn, Notification } from 'element-ui'
import request from '@/plugins/request'
import FormElement from '@/components/Inputs/FormElement.vue'
import { values } from 'lodash'
import { ROLE } from '@/interface/User'
import { COMPANY } from '@/interface/Company'

const initData = {
  username: '',
  password: '',
  role: '',
  company: '',
  lang: 'vi'
}
@Component({
  components: {
    Card,
    FormElement,
    [Input.name]: Input,
    [Select.name]: Select,
    [Option.name]: Option,
    [Button.name]: Button,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  }
})
export default class AdminUser extends Vue {
  data = initData
  loading = false
  listRole = values(ROLE)
  userId = ''

  created() {
    this.userId = this.$route.params.id
    if (this.userId) {
      this.getUser()
    }
  }

  createUser() {
    request.post(`admin/user`, this.data).then(rs => {
      this.data = initData
      this.$forceUpdate()
      Notification.success('Tạo thành viên thành công.')
    })
  }

  updateUser() {
    this.loading = true
    request.put(`admin/user/${this.userId}`, this.data).then(rs => {
      Notification.success('Thay đổi thông tin thành công.')
      this.loading = false
    })
  }

  getUser() {
    this.loading = true
    request.get(`admin/user/${this.userId}`).then(rs => {
      this.data = rs.data
      this.loading = false
    })
  }
}
</script>

<style lang="scss" scoped>
label {
  display: block;
}
</style>
