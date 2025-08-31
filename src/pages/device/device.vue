<template>
  <div class="list-common-table">
    <t-form
      ref="form"
      :data="formData"
      :label-width="80"
      @reset="onReset"
      @submit="onSubmit"
      :style="{ marginBottom: '8px' }"
    >
      <t-row :gutter="[8, 24]" class="row-gap">
        <t-col :span="4">
          <t-form-item label="设备编号" name="deviceNo">
            <t-input
              v-model="formData.deviceNo"
              class="form-item-content"
              type="search"
              placeholder=""
              :style="{ minWidth: '220px' }"
            />
          </t-form-item>
        </t-col>
        <t-col :span="4">
          <t-form-item label="所属用户" name="userId">
            <t-select
              v-model="formData.userId"
              :style="{ width: '322px' }"
              placeholder="请选择用户"
              class="demo-select-base"
            >
              <t-option v-for="(item, index) in userOptions" :key="index" :value="item.userId" :label="item.userName">
                {{ item.userName }}
              </t-option>
            </t-select>
          </t-form-item>
        </t-col>
        <t-col :span="4">
          <t-form-item label="设备类型" name="deviceTypeId">
            <t-select
              v-model="formData.deviceTypeId"
              :style="{ width: '322px' }"
              placeholder="请选择类型"
              class="demo-select-base"
            >
              <t-option
                v-for="(item, index) in typeOptions"
                :key="index"
                :value="item.deviceTypeId"
                :label="item.deviceTypeName"
              >
                {{ item.deviceTypeName }}
              </t-option>
            </t-select>
          </t-form-item>
        </t-col>
        <t-col :span="4">
          <t-form-item label="状态" name="status">
            <t-select
              v-model="formData.status"
              class="form-item-content`"
              :options="CONTRACT_STATUS_OPTIONS"
              placeholder="请选择状态"
            />
          </t-form-item>
        </t-col>
        <t-col :span="4" class="operation-container">
          <t-button theme="success" type="submit" :style="{ marginLeft: '8px' }"> 查询 </t-button>
          <t-button type="reset" variant="base" theme="default"> 重置 </t-button>
          <t-button theme="primary" :style="{ marginLeft: '8px' }" @click="create"> 新增 </t-button>
        </t-col>
      </t-row>
    </t-form>
    <div class="table-container">
      <t-table
        :data="data"
        :columns="columns"
        :rowKey="rowKey"
        :verticalAlign="verticalAlign"
        :hover="hover"
        :pagination="pagination"
        @page-change="rehandlePageChange"
        @change="rehandleChange"
        :loading="dataLoading"
        :headerAffixedTop="true"
        :headerAffixProps="{ offsetTop, container: getContainer }"
      >
        <template #op="slotProps">
          <a class="t-button-link" @click="rehandleClickOp(slotProps)">管理</a>
          <a class="t-button-link" @click="bandDevice(slotProps)">绑定用户</a>
          <a class="t-button-link" @click="unBandDevice(slotProps)">解绑用户</a>
          <a class="t-button-link" @click="handleClickDelete(slotProps)">删除</a>
        </template>
      </t-table>
      <t-dialog
        header="确认删除当前所选设备？"
        :body="confirmBody"
        :visible.sync="confirmVisible"
        @confirm="onConfirmDelete"
        :onCancel="onCancel"
      >
      </t-dialog>
      <t-dialog
        :visible="visibleModelessDrag"
        header="新增设备"
        mode="modeless"
        closeBtn=""
        @confirm="handleConfirm"
        @cancel="handleCancel"
      >
        <template #body>
          <device-form ref="deviceForm" v-model="formData" />
        </template>
      </t-dialog>
      <t-dialog
        :visible="updateDialog"
        header="修改设备"
        mode="modeless"
        closeBtn=""
        @confirm="updateHandleConfirm"
        @cancel="updateHandleCancel"
      >
        <template #body>
          <device-form ref="deviceForm" />
        </template>
      </t-dialog>
      <t-dialog
        header="确认解绑当前设备？"
        :body="confirmBody"
        :visible.sync="unBandDeviceVisible"
        @confirm="unBandDeviceConfirm"
        :onCancel="unBandDeviceCancel"
      >
      </t-dialog>
      <t-dialog
        :visible="bandDeviceVisible"
        header="绑定用户"
        mode="modeless"
        closeBtn=""
        @confirm="bandDeviceConfirm"
        @cancel="bandDeviceCancel"
      >
        <template #body>
          <band-device-form ref="bandDeviceForm" />
        </template>
      </t-dialog>
    </div>
  </div>
