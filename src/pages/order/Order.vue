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
      <t-row class="row-gap" :gutter="[8, 24]">
        <t-col :span="4">
          <t-form-item label="订单编号" name="orderNo">
            <t-input v-model="formData.orderNo" :style="{ width: '220px' }" placeholder="" />
          </t-form-item>
        </t-col>
        <t-col :span="4">
          <t-form-item label="所属人" name="userName">
            <t-input v-model="formData.userName" :style="{ width: '220px' }" placeholder="" />
          </t-form-item>
        </t-col>
        <t-col :span="4">
          <t-form-item label="设备类型" name="deviceTypeName">
            <t-select
              v-model="formData.deviceTypeName"
              :style="{ width: '220px' }"
              placeholder=""
              class="demo-select-base"
              clearable
            >
              <t-option
                v-for="(item, index) in cateList"
                :key="index"
                :value="item.deviceTypeName"
                :label="item.deviceTypeName"
              >
                {{ item.deviceTypeName }}
              </t-option>
            </t-select>
          </t-form-item>
        </t-col>
        <t-col :span="4">
          <t-form-item label="设备编号" name="deviceNo">
            <t-input v-model="formData.deviceNo" :style="{ width: '220px' }" placeholder="" />
          </t-form-item>
        </t-col>
        <t-col :span="4">
          <t-form-item label="开始时间" name="startDate">
            <t-date-picker
              v-model="formData.startDate"
              :style="{ width: '220px' }"
              theme="primary"
              mode="date"
              separator="/"
            />
          </t-form-item>
        </t-col>
        <t-col :span="4">
          <t-form-item label="结束时间" name="endDate">
            <t-date-picker
              v-model="formData.endDate"
              :style="{ width: '220px' }"
              theme="primary"
              mode="date"
              separator="/"
            />
          </t-form-item>
        </t-col>
        <t-col :span="0" class="operation-container">
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
      </t-table>
    </div>
  </div>
</template>
<script>
import { prefix } from '@/config/global';
import { CONTRACT_STATUS, CONTRACT_STATUS_OPTIONS } from '@/constants';
import { queryList } from '@/api/Order';
import { findAllCate } from '@/api/Device';

export default {
  name: 'list-table',
  data() {
    return {
      CONTRACT_STATUS,
      CONTRACT_STATUS_OPTIONS,
      prefix,
      formData: {
        orderNo: '',
        userName: '',
        deviceTypeName: '',
        deviceNo: '',
        startDate: '',
        endDate: '',
      },
      data: [],
      dataLoading: false,
      value: 'first',
      columns: [
        {
          title: '订单编号',
          width: 200,
          ellipsis: true,
          colKey: 'orderNo',
        },
        {
          title: '所属人',
          width: 200,
          ellipsis: true,
          colKey: 'userName',
        },
        {
          title: '设备类型',
          width: 200,
          ellipsis: true,
          colKey: 'deviceTypeName',
        },
        {
          title: '设备编号',
          width: 200,
          ellipsis: true,
          colKey: 'deviceNo',
        },
        {
          title: '订单金额',
          width: 200,
          ellipsis: true,
          colKey: 'amount',
        },
        {
          title: '创建时间',
          width: 200,
          ellipsis: true,
          colKey: 'createTime',
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
      cateList: [{ deviceTypeName: '123' }, { deviceTypeName: '456' }],
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
    this.queryList();
    this.findCate();
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
      this.visibleModelessDrag = true;
      this.$refs.cateForm.setValue({});
    },
    queryList() {
      this.dataLoading = true;
      const params = {
        page: this.pagination.current,
        limit: this.pagination.pageSize,
        ...this.formData, // 合并搜索条件
      };
      queryList(params)
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
    findCate() {
      findAllCate().then((res) => {
        this.cateList = res.data;
      });
    },
    rehandlePageChange(curr, pageInfo) {
      console.log('分页变化', curr, pageInfo);
    },
    rehandleChange(changeParams, triggerAndData) {
      console.log('统一Change', changeParams, triggerAndData);
      this.pagination = { ...changeParams.pagination };
      this.queryList();
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
