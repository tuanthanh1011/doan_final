<template>
  <div class="wrap-modal1 js-modal1 p-t-60 p-b-20 show-modal1">
    <div class="overlay-modal1"></div>

    <div
      class="container"
      style="
        max-width: 1000px !important;
        position: relative;
        top: 50%;
        transform: translateY(-50%);
      "
    >
      <div class="bg0 p-t-60 p-b-30 p-lr-15-lg how-pos3-parent">
        <button class="how-pos3 hov3 trans-04" @click="handleCloseCartModal">
          <img src="images/icons/icon-close.png" alt="CLOSE" />
        </button>

        <div class="row" style="height: 60%">
          <div class="col-md-6 col-lg-7 p-b-30">
            <div class="p-l-25 p-r-30 p-lr-0-lg">
              <div class="wrap-slick3 flex-sb flex-w">
                <div class="wrap-slick3-dots"></div>
                <div class="wrap-slick3-arrows flex-sb-m flex-w"></div>

                <div class="slick3 gallery-lb">
                  <div
                    class="item-slick3"
                    data-thumb="images/product-detail-01.jpg"
                  >
                    <div class="wrap-pic-w pos-relative">
                      <img
                        :src="fullImageUrl"
                        alt="IMG-PRODUCT"
                        style="height: 44vh"
                      />

                      <!-- <a
                        class="flex-c-m size-108 how-pos1 bor0 fs-16 cl10 bg0 hov-btn3 trans-04"
                        href="images/product-detail-01.jpg"
                      >
                        <i class="fa fa-expand"></i>
                      </a> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-5 p-b-30">
            <div class="p-r-50 p-t-5 p-lr-0-lg">
              <h4 class="cl2 js-name-detail p-b-14">
                Tên sản phẩm: {{ detailProduct.productName }}
              </h4>

              <p>Giá thành: {{ processedPrice }} đ <br /></p>

              <p class="stext-102 cl3 p-t-23" v-if="detailProduct.subcategory">
                Danh mục sản phẩm:
                {{ detailProduct.subcategory.subCategoryName }}
              </p>

              <p class="stext-102 cl3 p-t-23">
                Đánh giá ({{ detailProduct.rateTotal }}):
                <a-rate disabled :value="detailProduct.rateAvg" />
              </p>

              <div
                class="flex-w flex-r-m p-b-10"
                style="justify-content: flex-start; margin-top: 12px"
              >
                <div class="size-204 flex-w flex-m respon6-next">
                  <div class="wrap-num-product flex-w m-r-20 m-tb-10">
                    <div
                      class="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m"
                      @click="handleChangeNumberProduct(-1)"
                    >
                      <i class="fs-16 zmdi zmdi-minus"></i>
                    </div>

                    <input
                      class="mtext-104 cl3 txt-center num-product"
                      type="number"
                      v-model="numberProduct"
                      readonly
                    />

                    <div
                      class="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m"
                      @click="handleChangeNumberProduct(1)"
                    >
                      <i class="fs-16 zmdi zmdi-plus"></i>
                    </div>
                  </div>
                </div>
              </div>

              <button
                class="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04 js-addcart-detail"
                style="margin-top: 20px"
                @click="handleAddCart(detailProduct.id)"
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toRefs, computed, ref } from "vue";
import { formatNumberWithDots } from "@/utils/formatStringNumber";
import { createACart } from "@/apis/modules/api.cart";
import config from "@/configs/config";
import { useStore } from "vuex";
import displayToast from "@/utils/handleToast";
import { typeAlertBox } from "@/constants/enum";
export default {
  props: {
    isOpen: {
      type: Boolean,
    },

    detailProduct: {
      type: Object,
    },

    handleCloseModal: {
      type: Function,
    },
  },

  methods: {
    handleCloseCartModal() {
      this.handleCloseModal();
    },
  },

  setup(props) {
    const store = useStore();
    const { detailProduct } = toRefs(props);

    const isLogin = computed(() => store.state.auth.isLogin);

    const numberProduct = ref(1);

    const fullImageUrl = computed(() => {
      return config.MINIO_URL + detailProduct.value.image;
    });

    const processedPrice = computed(() => {
      return formatNumberWithDots(detailProduct.value.price);
    });

    const handleChangeNumberProduct = (number) => {
      if (numberProduct.value + number >= 1) {
        numberProduct.value = numberProduct.value + number;
      }
    };

    const handleAddCart = async (productId) => {
      try {
        if (isLogin.value == false) {
          displayToast(
            store.dispatch,
            typeAlertBox.ERROR,
            "Vui lòng thực hiện đăng nhập"
          );
        } else {
          await createACart({
            product: productId,
            quantity: numberProduct.value,
          });

          displayToast(
            store.dispatch,
            typeAlertBox.SUCCESS,
            "Thêm sản phẩm thành công"
          );

          store.dispatch("cart/setCartAction");
        }
      } catch (err) {
        console.log(err);
      }
    };

    return {
      fullImageUrl,
      processedPrice,
      handleAddCart,
      numberProduct,
      handleChangeNumberProduct,
      isLogin,
    };
  },
};
</script>

<style></style>