</template>
<script>
import { prefix } from '@/config/global';

import { CONTRACT_STATUS, CONTRACT_STATUS_OPTIONS } from '@/constants';
import {
  deviceList,
  createDevice,
  updateDevice,
  deleteDevice,
  findAllCate,
  bandDevice,
  unBandDevice,
} from '@/api/Device';
import { findAll } from '@/api/Users';
import DeviceForm from '@/pages/device/deviceForm.vue';
import BandDeviceForm from '@/pages/device/bandDevice.vue';

export default {
  name: 'list-table',
  components: { BandDeviceForm, DeviceForm },
  data() {
    return {
      CONTRACT_STATUS,
      CONTRACT_STATUS_OPTIONS,
      prefix,
      formData: {
        deviceNo: '',
        deviceTypeId: '',
        macAdd: '',
        remark: '',
      },
      data: [],
      dataLoading: false,
      value: 'first',
      columns: [
        {
          title: '设备编号',
          fixed: 'left',
          width: 200,
          align: 'left',
          ellipsis: true,
          colKey: 'deviceNo',
        },
        {
          title: '所属用户',
          width: 200,
          ellipsis: true,
          colKey: 'userName',
        },
        { title: '状态', colKey: 'status', width: 200, cell: { col: 'status' } },
        {
          title: '设备类型',
          width: 200,
          ellipsis: true,
          colKey: 'deviceTypeName',
        },
        {
          title: 'mac地址',
          width: 200,
          ellipsis: true,
          colKey: 'macAdd',
        },
        {
          title: '备注',
          width: 200,
          ellipsis: true,
          colKey: 'remark',
        },
        {
          title: '创建时间',
          width: 200,
          ellipsis: true,
          colKey: 'createTime',
        },
        {
          align: 'left',
          fixed: 'right',
          width: 200,
          colKey: 'op',
          title: '操作',
        },
      ],
      rowKey: 'index',
      tableLayout: 'auto',
      verticalAlign: 'top',
      bordered: true,
      hover: true,
      rowClassName: (rowKey) => `${rowKey}-class`,
      // 与pagination对齐
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      confirmVisible: false,
      deleteIdx: -1,
      visibleModelessDrag: false,
      updateDialog: false,
      bandDeviceVisible: false,
      unBandDeviceVisible: false,
      userOptions: [],
      typeOptions: [],
      msg: '',
    };
  },
  computed: {
    confirmBody() {
      return this.msg;
    },
    offsetTop() {
      return this.$store.state.setting.isUseTabsRouter ? 48 : 0;
    },
  },
  mounted() {
    this.queryList();
    findAllCate().then((res) => {
      this.typeOptions = res.data;
    });
    findAll().then((res) => {
      this.userOptions = res.data;
    });
  },
  methods: {
    getContainer() {
      return document.querySelector('.tdesign-starter-layout');
    },
    onReset(data) {
      console.log(data);
    },
    onSubmit() {
      this.queryList(this.formData);
    },
    create() {
      findAllCate().then((res) => {
        this.$refs.deviceForm.setValue(res.data, {});
        this.visibleModelessDrag = true;
      });
    },
    queryList() {
      this.dataLoading = true;
      const params = {
        page: this.pagination.current,
        limit: this.pagination.pageSize,
        ...this.formData, // 合并搜索条件
      };
      deviceList(params)
        .then((res) => {
          if (res.code === 0) {
            this.data = res.data;
            this.pagination = {
              ...this.pagination,
              total: res.count,
            };
          }
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          this.dataLoading = false;
        });
    },
    handleConfirm() {
      this.$refs.deviceForm.validate().then((result) => {
        if (result === true) {
          // 校验通过
          const data = this.$refs.deviceForm.getFormData();
          createDevice(data).then((res) => {
            if (res.code && res.code !== 0) {
              this.$message.error(res.msg);
            } else {
              this.$message.success(res.data);
              this.visibleModelessDrag = false;
              // 刷新list
              this.queryList();
            }
          });
        } else {
          // 校验失败
          console.log('校验失败:', result);
        }
      });
    },
    handleCancel() {
      this.visibleModelessDrag = false;
      this.$refs.deviceForm.reset();
    },
    updateHandleConfirm() {
      const data = this.$refs.deviceForm.getFormData();
      updateDevice(data).then((res) => {
        if (res.code === 0) {
          this.$message.success('修改成功');
          this.queryList();
          this.updateDialog = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    updateHandleCancel() {
      this.queryList();
      this.updateDialog = false;
    },
    rehandlePageChange(curr, pageInfo) {
      console.log('分页变化', curr, pageInfo);
    },
    rehandleChange(changeParams, triggerAndData) {
      console.log('统一Change', changeParams, triggerAndData);
      this.pagination = { ...changeParams.pagination };
      this.queryList();
    },
    rehandleClickOp(row) {
      findAllCate().then((res) => {
        this.$refs.deviceForm.setValue(res.data, row.row);
      });
      this.updateDialog = true;
    },
    handleClickDelete(row) {
      this.msg = '删除后，无法恢复';
      this.deleteIdx = row.row.deviceId;
      this.confirmVisible = true;
    },
    onConfirmDelete() {
      // 真实业务请发起请求
      const data = { deviceId: this.deleteIdx };
      deleteDevice(data).then((res) => {
        if (res.code === 0) {
          this.$message.success(res.data);
          this.queryList();
          this.confirmVisible = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    unBandDevice(row) {
      this.msg = '是否解绑？';
      this.deleteIdx = row.row.deviceId;
      this.unBandDeviceVisible = true;
    },
    unBandDeviceConfirm() {
      // 真实业务请发起请求
      const data = { deviceId: this.deleteIdx };
      unBandDevice(data).then((res) => {
        console.log(res);
        if (res.code === 0) {
          this.$message.success(res.data);
          this.queryList();
          this.unBandDeviceVisible = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    unBandDeviceCancel() {
      this.unBandDeviceVisible = false;
    },
    bandDevice(row) {
      const data = {
        user: this.userOptions,
        userId: row.row.userId,
        deviceId: row.row.deviceId,
      }
      this.$refs.bandDeviceForm.setValue(data);
      this.bandDeviceVisible = true;
    },
    bandDeviceConfirm() {
      // 真实业务请发起请求
      const data = this.$refs.bandDeviceForm.getFormData();
      bandDevice(data).then((res) => {
        console.log(res);
        if (res.code === 0) {
          this.$message.success(res.data);
          this.queryList();
          this.bandDeviceVisible = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    bandDeviceCancel() {
      this.bandDeviceVisible = false;
    },
    onCancel() {
      this.resetIdx();
    },
    resetIdx() {
      this.deleteIdx = -1;
    },
  },
};
</script>

<style lang="less" scoped>
@import '@/style/variables.less';

.list-common-table {
  background-color: var(--td-bg-color-container);
  padding: 30px 32px;
  border-radius: var(--td-radius-default);
}

.form-item-content {
  width: 100%;
}

.operation-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.payment-col {
  display: flex;

  .trend-container {
    display: flex;
    align-items: center;
    margin-left: 8px;
  }
}
.t-button + .t-button {
  margin-left: var(--td-comp-margin-s);
}
</style>
