<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPermission(1,'0')">添加权限</el-button>
        </template>
      </page-tools>
      <el-table border :data="list" row-key="id">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="code" align="center" label="标识" />
        <el-table-column prop="description" align="center" label="描述" />
        <el-table-column align="center" label="操作">
          <template slot-scope="{row}">
            <el-button v-if="row.type===1" type="text" @click="addPermission(2,row.id)">添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 放置一个弹层 用来编辑新增节点 -->
      <el-dialog :title="formData.id?'编辑权限':'新增权限'" :visible="showDialog" @close="btnCancel">
        <el-form ref="perForm" label-width="120px" :model="formData" :rules="rules">
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="formData.name" style="width:90%" />
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input v-model="formData.code" style="width:90%" />
          </el-form-item>
          <el-form-item label="权限描述" prop="description">
            <el-input v-model="formData.description" style="width:90%" />
          </el-form-item>
          <el-form-item label="开启" prop="enVisible">
            <el-switch v-model="formData.enVisible" active-value="1" inactive-value="0" style="width:90%" />
          </el-form-item>
        </el-form>
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" type="primary" @click="btnOK">确定</el-button>
            <el-button size="small" @click="btnCancel">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getPermissionList, addPermission, updatePermission, delPermission, getPermissionDetail } from '@/api/permisson'
import { tranListToTreeData } from '@/utils'
export default {
  data() {
    return {
      list: [],
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
      showDialog: false
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async  getPermissionList() {
      this.list = tranListToTreeData(await getPermissionList(), '0')
      console.log(this.list)
    },
    // 删除
    async delPermission(id) {
      try {
        await this.$confirm('确定要删除该数据吗?')
        await delPermission(id)
        this.getPermissionList()
        this.$message.success('删除成功！')
      } catch (error) {
        console.log(error)
      }
    },
    // 新增
    addPermission(type, pid) {
      this.formData.type = type
      this.formData.pid = pid
      this.showDialog = true
    },
    // 编辑
    async editPermission(id) {
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    },
    // 确定按钮
    btnOK() {
      this.$refs.perForm.validate().then(() => {
        if (this.formData.id) {
          return updatePermission(this.formData)
        }
        return addPermission(this.formData)
      }).then(() => {
        this.$message.success('新增权限成功!')
        this.getPermissionList()
        this.showDialog = false
      })
    },
    // 取消按钮
    btnCancel() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.$refs.perForm.resetFields()
      this.showDialog = false
    }
  }
}
</script>

<style>

</style>
