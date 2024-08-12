<template>
  <div style="flex-grow: 1">
    <a-layout-header style="background: #fff; padding: 0; height: 20px">
    </a-layout-header>
    <a-layout-content style="margin: 0 16px">
      <div class="form-container">
        <a-form>
          <div style="padding-top: 32px"></div>
          <a-row justify="space-between">
            <a-row :span="8" style="margin-left: 8px">
              <a-form-item label="Tên món ăn">
                <a-input
                  placeholder="nhập dữ liệu"
                  v-model:value="searchValue"
                />
              </a-form-item>
              <div style="margin: 0 8px"></div>
            </a-row>
            <a-col :span="4"></a-col>
            <a-col :span="4" style="display: flex; justify-content: end">
              <a-form-item>
                <a-button
                  type="primary"
                  :loading="iconLoading"
                  @click="handleSearch"
                  class="m-6"
                >
                  <template #icon><SearchOutlined /></template>
                  Tìm kiếm
                </a-button>
                <a-button class="m-6" @click="resetData">Làm mới</a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="table-container">
        <a-row
          style="display: flex; justify-content: space-between; padding: 0 16px"
        >
          <a-label
            style="
              display: block;
              margin-left: 8px;
              margin-bottom: 16px;
              font-weight: 600;
            "
          >
            Danh sách món ăn
          </a-label>

          <!-- Thêm mới món ăn -->
          <div>
            <a-button type="primary" @click="visible = true">
              <PlusOutlined /> Thêm mới
            </a-button>
            <a-modal
              v-model:open="visible"
              title="Thêm mới món ăn"
              @ok="onOkAdd"
              ok-text="Thêm mới"
              cancel-text="Hủy bỏ"
            >
              <a-form
                ref="formRef"
                :model="formState"
                layout="vertical"
                name="form_in_modal"
              >
                <a-form-item
                  name="productName"
                  label="Tên món ăn"
                  :rules="[
                    {
                      required: true,
                      message: 'Tên món ăn là bắt buộc!',
                    },
                  ]"
                >
                  <a-input v-model:value="formState.productName" />
                </a-form-item>

                <a-form-item
                  name="image"
                  label="Ảnh món ăn"
                  :rules="[
                    {
                      validator: checkImage,
                      required: true,
                      message: 'Ảnh món ăn là bắt buộc!',
                    },
                  ]"
                >
                  <a-upload
                    v-model:file-list="fileList"
                    :before-upload="beforeUpload"
                    list-type="picture"
                    :max-count="1"
                  >
                    <a-button>
                      <upload-outlined></upload-outlined>
                      Tải ảnh lên
                    </a-button>
                  </a-upload>
                </a-form-item>

                <a-form-item
                  name="subcategory"
                  label="Danh mục"
                  :rules="[
                    {
                      required: true,
                      message: 'Danh mục là bắt buộc!',
                    },
                  ]"
                >
                  <a-select
                    v-model:value="formState.subcategory"
                    placeholder="Chọn danh mục"
                    allowClear
                  >
                    <a-select-option
                      v-for="category in categories"
                      :key="category.id"
                      :value="category.id"
                    >
                      {{ category.subCategoryName }}
                    </a-select-option>
                  </a-select>
                </a-form-item>

                <a-form-item
                  name="price"
                  label="Giá món ăn"
                  :rules="[
                    {
                      required: true,
                      message: 'Giá món ăn là bắt buộc!',
                    },
                    {
                      validator: (rule, value, callback) => {
                        if (isNaN(value)) {
                          callback(new Error('Giá món ăn phải là một số!'));
                        } else {
                          callback();
                        }
                      },
                    },
                  ]"
                >
                  <a-input v-model:value="formState.price" />
                </a-form-item>
              </a-form>
            </a-modal>
          </div>
          <!-- Kết thúc thêm mới -->
        </a-row>
        <a-spin :spinning="loading">
          <a-table
            :columns="columns"
            :data-source="data"
            bordered
            :pagination="false"
            size="middle"
          >
            <template #bodyCell="{ record, column }">
              <template v-if="column.key === 'operation'">
                <a>
                  <!-- Button xóa -->
                  <a-button @click="showConfirm(record.key)" class="m-04">
                    <DeleteOutlined class="fs-16 m-04" />
                  </a-button>

                  <!-- Xử lý sửa -->
                  <a-button
                    @click="handleGetProductDetail(record.productId)"
                    class="m-04"
                  >
                    <EditOutlined />
                  </a-button>
                  <a-modal
                    v-model:open="open"
                    title="Thông tin món ăn"
                    @ok="handleSubmitChangeProduct(record.productId)"
                    ok-text="Cập nhật"
                    cancel-text="Hủy bỏ"
                    :maskStyle="{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }"
                    :contentWrapperStyle="{ boxShadow: 'none' }"
                  >
                    <a-form
                      ref="formRefEdit"
                      :model="productDetailCurrent"
                      layout="vertical"
                      name="form_in_modal_edit"
                    >
                      <a-form-item
                        name="productNameEdit"
                        label="Tên món ăn"
                        class="form-item"
                        :rules="[
                          {
                            required: true,
                            message: 'Tên món ăn không được để trống!',
                          },
                        ]"
                      >
                        <a-input
                          v-model:value="productDetailCurrent.productNameEdit"
                        />
                      </a-form-item>

                      <a-form-item
                        label="Giá món ăn"
                        name="priceEdit"
                        class="form-item"
                        :rules="[
                          {
                            required: true,
                            message: 'Giá món ăn không được để trống!',
                          },
                          {
                            validator: (rule, value, callback) => {
                              if (isNaN(value)) {
                                callback(
                                  new Error('Giá món ăn phải là một số!')
                                );
                              } else {
                                callback();
                              }
                            },
                          },
                        ]"
                      >
                        <a-input
                          v-model:value="productDetailCurrent.priceEdit"
                        />
                      </a-form-item>

                      <a-form-item
                        label="Trạng thái"
                        name="isActive"
                        class="form-item"
                        :rules="[
                          {
                            required: true,
                            message: 'Trạng thái chưa được chọn!',
                          },
                        ]"
                      >
                        <a-switch
                          v-model:checked="productDetailCurrent.isActive"
                        />
                      </a-form-item>

                      <a-form-item
                        name="subcategoryEdit"
                        label="Danh mục"
                        :rules="[
                          {
                            required: true,
                            message: 'Danh mục là bắt buộc!',
                          },
                        ]"
                      >
                        <a-select
                          v-model:value="productDetailCurrent.subcategoryEdit"
                          placeholder="Chọn danh mục"
                          allowClear
                        >
                          <a-select-option
                            v-for="category in categories"
                            :key="category.id"
                            :value="category.id"
                          >
                            {{ category.subCategoryName }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>

                      <a-form-item
                        name="imageEdit"
                        label="Ảnh món ăn"
                        :rules="[
                          {
                            required: true,
                            message: 'Ảnh món ăn là bắt buộc!',
                          },
                        ]"
                      >
                        <img
                          v-if="productDetailCurrent.imageEdit"
                          :src="
                            `${config.MINIO_URL}` +
                            productDetailCurrent.imageEdit
                          "
                          alt="avatar"
                          style="
                            width: 20%;
                            margin-top: 8px;
                            border-radius: 4px;
                          "
                        />
                        <br />
                        <div style="margin-top: 8px"></div>
                        <a-upload
                          v-model:file-list="fileList"
                          :before-upload="beforeUpload"
                          list-type="picture"
                          :max-count="1"
                        >
                          <a-button>
                            <upload-outlined></upload-outlined>
                            Tải ảnh lên
                          </a-button>
                        </a-upload>
                      </a-form-item>
                    </a-form>
                  </a-modal>
                  <!-- Kết thúc xử lý sửa -->
                </a>
              </template>
            </template>
          </a-table>
          <a-pagination
            style="position: absolute; right: 0; margin: 24px 0"
            v-model:current="page"
            v-model:page-size="perPage"
            :total="total"
            :show-total="
              (total, range) => `${range[0]}-${range[1]} of ${total} items`
            "
            @change="handlePageChange"
            @size-change="handleSizeChange"
          />
        </a-spin>
      </div>
    </a-layout-content>
  </div>
