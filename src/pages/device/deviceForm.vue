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
          <div class="form-basic-container-title">设备信息</div>
          <!-- 表单内容 -->
          <t-row class="row-gap" :gutter="[16, 24]">
            <t-col :span="6">
              <t-form-item label="设备编号" name="deviceNo">
                <t-input v-model="formData.deviceNo" :style="{ width: '322px' }" placeholder="请输入内容" />
              </t-form-item>
            </t-col>
          </t-row>

          <t-row class="row-gap">
          <t-col :span="6">
              <t-form-item label="设备类型" name="deviceTypeId">
                <t-select
                  v-model="formData.deviceTypeId"
                  :style="{ width: '322px' }"
                  placeholder="请选择类型"
                  class="demo-select-base"
                  clearable
                >
                  <t-option v-for="(item, index) in typeOptions" :key="index" :value="item.deviceTypeId"
                            :label="item.deviceTypeName">
                    {{ item.deviceTypeName }}
                  </t-option>
                </t-select>
              </t-form-item>
            </t-col>
          </t-row>

            <t-row class="row-gap">
            <t-col :span="6">
              <t-form-item label="mac地址" name="macAdd">
                <t-input v-model="formData.macAdd" :style="{ width: '322px' }" placeholder="请输入内容" />
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

const FORM_RULES = {
  deviceTypeId: [{ required: true, message: '请选择设备类型', type: 'error' }],
  deviceNo: [{ required: true, message: '请输入设备编号', type: 'error' }]
};

export default {
  name: 'DeviceForm',
  data() {
    return {
      prefix,
      stepSuccess: true,
      formData: {
        deviceTypeId: '',
        deviceNo: '',
        macAdd: '',
        remark: '',
      },
      FORM_RULES,
      typeOptions: [{}],
    };
  },
  computed: {

  },
  methods: {
    validate() {
      return this.$refs.form.validate();
    },
    getFormData() {
      return this.formData;
    },
    reset() {
      this.formData = {};
    },
    setValue(res, row) {
      this.formData = row
      this.typeOptions = res
    }
  },
};
</script>
<style lang="less" scoped>
@import '@/pages/form/base/index';
</style>
