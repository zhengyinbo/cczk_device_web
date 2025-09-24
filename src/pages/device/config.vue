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
          <div class="form-basic-container-title">机器参数信息</div>
          <!-- 表单内容 -->
          <t-row class="row-gap" :gutter="[16, 24]">
            <t-col :span="6">
              <t-form-item label="机器编号" name="deviceNo">
                <t-input v-model="formData.deviceNo" :style="{ width: '322px' }" disabled="disabled" />
              </t-form-item>
            </t-col>
            <t-col :span="6">
              <t-form-item label="一币几分" name="coinGrade">
                <t-input v-model="formData.coinGrade" :style="{ width: '322px' }" type="number" :min="1" />
              </t-form-item>
            </t-col>
            <t-col :span="6">
              <t-form-item label="免费模式" name="freeModel">
                <t-radio-group v-model="formData.freeModel">
                  <t-radio value="1">开启</t-radio>
                  <t-radio value="2">关闭</t-radio>
                </t-radio-group>
              </t-form-item>
            </t-col>
            <t-col :span="6">
              <t-form-item label="游戏音量" name="volume">
                <t-input v-model="formData.volume" :style="{ width: '322px' }" type="number" :min="1" />
              </t-form-item>
            </t-col>
            <t-col :span="6">
              <t-form-item label="演示音乐" name="demoMusic">
                <t-radio-group v-model="formData.demoMusic">
                  <t-radio value="1">开启</t-radio>
                  <t-radio value="2">关闭</t-radio>
                </t-radio-group>
              </t-form-item>
            </t-col>
            <t-col :span="6">
              <t-form-item label="一币几票" name="coinTicket">
                <t-input v-model="formData.coinTicket" :style="{ width: '322px' }" type="number" :min="1" />
              </t-form-item>
            </t-col>
            <t-col :span="6">
              <t-form-item label="退礼模式" name="gift">
                <t-radio-group v-model="formData.gift">
                  <t-radio value="1">彩票模式</t-radio>
                  <t-radio value="2">其他模式</t-radio>
                </t-radio-group>
              </t-form-item>
            </t-col>
            <t-col :span="6">
              <t-form-item label="游戏难度" name="gameLevel">
                <t-input v-model="formData.gameLevel" :style="{ width: '322px' }" type="number" :min="1" />
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
  coinGrade: [{ required: true, message: '请输入一币几分', type: 'error' }],
  freeModel: [{ required: true, message: '请选择免费模式', type: 'error' }],
  volume: [{ required: true, message: '请输入游戏音量', type: 'error' }],
  demoMusic: [{ required: true, message: '请选择演示音乐', type: 'error' }],
  coinTicket: [{ required: true, message: '请输入一币几票', type: 'error' }],
  gift: [{ required: true, message: '请选择退礼模式', type: 'error' }],
  gameLevel: [{ required: true, message: '请输入游戏难度', type: 'error' }],
  deviceNo: [{ required: true, message: '请输入机器编号', type: 'error' }],
};

export default {
  name: 'ConfigForm',
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
    setValue(row) {
      this.formData = row
    }
  },
};
</script>
<style lang="less" scoped>
@import '@/pages/form/base/index';
</style>
