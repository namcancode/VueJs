<template>
    <div class="row">
        <form>
            <div class="row">
                <div class="col-8 offset-sm-2 offset-md-3 form-group text-center m-auto">
                    <label for="">U can saying...</label>
                    <textarea name="" id="" cols="30" rows="10" v-model='item' class="form-group"></textarea>
                </div>
                <div class="col-sm-8 offset-sm-2 col-md-6 offset-md-3 form-group ml-5">
                    <button class="btn btn-success" @click.prevent="createNew">Add</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
export default {
  data: function() {
    return {
      item: ''
    }
  },
  methods: {
    createNew() {
      if (!this.item.trim()) return
      this.$emit('itemadded', this.item)
  
    }
  }
}
</script>
<style scoped>
textarea {
  width: 100%;
  height: 40px;
}
</style>
