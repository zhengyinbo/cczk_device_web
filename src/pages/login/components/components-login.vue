<template>
  <t-form
    ref="form"
    :class="['item-container', `login-${type}`]"
    :data="formData"
    :rules="FORM_RULES"
    label-width="0"
    @submit="onSubmit"
  >
    <template v-if="type == 'password'">
      <t-form-item name="account">
        <t-input v-model="formData.userName" size="large" placeholder="请输入账号">
          <template #prefix-icon>
            <user-icon />
          </template>
        </t-input>
      </t-form-item>

      <t-form-item name="password">
        <t-input
          v-model="formData.password"
          size="large"
          :type="showPsw ? 'text' : 'password'"
          clearable
          key="password"
          placeholder="请输入登录密码："
        >
          <template #prefix-icon>
            <lock-on-icon />
          </template>
          <template #suffix-icon>
            <browse-icon v-if="showPsw" @click="showPsw = !showPsw" key="browse" />
            <browse-off-icon v-else @click="showPsw = !showPsw" key="browse-off" />
          </template>
        </t-input>
      </t-form-item>

<!--      <div class="check-container remember-pwd">-->
<!--        <t-checkbox>记住账号</t-checkbox>-->
<!--      </div>-->
    </template>

    <t-form-item v-if="type !== 'qrcode'" class="btn-container">
      <t-button block size="large" type="submit"> 登录 </t-button>
    </t-form-item>
  </t-form>
</template>
<script lang="ts">
import Vue from 'vue';
import { UserIcon, LockOnIcon, BrowseOffIcon, BrowseIcon } from 'tdesign-icons-vue';
import { userLogin , getRole } from '@/api/login';

const INITIAL_DATA = {
  userName: 'admin',
  password: 'admin',
  verifyCode: '',
  checked: false,
};

const FORM_RULES = {
  userName: [{ required: true, message: '用户名/手机号必填', type: 'error' }],
  password: [{ required: true, message: '密码必填', type: 'error' }],
};
/** 高级详情 */
export default Vue.extend({
  name: 'Login',
  components: {
    UserIcon,
    LockOnIcon,
    BrowseOffIcon,
    BrowseIcon,
  },
  data() {
    return {
      FORM_RULES,
      type: 'password',
      formData: { ...INITIAL_DATA },
      showPsw: false,
      countDown: 0,
      intervalTimer: null,
    };
  },
  beforeDestroy() {
    clearInterval(this.intervalTimer);
  },
  methods: {
    switchType(val) {
      this.type = val;
      this.$refs.form.reset();
    },
    async onSubmit({ validateResult }) {
      if (validateResult === true) {
        userLogin(this.formData).then((res) => {
          if (res.code === 0) {
            // 存储token
            this.$store.dispatch('user/setToken', res.data);
            // this.$store.dispatch('user/login', this.formData);
            getRole().then((r) => {
              console.log(r.data);
              this.$store.dispatch('user/setRole', r.data);
              this.$message.success('登录成功');
              const role = this.$store.getters['user/role'];
              console.log(role);
              console.log(typeof role);
              this.$router.replace('/user1').catch(() => '');
            })

          } else {
            this.$message.error(res.msg);
          }
        });
      }
    },
    handleCounter() {
      this.countDown = 60;
      this.intervalTimer = setInterval(() => {
        if (this.countDown > 0) {
          this.countDown -= 1;
        } else {
          clearInterval(this.intervalTimer);
          this.countDown = 0;
        }
      }, 1000);
    },
  },
});
</script>
