<template>
  <div class="row isotope-grid">
    <item-product
      v-for="(product, index) in listProduct"
      :key="index"
      :product="product"
    ></item-product>
  </div>
</template>

<script>
import ItemProduct from "./ItemListProduct.vue";

export default {
  components: { ItemProduct },
  props: {
    listProduct: {
      type: Object,
      required: true,
    },
  },
  setup() {},
};
</script>

<style scoped></style>
