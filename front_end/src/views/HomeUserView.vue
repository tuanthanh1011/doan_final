<template>
 <div>
   <the-slide-bar></the-slide-bar>

  <!-- Banner -->
  <the-banner></the-banner>

  <!-- Product -->
  <section class="bg0 p-t-23 p-b-140">
    <div class="container">
      <div class="p-b-10" style="margin-bottom: 24px">
        <h5 class="ltext-103 cl5 f-arial" style="font-size: 28px">
          <router-link to="/do-nuong" style="color: black !important">
            DANH SÁCH SẢN PHẨM
          </router-link>
        </h5>
      </div>

      <list-product :listProduct="listProduct"></list-product>

      <!-- <div class="p-b-10" style="margin-bottom: 24px">
        <h5 class="ltext-103 cl5 f-arial" style="font-size: 28px">
          <router-link to="/do-lau" style="color: black !important">
            DANH SÁCH ĐỒ LẨU
          </router-link>
        </h5>
      </div>

      <list-product :listProduct="listProduct_lau"></list-product> -->
    </div>
  </section>

  <!-- Back to top -->
  <div class="btn-back-to-top" id="myBtn">
    <span class="symbol-btn-back-to-top">
      <i class="zmdi zmdi-chevron-up"></i>
    </span>
  </div>
 </div>
</template>

<script>
import initializeJQueryLogic from "@/core-js/main";
import { computed, onMounted, ref } from "vue";
import TheSlideBar from "@/components/client/TheSlideBar.vue";
import ListProduct from "@/components/client/list-products/ListProduct.vue";
import TheBanner from "@/components/client/TheBanner.vue";
import { getAllProduct } from "@/apis/modules/api.product";
import { useStore } from "vuex";
import { getProductWishListApi } from "@/apis/modules/api.wish_list";
export default {
  components: { TheSlideBar, ListProduct, TheBanner },
  setup() {
    const store = useStore();

    const listProduct = ref([]);

    const fetchData = async () => {
      try {
        const userLogin = computed(() => store.state.auth.userLogin);

        let listProductWishlist = [];
        if (userLogin.value.id) {
          listProductWishlist = (
            await getProductWishListApi(userLogin.value.id)
          ).rows;

          listProductWishlist = listProductWishlist.map((product) => {
            return product.product.id;
          });
        }
        const result = await getAllProduct();

        const listProductProcessed = result.rows.map((product) => {
          return {
            ...product,
            isWishList: listProductWishlist.includes(product.id),
          };
        });

        listProduct.value = listProductProcessed;
      } catch (err) {
        console.log("Đã xảy ra lỗi", err);
      }
    };

    onMounted(() => {
      initializeJQueryLogic();
      fetchData();
    });

    return {
      listProduct,
    };
  },
};
</script>

<style></style>
