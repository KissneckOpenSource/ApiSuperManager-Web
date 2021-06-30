<style lang="less" scoped>
@import "./list.less";
</style>
<template>
  <div>
    <Row>
      <Col span="24">
      <Card class="margin-bottom-10">
        <Form inline>
          <FormItem class="margin-bottom-0">
            <Select v-model="searchConf.status" clearable placeholder='请选择状态' style="width:120px">
              <Option :value="1">启用</Option>
              <Option :value="0">禁用</Option>
            </Select>
          </FormItem>
          <FormItem class="margin-bottom-0">
            <Select v-model="searchConf.group_hash" clearable placeholder="请选择接口分组" style="width:200px">
              <Option v-for="(v, i) in apiGroup" :value="v.hash" :kk="i" :key="v.hash"> {{v.name}}</Option>
            </Select>
          </FormItem>
          <!-- <FormItem class="margin-bottom-0">
            <Select v-model="searchConf.way_type" clearable placeholder="请选择继承目标" style="width:200px">
              <Option v-for="(v, i) in typeGroup" :value="v.value" :kk="i" :key="v.value"> {{v.name}}</Option>
            </Select>
          </FormItem>
          <FormItem class="margin-bottom-0">
            <Select v-model="searchConf.app_group_id" clearable placeholder="请选择应用" style="width:200px">
              <Option v-for="(v, i) in appList" :value="v.id" :kk="i" :key="v.app_group"> {{v.app_name}}</Option>
            </Select>
          </FormItem>
          <FormItem class="margin-bottom-0">
            <Select v-model="searchConf.type" clearable placeholder="请选择类别" style="width:120px">
              <Option :value="1">接口标识</Option>
              <Option :value="2">接口名称</Option>
              <Option :value="3">真实类库</Option>
            </Select>
          </FormItem>
          <FormItem class="margin-bottom-0">
            <Input v-model="searchConf.keywords" placeholder=""></Input>
          </FormItem> -->
          <FormItem class="margin-bottom-0">
            <Button type="primary" @click="search">{{ $t('find_button') }}/{{ $t('refresh_button') }}</Button>
          </FormItem>
        </Form>
      </Card>
      </Col>
    </Row>
    <Row>
      <Col span="24">
      <Card>
        <div class="margin-bottom-15">
          <Button type="primary" v-has="'InterfaceList/add'" @click="alertAdd"
            icon="md-add">{{ $t('add_button') }}</Button>
          <!-- <Button type="warning" v-has="'InterfaceList/refresh'" class="margin-left-5" @click="handleShowChooseApp"
            icon="md-refresh">刷新路由</Button> -->
          <Button type="info" class="margin-left-5" to="/wiki/list" icon="md-bookmarks">接口文档</Button>
        </div>
        <div>
          <Table :loading="listLoading" :columns="columnsList" :data="tableData" border disabled-hover></Table>
        </div>
        <div class="margin-top-15" style="text-align: center">
          <Page :total="tableShow.listCount" :current="tableShow.currentPage" :page-size="tableShow.pageSize"
            @on-change="changePage" :page-size-opts="[20, 30, 40, 50]" @on-page-size-change="changeSize" show-elevator
            show-sizer show-total></Page>
        </div>
      </Card>
      </Col>
    </Row>
    <Modal v-model="modalSetting.show" width="668" :styles="{top: '30px'}" @on-visible-change="doCancel">
      <p slot="header" style="color:#2d8cf0">
        <Icon type="md-alert"></Icon>
        <span>{{formItem.id ? '编辑' : '新增'}}接口</span>
      </p>
      <Form ref="myForm" :rules="ruleValidate" :model="formItem" :label-width="90">
        <FormItem label="接口名称" prop="info">
          <Input v-model="formItem.info" placeholder="请输入接口名称"></Input>
        </FormItem>
        <!-- <FormItem label="应用" prop="app_group_hash">
          <Select v-model="formItem.app_group_id" style="width:200px" placeholder="请选择应用">
            <Option v-for="(v, i) in appList" :value="v.id" :kk="i" :key="v.app_group"
              @click.native="handleAppChange(v)"> {{v.app_name}}</Option>
          </Select>
        </FormItem> -->
        <!-- <FormItem label="真实类库" prop="api_class">
          <Input v-model="formItem.api_class" placeholder="请输入真实类库"></Input>
        </FormItem> -->
        <FormItem label="接口说明" prop="des">
          <Input v-model="formItem.des" placeholder="请输入接口说明（哪个页面的接口，如果没有对应页面请留空）"></Input>
        </FormItem>
        <FormItem label="接口分组" prop="group_hash">
          <Select v-model="formItem.group_hash" style="width:200px">
            <Option v-for="(v, i) in apiGroup" :value="v.hash" :kk="i" :key="v.hash"> {{v.name}}</Option>
          </Select>
        </FormItem>
        <!-- <FormItem label="继承" prop="way_type">
          <Select v-model="searchConf.way_type" clearable placeholder="请选择继承目标" style="width:200px">
            <Option v-for="(v, i) in typeGroup" :value="v.value" :kk="i" :key="v.value"> {{v.name}}</Option>
          </Select>
        </FormItem> -->
        <FormItem label="请求方式" prop="method">
          <Select v-model="formItem.method" style="width:200px">
            <Option :value="0" :key="0"> 不限</Option>
            <Option :value="1" :key="1"> POST</Option>
            <Option :value="2" :key="2"> GET</Option>
            <Option :value="3" :key="3"> PUT</Option>
            <Option :value="4" :key="4"> DELETE</Option>
            <Option :value="5" :key="5"> PATCH</Option>
          </Select>
          <Tooltip placement="right" max-width="800">
            <Icon type="md-help-circle" class="margin-left-5" color="#2d8cf0" size="20" />
            <div slot="content">
              <p>请注意：这里所配置的请求方式，将兼容Access-Token的获取方式，比如，当前接口允许使用GET请求，那么系统将会识别GET参数中的Access-Token。</p>
            </div>
          </Tooltip>
        </FormItem>
        <FormItem label="接口映射" prop="hash">
          <Input style="width: 300px" disabled v-model="formItem.hash"></Input>
          <Tag color="error" class="margin-left-5">系统自动生成，不允许修改</Tag>
        </FormItem>
        <!-- <FormItem label="AccessToken" prop="access_token">
          <Select v-model="formItem.access_token" style="width:200px">
            <Option :value="0" :key="0"> 简易认证</Option>
            <Option :value="1" :key="1"> 复杂认证</Option>
          </Select>
          <Tooltip placement="right" max-width="800">
            <Icon type="md-help-circle" class="margin-left-5" color="#2d8cf0" size="20" />
            <div slot="content">
              <p>新版本的全部接口都必须在Header中传递access-token字段，所以AccessToken必须要验证。</p>
              <p>简易认证：在请求这类接口时候，请直接在header中传递AppSecret即可，终身有效。</p>
              <p>复杂认证：在请求这类接口时候，先请求getAccessToken接口获取可用的AccessToken，记住这里的AccessToken默认只有2小时的有效期。</p>
            </div>
          </Tooltip>
        </FormItem> -->
        <!-- <FormItem label="路由模式" prop="hash_type">
          <Select v-model="formItem.hash_type" style="width:200px">
            <Option :value="1" :key="1"> 普通模式</Option>
            <Option :value="2" :key="2"> 加密模式</Option>
          </Select>
          <Tooltip placement="right" max-width="800">
            <Icon type="md-help-circle" class="margin-left-5" color="#2d8cf0" size="20" />
            <div slot="content">
              <p>普通模式：接口将不采用hash映射，会直接使用真实类库来请求。</p>
              <p>加密模式：接口将采用hash映射，以达到隐藏真实类库的目的。</p>
            </div>
          </Tooltip>
        </FormItem> -->
        <!-- <FormItem label="测试模式" prop="is_test">
          <Select v-model="formItem.is_test" style="width:200px">
            <Option :value="0" :key="0"> 生产模式</Option>
            <Option :value="1" :key="1"> 测试模式</Option>
          </Select>
        </FormItem> -->
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel" class="margin-right-10">取消</Button>
        <Button type="primary" @click="submit" :loading="modalSetting.loading">确定</Button>
      </div>
    </Modal>
    <Modal v-model="chooseAppModal" width="370">
      <p slot="header" style="color:#2d8cf0;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>选择应用</span>
      </p>
      <div>
        <Select v-model="app_group_id" placeholder="请选择要刷新的应用">
          <Option v-for="(v, i) in appGroupList" :value="v.id" :kk="i" :key="v.app_group"
            @click.native="handleRefreshAppChange(v)"> {{v.app_name}}</Option>
        </Select>
        <!-- <Select v-model="app_group_hash" clearable placeholder="请选择要刷新的应用">
          <Option v-for="(v, i) in appGroupList" :value="v.app_group" :kk="i" :key="v.app_group" @click.native="handleRefreshAppChange(v)"> {{v.app_name}}</Option>
        </Select> -->
      </div>
      <div slot="footer">
        <Button type="text" @click="chooseAppModal = false;" class="margin-right-10">取消</Button>
        <Button type="primary" @click="confirmApp">确定</Button>
      </div>
    </Modal>
    <Modal v-model="confirmRefresh" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>确定要刷新路由么</span>
      </p>
      <div style="text-align:center">
        <p>刷新路由是一个非常危险的操作，它有可能影响到您现有接口的访问，请确认无误后刷新！！</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="refreshLoading" @click="refreshRoute">确定刷新</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  getList,
  changeStatus,
  add,
  edit,
  del,
  getHash,
  refresh,
  getAppList,
  createFile,
} from "@/api/sass";
import { getAll } from "@/api/interface-group";

