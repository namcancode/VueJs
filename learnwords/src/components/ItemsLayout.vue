<template>
  <div class="row">
    <app-item v-for="(item, index) in items" :key="item" @click.native="removeItem(index)">
      {{item}}
    </app-item>
  </div>
</template>
<script>
import Items from './Items.vue'
export default {
  props: ['items'],
  components: {
    appItem: Items
  },
  methods: {
    removeItem(index) {
      this.$emit('itemRemoved', index)
    }
  }
}
</script>
<style>
</style>
