<template>
  <div id="app">
    <app-header :itemCount="items.length" :maxItem="maxItems"></app-header>
    <app-new-item @itemadded="addItem"></app-new-item>
    <app-item-layout :items="items" @itemRemoved="removeItem"></app-item-layout>
    <div class="row mt-4">
      <div class="col-sm-12 text-center">
        <div class="alert alert-info">
          Info: Click on a Item to delete it!
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from './components/Header'
import ItemLayout from './components/ItemsLayout'
import NewItem from './components/NewItem'
export default {
  data: function() {
    return {
      items: ['hello', 'huong'],
      maxItems: 10
    }
  },
  components: {
    appItemLayout: ItemLayout,
    appNewItem: NewItem,
    appHeader: Header
  },
  methods: {
    addItem(item) {
      if (
        this.items
          .toLocaleString()
          .toLowerCase()
          .split(',')
          .includes(item.toLowerCase())
      )
        return
      if (this.items.length >= this.maxItems) return
      this.items.push(item)
    },
    removeItem(index) {
      this.items.splice(index, 1)
    }
  }
}
</script>

<style>
</style>


