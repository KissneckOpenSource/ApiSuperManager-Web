<template>
  <div class="database">
    <Split v-model="split1">
      <div slot="left" class="left-split-pane">
        <Tree :data="data5" class="demo-tree-render" :load-data="loadData" expand-node select-node></Tree>
      </div>
      <div slot="right" class="demo-split-pane">
        <Split v-model="split2">
          <div slot="left" class="middle-split-pane">
            <Tabs value="name1">
              <TabPane label="数据库" name="name1">
                <Table :columns="columns8" :data="data7" size="small" ref="table" :border="true" style="height: 100%">
                  <template slot-scope="{ row }" slot="flag_table">
                    <strong>{{ row.flag_table == 1? '是':'否' }}</strong>
                  </template>
                </Table>
              </TabPane>
              <TabPane label="表" name="name2">标签二的内容</TabPane>
            </Tabs>
          </div>
          <div slot="right" class="right-split-pane">
            <div>【此功能暂未做】</div>
            <div>CREATE TABLE `admin_app` (</div>
            <div class="intent-20">`id` int(11) NOT NULL AUTO_INCREMENT,</div>
            <div class="intent-20">`app_id` varchar(50) NOT NULL DEFAULT '' COMMENT '应用id',</div>
            <div class="intent-20">`app_secret` varchar(50) NOT NULL DEFAULT '' COMMENT '应用密码',</div>
            <div class="intent-20">`app_name` varchar(50) NOT NULL DEFAULT '' COMMENT '应用名称',</div>
            <div class="intent-20">`app_status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '应用状态：0表示禁用，1表示启用',</div>
            <div class="intent-20">`app_info` text COMMENT '应用说明',</div>
            <div class="intent-20">`app_api` text COMMENT '当前应用允许请求的全部API接口',</div>
            <div class="intent-20">`app_group` varchar(128) NOT NULL DEFAULT 'default' COMMENT '当前应用所属的应用组唯一标识',</div>
            <div class="intent-20">`app_add_time` int(11) NOT NULL DEFAULT '0' COMMENT '应用创建时间',</div>
            <div class="intent-20">`app_api_show` text COMMENT '前台样式显示所需数据格式',</div>
            <div class="intent-20">`app_url` varchar(255) DEFAULT '' COMMENT '应用域名',</div>
            <div class="intent-20">`app_git_path` varchar(1000) DEFAULT NULL COMMENT '应用仓库git ssh克隆地址',</div>
            <div class="intent-20">`orgin_id` varchar(32) DEFAULT '' COMMENT 'API平台ID唯一编码',</div>
            <div class="intent-20">`copy_path` varchar(5000) DEFAULT NULL COMMENT '副本项目文件路径',</div>
            <div class="intent-20">PRIMARY KEY (`id`) USING BTREE,</div>
            <div class="intent-20">UNIQUE KEY `app_id` (`app_id`) USING BTREE</div>
            <div>) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC
              COMMENT='appId和appSecret表';</div>
          </div>
        </Split>
      </div>
    </Split>
    <Dropdown trigger="contextMenu" style="margin-left:20px" placement="right-start" ref="contextMenu"
      @click="changeChoose">
      <DropdownMenu slot="list">
        <!-- 可待平台 -->
        <DropdownItem name="addPoint" @click.native="handleAppend" v-if="menuMod == 1">
          <span>新建数据库</span>
        </DropdownItem>
        <!-- DATABASE -->
        <DropdownItem name="addPoint" @click.native="editDatabase" v-if="menuMod == 2">
          <span>编辑数据库</span>
        </DropdownItem>
        <DropdownItem name="addPoint" @click.native="delDatabase" v-if="menuMod == 2">
          <span>删除数据库</span>
        </DropdownItem>
        <DropdownItem name="addPoint" @click.native="handleAppend" v-if="menuMod == 2">
          <span>新建表</span>
        </DropdownItem>
        <DropdownItem name="addPoint" @click.native="handleLevelTwoRefresh" v-if="menuMod == 2">
          <span>刷新</span>
        </DropdownItem>
        <DropdownItem name="addPoint" @click.native="handleAppend" v-if="menuMod == 2">
          <span>创建实体库（开发中）</span>
        </DropdownItem>
        <!-- TABLE -->
        <DropdownItem name="addPoint" @click.native="" v-if="menuMod == 3">
          <span>打开表</span>
        </DropdownItem>
        <DropdownItem name="addPoint" @click.native="editTable" v-if="menuMod == 3">
          <span>设计表</span>
        </DropdownItem>
        <DropdownItem name="addPoint" @click.native="handleAppend" v-if="menuMod == 3">
          <span>删除表</span>
        </DropdownItem>
        <DropdownItem name="addPoint" @click.native="handleAppend" v-if="menuMod == 3">
          <span>清空表（开发中）</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <!-- 添加数据库模型弹窗 -->
    <Modal v-model="showAddDatabase" :title="EditDatabase?'编辑数据库模型':'添加数据库模型'" :loading="addDatabaseLoading"
      :closable="false" :mask-closable="false">
      <Form ref="addDatabaseForm" :model="databaseTemp" :label-width="80" :rules="addDatabaseRules">
        <FormItem label="应用ID" prop="app_id">
          <Input v-model="databaseTemp.app_id" placeholder="请输入应用ID"></Input>
        </FormItem>
        <FormItem label="名称" prop="name">
          <Input v-model="databaseTemp.name" placeholder="请输入数据库名称"></Input>
        </FormItem>
        <FormItem label="IP" prop="ip">
          <Input v-model="databaseTemp.ip" placeholder="请输入数据库连接IP或地址"></Input>
        </FormItem>
        <FormItem label="账号" prop="account">
          <Input v-model="databaseTemp.account" placeholder="请输入数据库连接账号"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input v-model="databaseTemp.password" placeholder="请输入数据库连接密码" type="password"></Input>
        </FormItem>
        <FormItem label="端口" prop="c_port">
          <Input v-model="databaseTemp.c_port" placeholder="请输入数据库连接端口"></Input>
        </FormItem>
        <FormItem label="备注" prop="info">
          <Input v-model="databaseTemp.info" type="textarea" placeholder="请输入数据库备注"></Input>
        </FormItem>
      </Form>
      <div slot="footer" v-if="EditDatabase">
        <Button type="text" size="large" @click="editDatabaseCancel">取消</Button>
        <Button type="primary" size="large" @click="editDatabaseConfirm">确定</Button>
      </div>
      <div slot="footer" v-else>
        <Button type="text" size="large" @click="addDatabaseCancel">取消</Button>
        <Button type="primary" size="large" @click="addDatabaseConfirm">确定</Button>
      </div>
    </Modal>
    <!-- 添加数据表弹窗 -->
    <Modal v-model="showAddTable" :title="EditTable?'设计表':'添加表'" :loading="addTableLoading" :closable="false"
      :mask-closable="false">
      <Form ref="addTableForm" :model="TableTemp" :label-width="80" :rules="addTableRules">
        <FormItem label="应用ID" prop="app_id">
          <Input v-model="TableTemp.app_id" placeholder="请输入应用ID" :disabled="true"></Input>
        </FormItem>
        <FormItem label="表名" prop="name_code">
          <Input v-model="TableTemp.name_code" placeholder="请输入表名"></Input>
        </FormItem>
        <FormItem label="中文别名" prop="name">
          <Input v-model="TableTemp.name" placeholder="请输入中文别名"></Input>
        </FormItem>
        <FormItem label="编码" prop="d_orgin_id">
          <Input v-model="TableTemp.d_orgin_id" placeholder="请输入编码" :disabled="true"></Input>
        </FormItem>
        <FormItem label="注释" prop="c_comment">
          <Input v-model="TableTemp.c_comment" placeholder="请输入注释"></Input>
        </FormItem>
        <FormItem label="编码" prop="c_charset">
          <RadioGroup v-model="TableTemp.c_charset">
            <Radio label="utf8">utf8</Radio>
            <Radio label="utf8mb4">utf8mb4</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="排序方式" prop="c_collation">
          <RadioGroup v-model="TableTemp.c_collation">
            <Radio label="utf8_general_ci">utf8_general_ci</Radio>
            <Radio label="utf8mb4_general_ci">utf8mb4_general_ci</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="搜索引擎" prop="c_engine">
          <RadioGroup v-model="TableTemp.c_engine">
            <Radio label="MyISAM">MyISAM</Radio>
            <Radio label="InnoDB">InnoDB</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="addTabelCancel">取消</Button>
        <Button type="primary" size="large" @click="addTableConfirm">确定</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
import databaseTools from "@/api/database";
export default {
  data() {
    return {
      addTableRules: {
        app_id: [
          {
            required: true,
            message: "应用ID不能为空",
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: "中文别名不能为空",
            trigger: "blur",
          },
        ],
        name_code: [
          {
            required: true,
            message: "表名不能为空",
            trigger: "blur",
          },
        ],
        c_comment: [
          {
            required: true,
            message: "注释不能为空",
            trigger: "blur",
          },
        ],
        c_charset: [
          {
            required: true,
            message: "编码不能为空",
            trigger: "blur",
          },
        ],
        c_collation: [
          {
            required: true,
            message: "排序方式不能为空",
            trigger: "blur",
          },
        ],
        c_engine: [
          {
            required: true,
            message: "搜索引擎不能为空",
            trigger: "blur",
          },
        ],
      },
      TableTemp: {},
      showAddTable: false,
      addTableLoading: true,
      showAddDatabase: false,
      databaseTemp: {
        app_id: undefined,
        name: undefined,
        ip: undefined,
        account: undefined,
        password: undefined,
        c_port: undefined,
        info: undefined,
      },
      addDatabaseLoading: true,
      addDatabaseRules: {
        app_id: [
          {
            required: true,
            message: "应用ID不能为空",
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: "数据库名称不能为空",
            trigger: "blur",
          },
        ],
        ip: [
          {
            required: true,
            message: "数据库连接IP或地址不能为空",
            trigger: "blur",
          },
        ],
        account: [
          {
            required: true,
            message: "数据库连接账号不能为空",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "数据库连接密码不能为空",
            trigger: "blur",
          },
        ],
        c_port: [
          {
            required: true,
            message: "数据库连接端口不能为空",
            trigger: "blur",
          },
        ],
        info: [
          {
            required: true,
            message: "数据库备注不能为空",
            trigger: "blur",
          },
        ],
      },
      split2: 0.7,
      menuMod: 1, // 1为库 2为表
      onEvent: {},
      data5: [
        {
          title: "业务平台",
          loading: false,
          level: 1,
          render: (h, { root, node, data }) => {
            return (
              <span
                style={{ display: "inline-block", width: "100%" }}
                onContextmenu={($event) =>
                  this.onContextmenu($event, this, 1, data)
                }
              >
                <span>
                  <Icon props={{ type: "md-laptop" }}></Icon>
                  <span style={{ marginLeft: "6px" }}>{data.title}</span>
                </span>
              </span>
            );
          },
          children: [],
        },
      ],
      columns8: [
        {
          title: "表名",
          key: "name_code",
          tooltip: true,
          resizable: true,
          width: 150,
        },
        {
          title: "中文别名",
          key: "name",
          tooltip: true,
          resizable: true,
          width: 150,
        },
        {
          title: "是否创建实体库",
          key: "flag_table",
          slot: "flag_table",
          tooltip: true,
          resizable: true,
          width: 150,
        },
        {
          title: "引擎",
          key: "c_engine",
          tooltip: true,
          resizable: true,
          width: 150,
        },
        {
          title: "字符集",
          key: "c_charset",
          tooltip: true,
          resizable: true,
          width: 150,
        },
        {
          title: "排序规则",
          key: "c_collation",
          tooltip: true,
          resizable: true,
          width: 150,
        },
        {
          title: "注释",
          key: "c_comment",
          tooltip: true,
          resizable: true,
        },
      ],
      data7: [],
      buttonProps: {
        type: "default",
        size: "small",
      },
      split1: 0.2,
      onData: {},
      singleClickTimer: 0,
      EditDatabase: false,
      EditTable: false,
      columns: [],
    };
  },
  created() {},
  methods: {
    // 删除数据库
    delDatabase() {
      this.$Modal.confirm({
        title: "提示",
        content: `真的要删除【${this.onData.name}】吗？`,
        onOk: () => {
          let index = this.data5[0].children.findIndex(
            (e) => e.id == this.onData.id
          );
          databaseTools.delDatabase(this.onData).then((res) => {
            if (res.data.code) {
              this.data5[0].children.splice(index, 1);
              console.log("after remove", this.data5);
              this.$Message.success(res.data.msg);
            } else {
              this.$Message.error(res.data.msg);
            }
          });
        },
        onCancel: () => {},
      });
    },
    // 编辑数据库
    editDatabase() {
      Object.assign(this.databaseTemp, this.onData);
      this.showAddDatabase = true;
      this.EditDatabase = true;
    },
    // 编辑表
    editTable() {
      Object.assign(this.TableTemp, this.onData);
      this.showAddTable = true;
      this.EditTable = true;
    },
    // 编辑数据库模型取消
    editDatabaseCancel() {
      this.$Modal.confirm({
        title: "提示",
        content: "您所作修改都不会被保存，确定要离开吗？",
        onOk: () => {
          this.showAddDatabase = false;
          this.$refs["addDatabaseForm"].resetFields();
        },
        onCancel: () => {},
      });
    },
    // 编辑数据库模型确认
    editDatabaseConfirm() {
      console.log("确认修改", this.onData);
      this.$refs["addDatabaseForm"].validate((valid) => {
        if (valid) {
          this.addDatabaseLoading = false;
          databaseTools.editDatabase(this.databaseTemp).then((res) => {
            if (res.data.code == 1) {
              let index = this.data5[0].children.findIndex(
                (e) => e.id == this.onData.id
              );
              this.databaseTemp.title = this.databaseTemp.name;
              Object.assign(this.onData, this.databaseTemp);
              this.$Message.success("修改成功!");
              this.showAddDatabase = false;
              this.$refs["addDatabaseForm"].resetFields(); //重置表单
            } else {
              this.$Message.error(res.data.data.msg);
              setTimeout(() => {
                this.addDatabaseLoading = false;
                this.$nextTick(() => {
                  this.addDatabaseLoading = true;
                });
              });
            }
          });
        } else {
          this.$Message.error("Fail!");
          setTimeout(() => {
            this.addDatabaseLoading = false;
            this.$nextTick(() => {
              this.addDatabaseLoading = true;
            });
          });
        }
      });
    },
    // 数据表添加确认
    addTableConfirm() {
      this.$refs["addTableForm"].validate((valid) => {
        if (valid) {
          this.addTableLoading = false;
          databaseTools.createTable(this.TableTemp).then((res) => {
            if (res.data.code == 1) {
              this.append(
                this.onData,
                Object.assign({}, this.TableTemp, res.data.data)
              );
              this.$Message.success("Success!");
              this.showAddTable = false;
              this.$refs["addTableForm"].resetFields(); //重置表单
            } else {
              this.$Message.error(res.data.data.msg);
              setTimeout(() => {
                this.addTableLoading = false;
                this.$nextTick(() => {
                  this.addTableLoading = true;
                });
              });
            }
          });
        } else {
          this.$Message.error("Fail!");
          setTimeout(() => {
            this.addTableLoading = false;
            this.$nextTick(() => {
              this.addTableLoading = true;
            });
          });
        }
      });
    },
    // 数据表添加取消
    addTabelCancel() {
      this.$Modal.confirm({
        title: "提示",
        content: "您所作修改都不会被保存，确定要离开吗？",
        onOk: () => {
          this.showAddTable = false;
          this.$refs["addTableForm"].resetFields();
        },
        onCancel: () => {},
      });
    },
    // 数据库节点更新
    handleLevelTwoRefresh() {
      // onData => 当前需要刷新的
      console.log("刷新二级", this.onData);
      this.onData.loading = true;
      let callbackData = [];
      databaseTools
        .getTableList({
          size: 9999,
          page: 1,
          d_orgin_id: this.onData.orgin_id,
        })
        .then((res) => {
          if (res.status != 200 || res.data.code != 1) {
            // 异常
            this.$Message.error(
              "fatal error occurred on loadData(),something is go wrong!"
            );
            item.loading = false;
          } else if (res.data.data.list.length == 0) {
            // 异常
            this.$Message.warning("该数据库下没有表，请先创建~");
            item.loading = false;
          } else {
            let arr = res.data.data.list;
            callbackData = arr.map((e) => {
              return {
                title: e.name_code,
                c_charset: e.c_charset,
                c_collation: e.c_collation,
                c_comment: e.c_comment,
                c_engine: e.c_engine,
                flag_table: e.flag_table,
                id: e.id,
                name: e.name,
                name_code: e.name_code,
                level: 3,
                render: (h, { root, node, data }) => {
                  return (
                    <span
                      style={{ display: "inline-block", width: "100%" }}
                      onContextmenu={($event) =>
                        this.onContextmenu($event, this, 3, data, root, node)
                      }
                    >
                      <span>
                        <Icon
                          style={{ marginRight: "6px" }}
                          props={{ type: "md-list-box" }}
                        ></Icon>
                        <span>{data.title}</span>
                      </span>
                    </span>
                  );
                },
              };
            });
            this.data7 = callbackData;
          }
          this.onData.loading = false;
          let index = this.data5[0].children.findIndex(
            (e) => e.id == this.onData.id
          );
          this.data5[0].children[index].children = callbackData;
        });
    },
    // 添加数据库模型取消
    addDatabaseCancel() {
      this.$Modal.confirm({
        title: "提示",
        content: "您所作修改都不会被保存，确定要离开吗？",
        onOk: () => {
          this.showAddDatabase = false;
          this.$refs["addDatabaseForm"].resetFields();
        },
        onCancel: () => {},
      });
    },
    // 添加数据库模型确认
    addDatabaseConfirm() {
      this.$refs["addDatabaseForm"].validate((valid) => {
        if (valid) {
          this.addDatabaseLoading = false;
          databaseTools.createDatabase(this.databaseTemp).then((res) => {
            if (res.data.code == 1) {
              this.append(
                this.onData,
                Object.assign({}, this.databaseTemp, res.data.data)
              );
              this.$Message.success("Success!");
              this.showAddDatabase = false;
              this.$refs["addDatabaseForm"].resetFields(); //重置表单
            } else {
              this.$Message.error(res.data.data.msg);
              setTimeout(() => {
                this.addDatabaseLoading = false;
                this.$nextTick(() => {
                  this.addDatabaseLoading = true;
                });
              });
            }
          });
        } else {
          this.$Message.error("Fail!");
          setTimeout(() => {
            this.addDatabaseLoading = false;
            this.$nextTick(() => {
              this.addDatabaseLoading = true;
            });
          });
        }
      });
    },
    // 树上三级元素点击
    handleLevelThreeClick($event, item, that, root, node) {
      console.log("树上三级元素点击", $event, root, node);
      clearTimeout(that.singleClickTimer);
      that.singleClickTimer = setTimeout(() => {
        that.threeClickNext(item, that, node);
      }, 200);
    },
    threeClickNext(item, that, node) {
      console.log("threeClickNext", item);
      let index = that.data5[0].children.findIndex(
        (e) => e.nodeKey == node.parent
      );
      console.log("index", index);
      that.data7 = that.data5[0].children[index].children;
      databaseTools
        .getProperty({
          size: 999,
          page: 1,
          app_id: that.data5[0].children[index].app_id,
          o_orgin_id: item.orgin_id,
        })
        .then((res) => {
          if (res.data.code == 1 && res.data.data.count > 0) {
            this.columns = res.data.data.list;
          } else {
            this.$Message.warning("暂无字段，请创建~");
            this.columns = [];
          }
        });
    },
    // 树上二级元素点击
    handleClick($event, item, that) {
      clearTimeout(that.singleClickTimer);
      that.singleClickTimer = setTimeout(() => {
        that.handleSingleClick(item, that);
      }, 200);
    },
    handleSingleClick(item, that) {
      console.log("单击", item);
      if (item.expand == true) {
        // 未展开 => 展开
        that.data7 = item.children;
      } else {
        // 展开 => 未展开
        that.data7 = [];
      }
    },
    handleDblclick($event, item, that) {
      clearTimeout(that.singleClickTimer);
      console.log("鼠标左键双击", item);
    },
    // 异步加载树
    loadData(item, callback) {
      console.log("loadData", item);
      let callbackData = [];
      if (item.level === 1) {
        databaseTools.getDatabaseList().then((res) => {
          if (res.status != 200 || res.data.code != 1) {
            // 异常
            this.$Message.error(
              "fatal error occurred on loadData(),something is go wrong!"
            );
          } else if (res.data.data.list.length == 0) {
            // 异常
            this.$Message.error(
              "fatal error occurred on loadData(),cannot find any database!"
            );
          } else {
            let arr = res.data.data.list;
            callbackData = arr.map((e) => {
              return {
                title: e.name,
                account: e.account,
                app_id: e.app_id,
                create_time: e.create_time,
                id: e.id,
                info: e.info,
                ip: e.ip,
                name: e.name,
                orgin_id: e.orgin_id,
                level: 2,
                children: [],
                loading: false,
                password: e.password,
                c_port: e.c_port,
                render: (h, { root, node, data }) => {
                  return (
                    <span
                      style={{ display: "inline-block", width: "100%" }}
                      onClick={($event) =>
                        this.handleClick($event, data, this, root, node)
                      }
                      onDblclick={($event) =>
                        this.handleDblclick($event, data, this, root, node)
                      }
                      onContextmenu={($event) =>
                        this.onContextmenu($event, this, 2, data, root, node)
                      }
                    >
                      <span>
                        <Icon
                          style={{ marginRight: "6px" }}
                          props={{ type: "logo-buffer" }}
                        ></Icon>
                        <span>{data.title}</span>
                      </span>
                    </span>
                  );
                },
              };
            });
            callback(callbackData);
          }
        });
      }
      if (item.level === 2) {
        if (!item.orgin_id) {
          this.$Message.error(
            "fatal error occurred on loadData(),orgin_id is missing!"
          );
          item.loading = false;
          return;
        }
        databaseTools
          .getTableList({
            size: 9999,
            page: 1,
            d_orgin_id: item.orgin_id,
          })
          .then((res) => {
            if (res.status != 200 || res.data.code != 1) {
              // 异常
              this.$Message.error(
                "fatal error occurred on loadData(),something is go wrong!"
              );
              item.loading = false;
            } else if (res.data.data.list.length == 0) {
              // 异常
              this.$Message.warning("该数据库下没有表，请先创建~");
              item.loading = false;
            } else {
              let arr = res.data.data.list;
              callbackData = arr.map((e) => {
                return {
                  title: e.name_code,
                  c_charset: e.c_charset,
                  c_collation: e.c_collation,
                  c_comment: e.c_comment,
                  c_engine: e.c_engine,
                  flag_table: e.flag_table,
                  id: e.id,
                  name: e.name,
                  name_code: e.name_code,
                  orgin_id: e.orgin_id,
                  level: 3,
                  render: (h, { root, node, data }) => {
                    return (
                      <span
                        style={{ display: "inline-block", width: "100%" }}
                        onContextmenu={($event) =>
                          this.onContextmenu($event, this, 3, data)
                        }
                        onClick={($event) =>
                          this.handleLevelThreeClick(
                            $event,
                            data,
                            this,
                            root,
                            node
                          )
                        }
                      >
                        <span>
                          <Icon
                            style={{ marginRight: "6px" }}
                            props={{ type: "md-list-box" }}
                          ></Icon>
                          <span>{data.title}</span>
                        </span>
                      </span>
                    );
                  },
                };
              });
              this.data7 = callbackData;
              callback(callbackData);
            }
          });
      }
    },
    changeChoose(e) {
      console.log("changeChoose", e);
    },
    onContextmenu(e, that, menuMod, data) {
      that.menuMod = menuMod;
      that.onEvent = e;
      that.onData = data;
      console.log("onContextmenu", data);
      e.preventDefault();
      var dom = document.getElementsByClassName("ivu-select-dropdown");
      // console.log("dom", dom);
      dom[1].style.top =
        e.clientY + 125 > window.innerHeight
          ? `${window.innerHeight - 127}px`
          : `${e.clientY}px`;
      dom[1].style.left = `${e.clientX + 20}px`;
      // console.log("top-left", `${dom[1].style.top}-${dom[1].style.left}`);
      that.$refs.contextMenu.$refs.reference = e.target; //目的是让菜单栏显示在点击位置的附近
      that.$refs.contextMenu.currentVisible = true;
    },
    append(data, obj = {}) {
      console.log("data", data);
      console.log("obj", obj);
      const children = data.children || [];
      if (data.level == 1) {
        Object.assign(obj, {
          title: obj.name,
          expand: false,
          loading: false,
          children: [],
          level: 2,
        });
      }
      if (data.level == 2) {
        Object.assign(obj, {
          title: obj.name || "吔？",
          expand: false,
          level: 3,
        });
      }
      switch (true) {
        case this.menuMod == 1:
          obj.render = (h, { root, node, data }) => {
            return (
              <span
                style={{ display: "inline-block", width: "100%" }}
                onContextmenu={($event) =>
                  this.onContextmenu($event, this, 2, data, root, node)
                }
                onClick={($event) =>
                  this.handleClick($event, data, this, root, node)
                }
                onDblclick={($event) =>
                  this.handleDblclick($event, data, this, root, node)
                }
              >
                <span>
                  <Icon
                    style={{ marginRight: "6px" }}
                    props={{ type: "logo-buffer" }}
                  ></Icon>
                  <span>{data.title}</span>
                </span>
              </span>
            );
          };
          break;
        case this.menuMod == 2:
          obj.title = "表" + new Date().getTime();
          obj.render = (h, { root, node, data }) => {
            return (
              <span
                style={{ display: "inline-block", width: "100%" }}
                onContextmenu={($event) =>
                  this.onContextmenu($event, this, 3, data, root, node)
                }
                onClick={($event) =>
                  this.handleLevelThreeClick($event, data, this, root, node)
                }
              >
                <span>
                  <Icon
                    style={{ marginRight: "6px" }}
                    props={{ type: "ios-list-box" }}
                  ></Icon>
                  <span>{data.title}</span>
                </span>
              </span>
            );
          };
          this.handleLevelTwoRefresh();
          break;
        default:
          return;
          break;
      }
      children.push(obj);
      this.$set(data, "children", children);
    },
    // 添加数据库 数据表
    handleAppend() {
      console.log("添加数据库 数据表", this.onData);
      if (this.onData.level == 1) {
        // 添加数据库
        if (!this.onData.expand) {
          this.$Message.error("请展开该项后再操作！");
          return;
        }
        this.showAddDatabase = true;
        return;
      }
      if (this.onData.level == 2) {
        this.showAddTable = true;
        this.TableTemp.app_id = this.onData.app_id;
        this.TableTemp.d_orgin_id = this.onData.orgin_id;
      }
    },
    remove(root, node, data) {
      const parentKey = root.find((el) => el === node).parent;
      const parent = root.find((el) => el.nodeKey === parentKey).node;
      const index = parent.children.indexOf(data);
      parent.children.splice(index, 1);
    },
  },
};
</script>

<style lang="less" scoped>
.intent-20 {
  text-indent: 20px;
}
.intent-10 {
  text-indent: 10px;
}
.right-split-pane {
  padding: 10px 10px;
}
/deep/.ivu-table-body.ivu-table-overflowX {
  height: 1026px;
}
/deep/.ivu-table-tip {
  height: 1026px;
}
.demo-split-pane {
  height: 1080px;
}
.whole {
  width: 100%;
  height: 1080px;
  display: flex;
}
.database {
  width: 100%;
  height: calc(~"100vh - 122px");
  background-image: linear-gradient(
      90deg,
      rgba(180, 180, 180, 0.15) 10%,
      rgba(0, 0, 0, 0) 10%
    ),
    linear-gradient(rgba(180, 180, 180, 0.15) 10%, rgba(0, 0, 0, 0) 10%);
  background-size: 10px 10px;
}
</style>