const editButton = (vm, h, currentRow, index) => {
  if (vm.buttonShow.edit) {
    return h(
      "Button",
      {
        props: {
          type: "primary",
        },
        style: {
          margin: "0 5px",
        },
        on: {
          click: () => {
            vm.formItem.id = currentRow.id;
            vm.formItem.api_class = currentRow.api_class;
            vm.formItem.info = currentRow.info;
            vm.formItem.method = currentRow.method;
            vm.formItem.hash = currentRow.hash;
            vm.formItem.group_hash = currentRow.group_hash;
            vm.formItem.access_token = currentRow.access_token;
            vm.formItem.is_test = currentRow.is_test;
            vm.formItem.hash_type = currentRow.hash_type;
            vm.formItem.app_group_hash = currentRow.app_group_hash; // 应用hash
            vm.formItem.app_group_id = currentRow.app_group_id;
            vm.formItem.des = currentRow.des;
            vm.modalSetting.show = true;
            vm.modalSetting.index = index;
          },
        },
      },
      vm.$t("edit_button")
    );
  }
};
const deleteButton = (vm, h, currentRow, index) => {
  if (vm.buttonShow.del) {
    return h(
      "Poptip",
      {
        props: {
          confirm: true,
          title: "您确定要删除这条数据吗? ",
          transfer: true,
        },
        on: {
          "on-ok": () => {
            del(currentRow.hash).then((response) => {
              currentRow.loading = false;
              vm.tableData.splice(index, 1);
              vm.$Message.success(response.data.msg);
            });
          },
        },
      },
      [
        h(
          "Button",
          {
            style: {
              margin: "0 5px",
            },
            props: {
              type: "error",
              placement: "top",
              loading: currentRow.isDeleting,
            },
          },
          vm.$t("delete_button")
        ),
      ]
    );
  }
};
const createButton = (vm, h, currentRow, index) => {
  /* eslint-disable */
  if (vm.buttonShow.create) {
    return h(
      "Poptip",
      {
        props: {
          confirm: true,
          title:
            "确认后将为您生成对应的方法代码模板，如果控制器不存在会为您生成对应的控制器，确定要继续吗? ",
          transfer: true,
        },
        on: {
          "on-ok": () => {
            console.log("currentRow: ", currentRow);
            let data = {
              id: currentRow.id,
              type: 1,
            };
            createFile(data).then((response) => {
              currentRow.loading = false;
              if (response.data.code === 1) {
                vm.$Message.success(response.data.msg);
              } else {
                vm.$Message.warning(response.data.msg);
              }
            });
          },
        },
      },
      [
        h(
          "Button",
          {
            style: {
              margin: "0 5px",
            },
            props: {
              type: "success",
              placement: "top",
              loading: currentRow.isDeleting,
            },
          },
          vm.$t("create_file")
        ),
      ]
    );
  }
};
const requestButton = (vm, h, currentRow, index) => {
  if (vm.buttonShow.request) {
    return h(
      "Button",
      {
        style: {
          margin: "0 5px",
        },
        props: {
          type: "info",
          placement: "top",
          loading: currentRow.isDeleting,
        },
        on: {
          click: () => {
            let hash = currentRow.hash;
            vm.$router.push({
              path: `request/${hash}`,
            });
          },
        },
      },
      "请求参数"
    );
  }
};
const responseButton = (vm, h, currentRow, index) => {
  if (vm.buttonShow.response) {
    return h(
      "Button",
      {
        style: {
          margin: "0 5px",
        },
        props: {
          type: "warning",
          placement: "top",
          loading: currentRow.isDeleting,
        },
        on: {
          click: () => {
            let hash = currentRow.hash;
            vm.$router.push({
              path: `response/${hash}`,
            });
          },
        },
      },
      "返回参数"
    );
  }
};