</template>

<script setup>
import { PlusOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { reactive, ref, toRaw } from "vue";
import { onMounted } from "vue";
import config from "@/configs/config";
import {
  EditOutlined,
  SearchOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import {
  createAProduct,
  deleteAProduct,
  getAllProductByAmin,
  getDetailProduct,
  updateAProduct,
  uploadImageProduct,
} from "@/apis/modules/api.product";
import { formatDate } from "@/utils/formatDate";
import { getAllSubcategory } from "@/apis/modules/api.subcategory";

const formRef = ref();
const visible = ref(false);
const formState = reactive({
  productName: "",
  subcategory: "",
  image: "",
  price: "",
});

const fileList = ref([]);
const categories = ref([]);
const loading = ref(false);
const iconLoading = ref(false);
const data = ref([]);
const searchValue = ref("");

const page = ref(1);
const perPage = ref(10);
const total = ref(0);

// Xử lý tải ảnh món ăn
const beforeUpload = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await uploadImageProduct(formData);
    formState.image = response.urlImage;
  } catch (err) {
    message.error(err.response.data.message || "Có lỗi xảy ra");
  }
  return false;
};

const checkImage = (rule, value, callback) => {
  if (fileList.value.length === 0) {
    callback(new Error("Vui lòng chọn ảnh món ăn!"));
  } else {
    callback();
  }
};

