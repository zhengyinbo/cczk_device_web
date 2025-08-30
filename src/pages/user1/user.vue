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
          <t-form-item label="用户名" name="userName">
            <t-input
              v-model="formData.userName"
              class="form-item-content"
              type="search"
              placeholder="请输入用户名/手机号码"
              :style="{ minWidth: '134px' }"
            />
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

        <t-col :span="2" class="operation-container">
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
        <template #status="{ row }">
          <t-tag v-if="row.status === CONTRACT_STATUS.NORMAL" theme="success" variant="light">正常</t-tag>
          <t-tag v-if="row.status === CONTRACT_STATUS.DISABLE" theme="danger" variant="light">禁用</t-tag>
        </template>

        <template #op="slotProps">
          <a class="t-button-link" @click="rehandleClickOp(slotProps)">管理</a>
          <a v-if="slotProps.row.status === CONTRACT_STATUS.NORMAL" class="t-button-link" @click="handleClickDelete(slotProps, '禁用后，用户将无法登陆')">禁用</a>
          <a v-if="slotProps.row.status === CONTRACT_STATUS.DISABLE" class="t-button-link" @click="handleClickDelete(slotProps, '启用后，用户可正常登陆')">启用</a>
        </template>
      </t-table>
      <t-dialog
        header="确认修改当前所选用户状态？"
        :body="confirmBody"
        :visible.sync="confirmVisible"
        @confirm="onConfirmDelete"
        :onCancel="onCancel"
      >
      </t-dialog>
      <t-dialog
        :visible="visibleModelessDrag"
        header="新增用户"
        mode="modeless"
        draggable
        @confirm="handleConfirm"
        @cancel="handleCancel"
      >
        <template #body>
          <user-form ref="userForm" />
        </template>
      </t-dialog>
      <t-dialog
        :visible="updateDialog"
        header="修改用户信息"
        mode="modeless"
        draggable
        closeBtn
        @confirm="updateHandleConfirm"
        @cancel="updateHandleCancel"
      >
        <template #body>
          <user-form ref="userForm" />
        </template>
      </t-dialog>
    </div>
  </div>
</template>
<script>
import { prefix } from '@/config/global';

import { CONTRACT_STATUS, CONTRACT_STATUS_OPTIONS } from '@/constants';
import { queryList, createUser, updateUser , bandUser} from '@/api/Users';
import UserForm from '@/pages/user1/userForm.vue';

export default {
  name: 'list-table',
  components: { UserForm },
  data() {
    return {
      CONTRACT_STATUS,
      CONTRACT_STATUS_OPTIONS,
      prefix,
      formData: {
        userName: '',
        status: '',
      },
      data: [],
      dataLoading: false,
      value: 'first',
      columns: [
        {
          title: '用户名/手机号码',
          fixed: 'left',
          width: 200,
          align: 'left',
          ellipsis: true,
          colKey: 'userName',
        },
        { title: '状态', colKey: 'status', width: 200, cell: { col: 'status' } },
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
      msg: -1,
      visibleModelessDrag: false,
      updateDialog: false,
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
    handleConfirm() {
      this.$refs.userForm.validate().then((result) => {
        if (result === true) {
          // 校验通过
          const data = this.$refs.userForm.getFormData();
          createUser(data).then((res) => {
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
    },
    updateHandleConfirm() {
      const data = this.$refs.userForm.getFormData();
      updateUser(data).then((res) => {
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
    rehandleClickOp(row) {
      this.updateDialog = true;
      this.$refs.userForm.setValue(row);
    },
    handleClickDelete(row, msg) {
      this.deleteIdx = row.row.userId;
      this.msg = msg;
      this.confirmVisible = true;
    },
    onConfirmDelete() {
      // 真实业务请发起请求
      const data = {userId: this.deleteIdx};
      bandUser(data).then((res) => {
        this.$message.success(res.data);
        this.queryList();
        this.confirmVisible = false;
      })
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
