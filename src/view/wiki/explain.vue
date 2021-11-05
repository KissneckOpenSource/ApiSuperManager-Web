<template>
  <Layout style="height: 100%">
    <Menu mode="horizontal" theme="dark" active-name="explain">
      <div class="wiki-logo"></div>
      <div class="wiki-nav">
        <MenuItem name="explain" to="/wiki/explain">
          <Icon type="md-list-box" />
          文档说明
        </MenuItem>
        <MenuItem name="list" to="/wiki/list">
          <Icon type="md-list-box" />
          接口列表
        </MenuItem>
        <MenuItem name="error" to="/wiki/error">
          <Icon type="logo-markdown" />
          错误码
        </MenuItem>
        <MenuItem name="calculation" to="/wiki/calculation">
          <Icon type="ios-analytics" />
          算法详解
        </MenuItem>
        <Submenu name="4">
          <template slot="title">
            <Icon type="ios-contact" />
            {{ app_id }}
          </template>
          <MenuItem name="4-1" @click.native="logout">
            <Icon type="md-exit" />
            用户登出
          </MenuItem>
        </Submenu>
      </div>
    </Menu>

    <div class="content">
      <div class="tree">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText"
          prefix-icon="el-icon-search"
        >
        </el-input>

        <el-tree
          class="filter-tree"
          :data="data1"
          :props="defaultProps"
          default-expand-all
          @node-click="treeclick"
          :filter-node-method="filterNode"
          :expand-on-click-node="false"
          ref="tree"
        >
        </el-tree>
      </div>
      <div v-html="html"></div>
    </div>
    <Footer class="wiki-footer-center"></Footer>
  </Layout>
</template>
<script>
import "./explain.less";
import { errorCode, logout } from "@/api/wiki";
import { setToken } from "@/libs/util";
// import readme from "./qw.md";
export default {
  name: "explain",
  created() {
    this.error();
  },
  data() {
    return {
      html: "",
      app_id: sessionStorage.getItem("ApiAdmin_AppInfo"),
      data: [],
      co: "",
      filterText: "",
      data1: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1",
                },
                {
                  id: 10,
                  label: "三级 1-1-2",
                },
              ],
            },
          ],
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1",
            },
            {
              id: 6,
              label: "二级 2-2",
            },
          ],
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1",
            },
            {
              id: 8,
              label: "二级 3-2",
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    logout() {
      let vm = this;
      logout().then((response) => {
        vm.$Message.success(response.data.msg);
        setToken("");
        sessionStorage.removeItem("ApiAdmin_AppInfo");
        vm.$router.push({
          name: "wiki_login",
        });
      });
    },
    error() {
      let vm = this;
      errorCode().then((response) => {
        vm.data = response.data.data.data;
        vm.co = response.data.data.co;
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    treeclick() {},
  },
};
</script>
