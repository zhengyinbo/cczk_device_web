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
          <div class="form-basic-container-title">设备类型信息</div>
          <!-- 表单内容 -->
          <t-row class="row-gap">
            <t-col :span="6">
              <t-form-item label="设备类型" name="deviceTypeName">
                <t-input v-model="formData.deviceTypeName" :style="{ width: '322px' }" placeholder="请输入内容" />
              </t-form-item>
            </t-col>
          </t-row>
        </div>
      </div>
    </t-form>
  </t-card>
</template>
<script>
import { prefix } from '@/config/global';

const INITIAL_DATA = {
  deviceNo: '',
  remark: '',
};
const FORM_RULES = {
  deviceTypeName: [{ required: true, message: '请填写设备类型', type: 'error' }]
};

export default {
  name: 'CateForm',
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
  },
};
</script>
<style lang="less" scoped>
@import '@/pages/form/base/index';
</style>
