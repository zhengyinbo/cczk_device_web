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
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[16, 24]">
            <t-col :flex="1">
              <t-form-item label="设备编号" name="deviceNo">
                <t-input
                  v-model="formData.deviceNo"
                  class="form-item-content"
                  type="search"
                  placeholder="请输入设备编号"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :flex="1">
              <t-form-item label="所属用户" name="userName">
                <t-input
                  v-model="formData.userName"
                  class="form-item-content"
                  type="search"
                  placeholder="请输入设备编号"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :flex="1">
              <t-form-item label="设备类型" name="deviceTypeName">
                <t-input
                  v-model="formData.deviceTypeName"
                  class="form-item-content"
                  type="search"
                  placeholder="请输入设备编号"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :flex="1">
              <t-form-item label="状态" name="status">
                <t-select
                  v-model="formData.status"
                  class="form-item-content`"
                  :options="CONTRACT_STATUS_OPTIONS"
                  placeholder="请选择状态"
                />
              </t-form-item>
            </t-col>
          </t-row>
        </t-col>

        <t-col :span="2" class="operation-container">
          <t-button theme="primary" :style="{ marginLeft: '8px' }" @click="create"> 新增 </t-button>
          <t-button theme="success" type="submit" :style="{ marginLeft: '8px' }"> 查询 </t-button>
          <t-button type="reset" variant="base" theme="default"> 重置 </t-button>
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
        <!-- <template #status="{ row }">
          <t-tag v-if="row.status === CONTRACT_STATUS.NORMAL" theme="success" variant="light">正常</t-tag>
          <t-tag v-if="row.status === CONTRACT_STATUS.DISABLE" theme="danger" variant="light">禁用</t-tag>
        </template> -->

        <template #op="slotProps">
          <a class="t-button-link" @click="rehandleClickOp(slotProps)">管理</a>
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
        draggable
        @confirm="handleConfirm"
        @cancel="handleCancel"
      >
        <template #body>
          <device-form ref="deviceForm" v-model="formData" />
        </template>
      </t-dialog>
    </div>
  </div>
</template>
<script>
import { prefix } from '@/config/global';

import { CONTRACT_STATUS, CONTRACT_STATUS_OPTIONS } from '@/constants';
import { deviceList, createDevice, updateDevice, deleteDevice, cateList, findAllCate } from '@/api/Device';
import DeviceForm from '@/pages/device/deviceForm.vue';

export default {
  name: 'list-table',
  components: { DeviceForm },
  data() {
    return {
      CONTRACT_STATUS,
      CONTRACT_STATUS_OPTIONS,
      prefix,
      formData: {
        deviceNo: '',
        deviceTypeId: '',
        macAdd: "",
        remark: ""
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
        total: 0
      },
      confirmVisible: false,
      deleteIdx: -1,
      visibleModelessDrag: false,
    };
  },
  computed: {
    confirmBody() {
      if (this.deleteIdx > -1) {
        const { name } = this.data?.[this.deleteIdx];
        return `删除后，${name}的所有合同信息将被清空，且无法恢复`;
      }
      return '';
    },
    offsetTop() {
      return this.$store.state.setting.isUseTabsRouter ? 48 : 0;
    },
  },
  mounted() {
    this.deviceList();
  },
  methods: {
    getContainer() {
      return document.querySelector('.tdesign-starter-layout');
    },
    onReset(data) {
      console.log(data);
    },
    onSubmit() {
      this.deviceList(this.formData)
    },
    create() {
      this.formData = {deviceNo: "111", deviceTypeId: "222"};
      this.visibleModelessDrag = true;
    },
    deviceList() {
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
              total: res.count
            };
          }
        }).catch((e) => {
          console.log(e);
        }).finally(() => {
          this.dataLoading = false;
        });
    },
    handleConfirm() {
      this.$refs.deviceForm.validate().then((result) => {
        if (result === true) {
          // 校验通过
          const data = this.$refs.deviceForm.getFormData();
          createDevice(data).then((res) => {
            if (res.data.code && res.data.code !== 0) {
              this.$message.error(res.data.msg);
            } else {
              this.$message.success(res.data);
              this.visibleModelessDrag = false;
              // 刷新list
              this.deviceList();
            }
          });
        } else {
          // 校验失败
          console.log("校验失败:", result);
        }
      });
    },
    handleCancel() {
      this.visibleModelessDrag = false;
      this.$refs.deviceForm.reset();
    },
    cateList() {
      findAllCate.then((res) => {
        this.cateList = res.data
      });
    },
    rehandlePageChange(curr, pageInfo) {
      console.log('分页变化', curr, pageInfo);
    },
    rehandleChange(changeParams, triggerAndData) {
      console.log('统一Change', changeParams, triggerAndData);
      this.pagination = { ...changeParams.pagination };
      this.deviceList();
    },
    rehandleClickOp({ text, row }) {
      console.log(text, row);
    },
    handleClickDelete(row) {
      this.deleteIdx = row.rowIndex;
      this.confirmVisible = true;
    },
    onConfirmDelete() {
      // 真实业务请发起请求
      this.data.splice(this.deleteIdx, 1);
      this.pagination.total = this.data.length;
      this.confirmVisible = false;
      this.$message.success('删除成功');
      this.resetIdx();
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
