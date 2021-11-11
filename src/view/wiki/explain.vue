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
          @node-click="treeclick"
          :filter-node-method="filterNode"
          :expand-on-click-node="false"
          ref="tree"
        >
        </el-tree>
      </div>
      <div style="width: 70%">
        <vue-markdown table-class="ss" v-if="kaiguan">{{ html }}</vue-markdown>
      </div>
    </div>
    <Footer class="wiki-footer-center"></Footer>
  </Layout>
</template>
<script>
import "./explain.less";
import { errorCode, logout, getDocMenu } from "@/api/wiki";
import { setToken } from "@/libs/util";
import VueMarkdown from "vue-markdown";
import html1 from "./112.md";
export default {
  name: "explain",
  created() {
    this.error();
  },
  components: {
    VueMarkdown,
  },
  data() {
    return {
      kaiguan: true,
      html: '文档展示',
      app_id: sessionStorage.getItem("ApiAdmin_AppInfo"),
      data: [],
      co: "",
      filterText: "",
      data1: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
    };
  },
  created() {
    let vm = this;
    vm.getDocMenu();
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
    treeclick(data) {
      this.kaiguan = false
      if (data.children) {
        console.log("zhe");
        this.html = '请选择正确的路由';
      } else {
        if (!data.md_path) {
          this.html = html1;
        } else {
          this.html = '请先创建该接口的文档';
        }
      }
      this.$nextTick(() =>{
        this.kaiguan = true
      })
    },
    getDocMenu() {
      let vm = this;
      getDocMenu().then((response) => {
        vm.data1 = response.data.data;
      });
    },
  },
};
</script>