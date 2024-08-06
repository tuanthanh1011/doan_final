import { loginAuthApi, logoutAuthApi } from "@/apis/modules/api.auth";
import { typeAlertBox } from "@/constants/enum";
import { fixEncoding } from "@/utils/fixEncoding";
import displayToast from "@/utils/handleToast";
import { verifyToken } from "@/utils/jsonwebtoken";

const moduleAuth = {
  state: () => ({
    userLogin: {},
    isLogin: false,
    userId: "",
  }),
  mutations: {
    delUserLoginMutation(state) {
      state.userLogin = {};
      state.isLogin = false;
      state.userId = "";
    },

    setUserLoginFromToken(state) {
      if (localStorage.getItem("accessToken")) {
        const userDecoded = verifyToken();
        state.userLogin = {
          id: userDecoded.id,
          username: fixEncoding(userDecoded.username),
          email: userDecoded.email,
          role: userDecoded.role,
          avatar: userDecoded.avatar,
        };
        state.isLogin = true;
        state.userId = userDecoded.id;
      } else {
        state.isLogin = false;
        state.userLogin = {};
        state.userId = "";
      }
    },
  },
  actions: {
    async loginAction({ dispatch }, { data, router }) {
      try {
        const { access_token } = await loginAuthApi(data);

        displayToast(dispatch, typeAlertBox.SUCCESS, "Đăng nhập thành công");

        localStorage.setItem("accessToken", access_token);

        dispatch("cart/setCartAction", null, { root: true });

        router.push("/home");
      } catch (err) {
        displayToast(
          dispatch,
          typeAlertBox.ERROR,
          "Thông tin tài khoản không chính xác"
        );
      }
    },

    async loginOauthAction({ dispatch }, { access_token, router }) {
      try {
        displayToast(dispatch, typeAlertBox.SUCCESS, "Đăng nhập thành công");

        localStorage.setItem("accessToken", access_token);

        dispatch("cart/setCartAction", null, { root: true });
        dispatch("wishList/setWishListAction", null, { root: true });

        router.push("/home");
      } catch (err) {
        displayToast(
          dispatch,
          typeAlertBox.ERROR,
          "Thông tin tài khoản không chính xác"
        );
      }
    },

    async logoutAction({ commit, dispatch }, router) {
      try {
        await logoutAuthApi();

        displayToast(dispatch, typeAlertBox.SUCCESS, "Đăng xuất thành công");

        localStorage.removeItem("accessToken");

        commit("delUserLoginMutation");

        dispatch("cart/setCartAction", null, { root: true });
        commit("wishList/clearCart", null, { root: true });

        router.push("/home");
      } catch (err) {
        displayToast(
          dispatch,
          typeAlertBox.ERROR,
          "Đăng xuất không thành công"
        );
      }
    },

    loadUserLoginByToken({ commit }) {
      commit("setUserLoginFromToken");
    },
  },
};

export default moduleAuth;
