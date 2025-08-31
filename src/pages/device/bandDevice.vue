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
          <div class="form-basic-container-title">绑定用户</div>
          <!-- 表单内容 -->
          <t-input v-model="formData.deviceId" v-show="false" />
          <t-row class="row-gap">
            <t-col :span="6">
              <t-form-item label="用户" name="userId">
                <t-select
                  v-model="formData.userId"
                  :style="{ width: '322px' }"
                  placeholder="请选择用户"
                  class="demo-select-base"
                >
                  <t-option v-for="(item, index) in userOptions" :key="index" :value="item.userId"
                            :label="item.userName">
                    {{ item.userName }}
                  </t-option>
                </t-select>
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

const FORM_RULES = {
  userName: [{ required: true, message: '请选择用户', type: 'error' }]
};

export default {
  name: 'BandDeviceForm',
  data() {
    return {
      prefix,
      stepSuccess: true,
      formData: {
        userId: '',
        userName: '',
        deviceId: '',
      },
      FORM_RULES,
      userOptions: [],
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
      this.userOptions = value.user;
      this.formData.userId = value.userId;
      this.formData.deviceId = value.deviceId;
    },
  },
};
</script>
<style lang="less" scoped>
@import '@/pages/form/base/index';
</style>
