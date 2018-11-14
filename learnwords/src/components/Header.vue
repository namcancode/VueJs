<template>
    <div class="row mb-3">
        <div class="col-sm-12">
            <div class="progress">
                <div class="progress-bar bg-success" :style="{width:(itemCount / maxItem) *100 +'%'}">{{itemCount}}/{{maxItem}}</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  props: ['itemCount', 'maxItem']
}
</script>
<style>
</style>
