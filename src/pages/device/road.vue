<template>
  <div class="container">
    <h3>--- 货道数据 ---</h3>

    <div class="road-group">
      <!-- 1P货道 -->
      <div class="road-block">
        <div class="title title-green">1P货道</div>
        <div class="road-header">
          <div class="label"></div>
          <div v-for="r in roads1P" :key="r.road" class="cell">{{ r.road }}</div>
        </div>
        <div class="road-row">
          <div class="cell">次数</div>
          <div v-for="r in roads1P" :key="r.road" class="cell">{{ r.times }}</div>
        </div>
        <div class="road-row">
          <div class="cell">价值</div>
          <div v-for="r in roads1P" :key="r.road" class="cell">{{ r.price }}</div>
        </div>
      </div>

      <!-- 2P货道 -->
      <div class="road-block">
        <div class="title title-pink">2P货道</div>
        <div class="road-header">
          <div v-for="r in roads2P" :key="r.road" class="cell">{{ r.road }}</div>
        </div>
        <div class="road-row">
          <div v-for="r in roads2P" :key="r.road" class="cell">{{ r.times }}</div>
        </div>
        <div class="road-row">
          <div v-for="r in roads2P" :key="r.road" class="cell">{{ r.price }}</div>
        </div>
      </div>

      <!-- 总数 -->
      <div class="road-block">
        <div class="title title-pink">&nbsp;</div>
        <div class="road-header">
          <div v-for="r in total" :key="r.road" class="cell">{{ r.road }}</div>
        </div>
        <div class="road-row">
          <div v-for="r in total" :key="r.road" class="cell">{{ r.times }}</div>
        </div>
        <div class="road-row">
          <div v-for="r in total" :key="r.road" class="cell">{{ r.price }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyRoads',
  props: {
    dataObj: {
      type: Object,
      required: true
    }
  },
  computed: {
    // 过滤 1P 和 2P 的货道
    roads1P () {
      return (this.dataObj.data?.roads || []).filter(r => r.name === '1P货道')
    },
    roads2P () {
      return (this.dataObj.data?.roads || []).filter(r => r.name === '2P货道')
    },
    total () {
      return (this.dataObj.data?.roads || []).filter(r => r.name === '总数')
    },
    totalTimes () {
      return this.roads2P.reduce((sum, r) => sum + r.times, 0)
    },
    totalPrice () {
      return this.roads2P.reduce((sum, r) => sum + r.price, 0)
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

.road-group {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.road-block {
  margin: 0 20px;
}

.title {
  font-size: 20px;
  margin-bottom: 10px;
}

.title-green {
  color: limegreen;
}
.title-pink {
  color: hotpink;
}

.road-header,
.road-row {
  display: flex;
}

.label {
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cell {
  width: 60px;
  border: 1px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.exit-btn {
  margin-top: 30px;
  background: none;
  color: white;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
</style>
