<template>
  <!-- Product -->
  <section class="bg0 p-t-23 p-b-140">
    <div class="container">
      <div class="p-b-10">
        <h3 class="ltext-103 cl5 f-arial" style="font-size: 24px">
          THỰC ĐƠN MÓN ĂN
        </h3>
      </div>

      <div class="flex-w flex-sb-m p-b-52">
        <div class="flex-w flex-l-m m-tb-10">
          <button
            class="stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5"
            @click="addParam({ subCategory: '' })"
          >
            Tất cả sản phẩm
          </button>
        </div>

        <div class="flex-w flex-c-m m-tb-10">
          <div
            style="min-width: 140px"
            class="flex-c-m stext-106 cl6 size-104 bor4 pointer hov-btn3 trans-04 m-r-8 m-tb-4 js-show-filter"
          >
            <i
              class="icon-filter cl2 m-r-6 fs-15 trans-04 zmdi zmdi-filter-list"
            ></i>
            <i
              class="icon-close-filter cl2 m-r-6 fs-15 trans-04 zmdi zmdi-close dis-none"
            ></i>
            Lọc sản phẩm
          </div>

          <!-- <div
            class="flex-c-m stext-106 cl6 size-105 bor4 pointer hov-btn3 trans-04 m-tb-4 js-show-search"
          >
            <i
              class="icon-search cl2 m-r-6 fs-15 trans-04 zmdi zmdi-search"
            ></i>
            <i
              class="icon-close-search cl2 m-r-6 fs-15 trans-04 zmdi zmdi-close dis-none"
            ></i>
            Search
          </div> -->
        </div>

        <!-- Search product -->
        <div class="dis-none panel-search w-full p-t-10 p-b-15">
          <div class="bor8 dis-flex p-l-15">
            <button class="size-113 flex-c-m fs-16 cl2 hov-cl1 trans-04">
              <i class="zmdi zmdi-search"></i>
            </button>

            <input
              class="mtext-107 cl2 size-114 plh2 p-r-15"
              type="text"
              name="search-product"
              placeholder="Search"
            />
          </div>
        </div>

        <!-- Filter -->
        <div class="dis-none panel-filter w-full p-t-10">
          <div class="wrap-filter flex-w bg6 w-full p-lr-40 p-t-27 p-lr-15-sm">
            <div class="filter-col1 p-r-15 p-b-27">
              <div class="mtext-102 cl2 p-b-15">Sắp xếp theo</div>

              <ul>
                <li class="p-b-6">
                  <a
                    href="#"
                    class="filter-link stext-106 trans-04"
                    @click="
                      addParam({
                        sortBy: 'id',
                        sortOrder: 'ASC',
                      })
                    "
                  >
                    Mặc định
                  </a>
                </li>

                <li class="p-b-6">
                  <a
                    href="#"
                    class="filter-link stext-106 trans-04"
                    @click="
                      addParam({
                        sortBy: 'price',
                        sortOrder: 'ASC',
                      })
                    "
                  >
                    Giá từ thấp tới cao
                  </a>
                </li>

                <li class="p-b-6">
                  <a
                    href="#"
                    class="filter-link stext-106 trans-04"
                    @click="
                      addParam({
                        sortBy: 'price',
                        sortOrder: 'DESC',
                      })
                    "
                  >
                    Giá từ cao tới thấp
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <list-product :listProduct="listProduct"></list-product>

      <!-- Load more -->
      <!-- <div class="flex-c-m flex-w w-full p-t-45">
        <ul class="pagination">
          <li v-if="totalPage &gt; 3" class="page-item">
            <a class="page-link" href="#">Trước</a>
          </li>
          <li class="page-item">
            <a class="page-link" href="#">1</a>
          </li>
          <li v-if="totalPage &gt; 3" class="page-item">
            <a class="page-link" href="#">Sau</a>
          </li>
        </ul>
      </div> -->
    </div>
  </section>

  <!-- Back to top -->
  <div class="btn-back-to-top" id="myBtn">
    <span class="symbol-btn-back-to-top">
      <i class="zmdi zmdi-chevron-up"></i>
    </span>
  </div>
</template>

<script>
import initializeJQueryLogic from "@/core-js/main";
import { computed, onMounted, ref } from "vue";
import { getAllProduct } from "@/apis/modules/api.product";
import ListProduct from "@/components/client/list-products/ListProduct.vue";
import { useStore } from "vuex";
import { getProductWishListApi } from "@/apis/modules/api.wish_list";
export default {
  components: { ListProduct },
  setup() {
    const store = useStore();

    const listProduct = ref([]);
    const params = ref({
      subCategory: "mon-an",
      page: 1,
      perPage: 8,
    });

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

        const result = await getAllProduct(params.value);

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

    const addParam = (param) => {
      for (const key in param) {
        params.value[key] = param[key];
      }
      fetchData();
    };

    onMounted(() => {
      initializeJQueryLogic();
      fetchData();
    });

    return {
      fetchData,
      listProduct,
      addParam,
    };
  },
};
</script>

<style></style>
