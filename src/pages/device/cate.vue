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
              <t-form-item label="设备类型" name="deviceTypeName">
                <t-input
                  v-model="formData.deviceTypeName"
                  class="form-item-content"
                  type="search"
                  placeholder="请输入设备类型"
                  :style="{ minWidth: '134px' }"
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
        <template #op="slotProps">
          <a class="t-button-link" @click="rehandleClickOp(slotProps)">管理</a>
          <a class="t-button-link" @click="handleClickDelete(slotProps)">删除</a>
        </template>
      </t-table>
      <t-dialog
        header="确认删除当前所选设备类型？"
        :body="confirmBody"
        :visible.sync="confirmVisible"
        @confirm="onConfirmDelete"
        :onCancel="onCancel"
      >
      </t-dialog>
      <t-dialog
        :visible="visibleModelessDrag"
        header="新增设备类型"
        mode="modeless"
        draggable
        @confirm="handleConfirm"
        @cancel="handleCancel"
      >
        <template #body>
          <cate-form ref="cateForm" />
        </template>
      </t-dialog>

      <t-dialog
        :visible="updateDialog"
        header="修改设备类型"
        mode="modeless"
        draggable
        @confirm="updateHandleConfirm"
        @cancel="updateHandleCancel"
      >
        <template #body>
          <cate-form ref="cateForm" />
        </template>
      </t-dialog>
    </div>
  </div>
</template>
<script>
import { prefix } from '@/config/global';

import { CONTRACT_STATUS, CONTRACT_STATUS_OPTIONS } from '@/constants';
import { cateList, createCate, findAllCate, updateCate } from '@/api/Device';
import CateForm from '@/pages/device/cateForm.vue';

export default {
  name: 'list-table',
  components: { CateForm },
  data() {
    return {
      CONTRACT_STATUS,
      CONTRACT_STATUS_OPTIONS,
      prefix,
      formData: {
        deviceTypeName: ''
      },
      data: [],
      dataLoading: false,
      value: 'first',
      columns: [
        {
          title: '设备类型',
          width: 200,
          ellipsis: true,
          colKey: 'deviceTypeName',
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
      updateDialog: false,
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
  },
  methods: {
    getContainer() {
      return document.querySelector('.tdesign-starter-layout');
    },
    onReset(data) {
      console.log(data);
    },
    onSubmit() {
      this.queryList(this.formData)
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
      cateList(params)
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
      this.$refs.cateForm.validate().then((result) => {
        if (result === true) {
          // 校验通过
          const data = this.$refs.cateForm.getFormData();
          createCate(data).then((res) => {
            if (res.data.code && res.data.code !== 0) {
              this.$message.error(res.data.msg);
            } else {
              this.$message.success(res.data);
              this.visibleModelessDrag = false;
              // 刷新list
              this.queryList();
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
    },
    updateHandleConfirm() {
      const data = this.$refs.cateForm.getFormData();
      updateCate(data).then((res) => {
        if (res.code === 0) {
          this.$message.success("修改成功")
          this.updateDialog = false;
        } else {
          this.$message.error(res.msg)
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
    rehandleClickOp({ text, row }) {
      console.log(text, row);
      this.updateDialog = true;
      this.$refs.cateForm.setValue(row);
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