export default {
  name: "interface_list",
  data() {
    return {
      chooseAppModal: false,
      app_group_id: "",
      app_group_hash: "",
      app_url: "", // 要刷新的应用域名
      confirmRefresh: false,
      refreshLoading: false,
      columnsList: [
        {
          title: "序号",
          type: "index",
          width: 65,
          align: "center",
        },
        // {
        //   title: "应用名称",
        //   align: "center",
        //   minWidth: 190,
        //   key: "app_name",
        // },
        {
          title: "接口名称",
          align: "center",
          minWidth: 190,
          key: "info",
        },
        {
          title: "真实类库",
          align: "center",
          key: "api_class",
          width: 230,
        },
        {
          title: "接口说明",
          align: "center",
          key: "des",
          width: 140,
        },
        // {
        //   title: '接口映射',
        //   align: 'center',
        //   key: 'hash',
        //   width: 140
        // },
        // {
        //   title: "接口分组",
        //   align: "center",
        //   key: "group_name",
        //   minWidth: 140,
        // },
        {
          title: "请求方式",
          align: "center",
          width: 105,
          render: (h, params) => {
            if (params.row.isTest === 1) {
              return h(
                "tag",
                {
                  attrs: {
                    color: "error",
                  },
                },
                "测试"
              );
            } else {
              switch (params.row.method) {
                case 1:
                  return h(
                    "Tag",
                    {
                      attrs: {
                        color: "success",
                      },
                    },
                    "POST"
                  );
                case 2:
                  return h(
                    "Tag",
                    {
                      attrs: {
                        color: "primary",
                      },
                    },
                    "GET"
                  );
                case 3:
                  return h(
                    "Tag",
                    {
                      attrs: {
                        color: "green",
                      },
                    },
                    "PUT"
                  );
                case 4:
                  return h(
                    "Tag",
                    {
                      attrs: {
                        color: "error",
                      },
                    },
                    "DELETE"
                  );
                case 5:
                  return h(
                    "Tag",
                    {
                      attrs: {
                        color: "gold",
                      },
                    },
                    "PATCH"
                  );
                // case 5:
                // return h('Tag', {
                //   attrs: {
                //     color: 'blue'
                //   }
                // }, 'PATCH')
                case 0:
                  return h(
                    "Tag",
                    {
                      attrs: {
                        color: "warning",
                      },
                    },
                    "不限"
                  );
              }
            }
          },
        },
        // {
        //   title: "接口状态",
        //   align: "center",
        //   width: 130,
        //   render: (h, params) => {
        //     let vm = this;
        //     return h(
        //       "i-switch",
        //       {
        //         attrs: {
        //           size: "large",
        //         },
        //         props: {
        //           "true-value": 1,
        //           "false-value": 0,
        //           value: params.row.status,
        //           disabled: !vm.buttonShow.changeStatus,
        //         },
        //         on: {
        //           "on-change": function (status) {
        //             changeStatus(status, params.row.hash).then((response) => {
        //               vm.$Message.success(response.data.msg);
        //               vm.getList();
        //             });
        //           },
        //         },
        //       },
        //       [
        //         h(
        //           "span",
        //           {
        //             slot: "open",
        //           },
        //           vm.$t("open_choose")
        //         ),
        //         h(
        //           "span",
        //           {
        //             slot: "close",
        //           },
        //           vm.$t("close_choose")
        //         ),
        //       ]
        //     );
        //   },
        // },
        {
          title: "操作",
          align: "center",
          minWidth: 220,
          render: (h, params) => {
            return h("div", [
              // createButton(this, h, params.row, params.index),
              // editButton(this, h, params.row, params.index),
              requestButton(this, h, params.row, params.index),
              responseButton(this, h, params.row, params.index),
              // deleteButton(this, h, params.row, params.index),
            ]);
          },
        },
      ],
      tableData: [],
      apiGroup: [],
      typeGroup: [
        {
          name: "Base（有验证）",
          value: 1,
        },
        {
          name: "其他（无验证类）",
          value: 2,
        },
      ],
      tableShow: {
        currentPage: 1,
        pageSize: 40,
        listCount: 0,
      },
      searchConf: {
        type: "",
        keywords: "",
        status: "",
        group_hash: "",
        app_group_id: "",
        way_type: 1,
      },
      modalSetting: {
        show: false,
        loading: false,
        index: 0,
      },
      formItem: {
        api_class: "",
        info: "",
        des: "", //接口描述
        group_hash: "default",
        method: 2,
        hash_type: 2,
        hash: "",
        access_token: 0,
        is_test: 0,
        id: 0,
        app_group_hash: "", // 应用hash
        app_group_id: "", // 应用id
      },
      ruleValidate: {
        api_class: [
          { required: true, message: "真实类库不能为空", trigger: "blur" },
        ],
        des: [{ required: true, message: "接口说明不能为空", trigger: "blur" }],
        info: [
          { required: true, message: "接口名称不能为空", trigger: "blur" },
        ],
        app_group_hash: [
          { required: true, message: "应用不能为空", trigger: "blur" },
        ],
      },
      buttonShow: {
        edit: true,
        request: true,
        response: true,
        del: true,
        create: true,
        changeStatus: true,
      },
      listLoading: false,
      appList: [],
      appGroupList: [],
    };
  },
  created() {
    let vm = this;
    vm.getList();
    vm.hasRule("InterfaceList/edit").then((res) => {
      vm.buttonShow.edit = res;
    });
    vm.hasRule("InterfaceList/del").then((res) => {
      vm.buttonShow.del = res;
    });
    vm.hasRule("InterfaceList/changeStatus").then((res) => {
      vm.buttonShow.changeStatus = res;
    });
    vm.hasRule("Fields/response").then((res) => {
      vm.buttonShow.response = res;
    });
    vm.hasRule("Fields/request").then((res) => {
      vm.buttonShow.request = res;
    });
    getAll().then((response) => {
      vm.apiGroup = response.data.data.list;
    });
    getAppList().then((response) => {
      vm.appList = response.data.data;
    });
  },
  activated() {
    let vm = this;
    vm.getList();
    getAll().then((response) => {
      vm.apiGroup = response.data.data.list;
    });
    getAppList().then((response) => {
      vm.appList = response.data.data;
    });
  },
  methods: {
    // 选择应用
    handleAppChange(item) {
      console.log(item);
      let vm = this;
      vm.formItem.app_group_hash = item.app_group;
      vm.formItem.app_group_id = item.id;
    },
    // 展示刷新路由选择应用分组
    handleShowChooseApp() {
      let vm = this;
      getAppList().then((response) => {
        vm.appGroupList = response.data.data;
        vm.chooseAppModal = true;
      });
    },
    // 选择的要刷新的应用
    handleRefreshAppChange(item) {
      let vm = this;
      vm.app_group_id = item.id;
      vm.app_group_hash = item.app_group;
      vm.app_url = item.app_url + "/admin/";
    },
    confirmApp() {
      let vm = this;
      vm.chooseAppModal = false;
      vm.confirmRefresh = true;
    },
    alertAdd() {
      let vm = this;
      getHash().then((response) => {
        vm.formItem.hash = response.data.data.hash;
      });
      vm.modalSetting.show = true;
    },
    submit() {
      let vm = this;
      this.$refs["myForm"].validate((valid) => {
        if (valid) {
          vm.modalSetting.loading = true;
          if (vm.formItem.id === 0) {
            add(vm.formItem)
              .then((response) => {
                vm.modalSetting.loading = false;
                vm.$Message.success(response.data.msg);
                vm.getList();
                vm.cancel();
              })
              .catch(() => {
                vm.modalSetting.loading = false;
              });
          } else {
            edit(vm.formItem)
              .then((response) => {
                vm.modalSetting.loading = false;
                vm.$Message.success(response.data.msg);
                vm.getList();
                vm.cancel();
              })
              .catch(() => {
                vm.modalSetting.loading = false;
              });
          }
        }
      });
    },
    cancel() {
      this.modalSetting.show = false;
    },
    changePage(page) {
      this.tableShow.currentPage = page;
      this.getList();
    },
    changeSize(size) {
      this.tableShow.pageSize = size;
      this.getList();
    },
    search() {
      this.tableShow.currentPage = 1;
      this.getList();
    },
    getList() {
      let vm = this;
      vm.listLoading = true;
      getList({
        page: vm.tableShow.currentPage,
        size: vm.tableShow.pageSize,
        type: vm.searchConf.type,
        keywords: vm.searchConf.keywords,
        status: vm.searchConf.status,
        group_hash: vm.searchConf.group_hash,
        app_group_id: vm.searchConf.app_group_id,
      }).then((response) => {
        vm.tableData = response.data.data.list;
        vm.tableShow.listCount = response.data.data.count;
        vm.listLoading = false;
      });
    },
    doCancel(data) {
      if (!data) {
        this.formItem.id = 0;
        this.$refs["myForm"].resetFields();
        this.modalSetting.loading = false;
        this.modalSetting.index = 0;
      }
    },
    refreshRoute() {
      let vm = this;
      vm.refreshLoading = true;
      refresh(vm.app_url, {
        app_group_hash: vm.app_group_hash,
      })
        .then((response) => {
          vm.$Message.success(response.data.msg);
          vm.confirmRefresh = false;
          vm.refreshLoading = false;
        })
        .catch(() => {
          vm.confirmRefresh = false;
          vm.refreshLoading = false;
        });
    },
  },
};
</script>
