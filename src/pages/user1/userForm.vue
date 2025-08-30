<template>
  <t-card :bordered="false">
    <t-form
      ref="form"
      :data="formData"
      :rules="FORM_RULES"
      label-align="top"
      :label-width="100"
    >
      <div class="form-basic-container">
        <div class="form-basic-item">
          <div class="form-basic-container-title">用户信息</div>
          <!-- 表单内容 -->
          <t-row class="row-gap" :gutter="[16, 24]">
            <t-col :span="6">
              <t-form-item label="用户名/手机号码" name="userName">
                <t-input v-model="formData.userName" :style="{ width: '322px' }" placeholder="请输入内容" />
              </t-form-item>
            </t-col>
          </t-row>
          <t-form-item label="备注" name="remark">
            <t-textarea v-model="formData.remark" :height="124" placeholder="请输入备注" />
          </t-form-item>
        </div>
      </div>
    </t-form>
  </t-card>
</template>
<script>
import { prefix } from '@/config/global';

const INITIAL_DATA = {
  userName: '',
  remark: '',
};
const FORM_RULES = {
  userName: [{ required: true, message: '请输入用户名/手机号码', type: 'error' }]
};

export default {
  name: 'UserForm',
  data() {
    return {
      prefix,
      stepSuccess: true,
      formData: { ...INITIAL_DATA },
      FORM_RULES
    };
  },
  methods: {
    validate() {
      return this.$refs.form.validate();
    },
    getFormData() {
      return this.formData;
    },
    setValue(value) {
      this.formData = value;
    },
  },
};
</script>
<style lang="less" scoped>
@import '@/pages/form/base/index';
</style>