// Kết thúc

const onOkAdd = async () => {
  try {
    await formRef.value.validateFields();

    const data = toRaw(formState);

    try {
      await createAProduct(data);
      message.success("Thêm món ăn thành công");
      formRef.value.resetFields();
      fileList.value = [];
      fetchData();
      visible.value = false;
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (err) {
      message.error(err.response.data.message || "Có lỗi xảy ra");
    }
  } catch (error) {
    console.log(error);
  }
};

const columns = ref([
  {
    title: "Mã món ăn",
    width: 50,
    dataIndex: "productId",
    key: "productId",
    fixed: "left",
  },
  {
    title: "Tên món ăn",
    width: 30,
    dataIndex: "productName",
    key: "productName",
    fixed: "left",
    sorter: (a, b) => a.productName.localeCompare(b.productName),
  },
  {
    title: "Giá món ăn (VNĐ)",
    dataIndex: "price",
    key: "price",
    width: 30,
    sorter: (a, b) => a.price.localeCompare(b.price),
  },
  {
    title: "Danh mục",
    dataIndex: "subCategoryName",
    key: "subCategoryName",
    width: 50,
    sorter: (a, b) => a.subCategoryName.localeCompare(b.subCategoryName),
  },
  {
    title: "Trạng thái",
    dataIndex: "isActive",
    key: "isActive",
    width: 50,
    sorter: (a, b) => a.isActive.localeCompare(b.isActive),
  },
  {
    title: "Thời gian tạo",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 50,
    sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
  },
  {
    title: "Hành động",
    key: "operation",
    fixed: "right",
    width: 20,
  },
]);

onMounted(async () => {
  await fetchData();
});

async function fetchData() {
  try {
    loading.value = true;
    const response = await getAllProductByAmin({
      page: page.value,
      perPage: perPage.value,
      search: searchValue.value,
    });
    categories.value = (await getAllSubcategory()).rows;

    data.value = response.rows.map((product) => ({
      key: product.id,
      productId: product.id,
      productName: product.productName,
      image: product.image,
      price: product.price
        .toString()
        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, "."),
      isActive: product.isActive == true ? "Đang hoạt động" : "Tạm dừng",
      subCategoryName:
        product.subcategory.category.categoryName +
        " / " +
        product.subcategory.subCategoryName,
      createdAt: formatDate(product.createdAt),
    }));
    total.value = response.total;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  setLoading(true);
  setTimeout(() => {
    fetchData();
    setLoading(false);
  }, 500);
}

function handleEdit() {
  setLoading(true);
  setTimeout(() => {
    setLoading(false);
  }, 500);
}

function resetData() {
  setLoading(true);
  setTimeout(() => {
    page.value = 1;
    perPage.value = 10;
    searchValue.value = "";
    setLoading(false);
    fetchData();
  }, 500);
}

function setLoading(value) {
  loading.value = value;
}

function handlePageChange(newPage) {
  page.value = newPage;
  fetchData();
}

function handleSizeChange(newPerPage) {
  perPage.value = newPerPage;
  fetchData();
}

// Xử lý sửa bản ghi
const formRefEdit = ref();
const open = ref(false);
const size = ref("default");
const productDetailCurrent = reactive({
  productNameEdit: "",
  priceEdit: "",
  imageEdit: "",
  subcategoryEdit: "",
});
const showDrawer = (val) => {
  size.value = val;
  open.value = true;
};
const onClose = () => {
  open.value = false;
};

const handleGetProductDetail = async (productId) => {
  fileList.value = [];
  showDrawer("default");
  try {
    const result = await getDetailProduct(productId);
    productDetailCurrent.productId = productId;
    productDetailCurrent.priceEdit = result.price;
    productDetailCurrent.imageEdit = result.image;
    productDetailCurrent.subcategoryEdit = result.subcategory.id;
    productDetailCurrent.productNameEdit = result.productName;
    productDetailCurrent.isActive = result.isActive;
  } catch (err) {
    console.log(err);
  }
};

const handleSubmitChangeProduct = async () => {
  try {
    await formRefEdit.value.validateFields();
    const data = {
      productName: productDetailCurrent.productNameEdit,
      image: productDetailCurrent.imageEdit,
      price: productDetailCurrent.priceEdit,
      isActive: productDetailCurrent.isActive,
      subcategory: productDetailCurrent.subcategoryEdit,
    };
    await updateAProduct(productDetailCurrent.productId, data);
    message.success("Cập nhật món ăn thành công");
    fetchData();
    onClose();
    handleEdit();
    fileList.value = [];
  } catch (err) {
    console.log(err);
  }
};

// Xử lý xóa bản ghi
async function handleDelete(productId) {
  setLoading(true);
  try {
    await deleteAProduct(productId);
  } catch (err) {
    message.error("Sản phẩm đã được sử dụng. Không thể xóa");
  }
  fetchData();
  setLoading(false);
}

import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { createVNode } from "vue";
import { Modal } from "ant-design-vue";

const showConfirm = (productId) => {
  Modal.confirm({
    title: "Xác nhận xóa bản ghi",
    icon: createVNode(ExclamationCircleOutlined),
    content: "Bạn có chắc chắn muốn xóa món ăn không?",
    onOk() {
      handleDelete(productId);
    },
    onCancel() {},
    okText: "Xác nhận",
    cancelText: "Hủy bỏ",
  });
};
</script>

<style scoped>
#components-layout-demo-side .logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
}

.ant-drawer-mask {
  background-color: rgba(0, 0, 0, 0.5);
}

.site-layout .site-layout-background {
  background: #fff;
}

[data-theme="dark"] .site-layout .site-layout-background {
  background: #141414;
}

.form-container {
  background: #fff;
  padding: 0 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
}

.m-6 {
  margin: 6px;
}

#components-table-demo-summary tfoot th,
#components-table-demo-summary tfoot td {
  background: #fafafa;
}
[data-theme="dark"] #components-table-demo-summary tfoot th,
[data-theme="dark"] #components-table-demo-summary tfoot td {
  background: #1d1d1d;
}
.fs-16 {
  font-size: 16px;
}
.m-04 {
  margin: 0 4px;
}

.bold-label {
  font-weight: bold;
}
</style>
