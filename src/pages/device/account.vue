<template>
  <div class="container">
    <h3>--- 运营账目 ---</h3>

    <!-- account 部分 -->
    <div class="account-table">
      <div class="row header">
        <div class="cell green">玩家</div>
        <div class="cell cyan">投币数</div>
        <div class="cell pink">出票数</div>
        <div class="cell orange">出票率</div>
      </div>
      <div v-if="dataObj && dataObj.data && dataObj.data.account">
        <div
          v-for="acc in dataObj.data.account"
          :key="acc.name"
          class="row"
        >
          <div class="cell">{{ acc.name }}</div>
          <div class="cell">{{ acc.coins }}</div>
          <div class="cell">{{ acc.tickets }}</div>
          <div class="cell">{{ acc.rate.toFixed(2) }}</div>
        </div>
      </div>
    </div>

    <!-- record 部分 -->
    <div class="record-table">
      <div class="row header">
        <div class="cell">日期</div>
        <div class="cell">星期</div>
        <div class="cell">运行时间</div>
        <div class="cell">投币数</div>
        <div class="cell">出票数</div>
        <div class="cell">出票率</div>
      </div>
      <div v-if="dataObj && dataObj.data && dataObj.data.record">
        <div
          v-for="rec in dataObj.data.record"
          :key="rec.date"
          class="row"
        >
          <div class="cell">{{ rec.date }}</div>
          <div class="cell">{{ rec.week || '--' }}</div>
          <div class="cell">{{ rec.times || '0小时' }}</div>
          <div class="cell">{{ rec.coins }}</div>
          <div class="cell">{{ rec.tickets }}</div>
          <div class="cell">{{ rec.rate.toFixed(2) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyAccount',
  props: {
    dataObj: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.container {
  background: black;
  color: white;
  text-align: center;
  padding: 20px;
}

/* 通用表格样式 */
.account-table, .record-table {
  margin: 20px auto;
  border-collapse: collapse;
}

.row {
  display: flex;
}

.cell {
  flex: 1;
  border: 1px solid white;
  padding: 8px;
}

/* 表头颜色 */
.green { color: limegreen; }
.cyan { color: cyan; }
.pink { color: hotpink; }
.orange { color: orange; }

.btn-group {
  margin-top: 20px;
}

.btn-group button {
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  margin: 0 10px;
  cursor: pointer;
}
</style>
