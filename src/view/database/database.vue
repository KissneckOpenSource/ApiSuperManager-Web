<template>
  <div class="database">
    <Split v-model="split1">
      <div slot="left" class="left-split-pane">
        <Tree :data="data5" class="demo-tree-render" :load-data="loadData" expand-node select-node></Tree>
      </div>
      <div slot="right" class="demo-split-pane">
        <Split v-model="split2">
          <div slot="left" class="middle-split-pane">
            <vxe-grid ref="xGrid2" v-bind="gridOptions2" max-height="100%" highlight-hover-row highlight-current-row
              border resizable show-overflow>
            </vxe-grid>
          </div>
          <div slot="right" class="right-split-pane" v-if="Object.keys(showTable).length > 0">
            <div>CREATE TABLE `{{showTable.title}}` (</div>
            <div class="intent-20" v-for="(obj,index) in rightContentArr" :key="index">{{obj.show_word}}</div>
            <!-- <div class="intent-20">PRIMARY KEY (`id`) USING BTREE,</div> -->
            <!-- <div class="intent-20">UNIQUE KEY `app_id` (`app_id`) USING BTREE</div> -->
            <div>) ENGINE={{showTable.c_engine}} 实体库={{showTable.flag_table == 1?'是':'否'}} DEFAULT
              CHARSET={{showTable.c_charset}} ROW_FORMAT=DYNAMIC
              COMMENT='{{showTable.c_comment}}';</div>
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
        <DropdownItem name="addPoint" @click.native="handleLevelOneRefresh" v-if="menuMod == 1">
          <span>关闭</span>
        </DropdownItem>
        <!-- DATABASE -->
        <DropdownItem name="addPoint" @click.native="handleAppendDatabase" v-if="menuMod == 2">
          <span>新建数据库</span>
        </DropdownItem>
        <DropdownItem name="addPoint" @click.native="handleAppend" v-if="menuMod == 2">
          <span>新建表</span>
        </DropdownItem>
        <DropdownItem name="addPoint" @click.native="editDatabase" v-if="menuMod == 2">
          <span>编辑数据库</span>
        </DropdownItem>
        <DropdownItem name="addPoint" @click.native="delDatabase" v-if="menuMod == 2">
          <span>删除数据库</span>
        </DropdownItem>
        <DropdownItem name="addPoint" @click.native="handleLevelTwoRefresh" v-if="menuMod == 2">
          <span>刷新</span>
        </DropdownItem>
        <DropdownItem name="addPoint" @click.native="" v-if="menuMod == 2">
          <span>创建实体库（开发中）</span>
        </DropdownItem>
        <!-- TABLE -->
        <DropdownItem name="addPoint" @click.native="" v-if="menuMod == 3">
          <span>打开表（开发中）</span>
        </DropdownItem>
        <DropdownItem name="addPoint" @click.native="editTable" v-if="menuMod == 3">
          <span>编辑表</span>
        </DropdownItem>
        <DropdownItem name="addPoint" @click.native="designTable" v-if="menuMod == 3">
          <span>设计表</span>
        </DropdownItem>
        <DropdownItem name="addPoint" @click.native="delTable" v-if="menuMod == 3">
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
        <!-- <FormItem label="应用ID" prop="app_id">
          <Input v-model="databaseTemp.app_id" placeholder="请输入应用ID"></Input>
        </FormItem> -->
        <FormItem label="应用" prop="app_id">
          <Select v-model="databaseTemp.app_id" style="width:200px" placeholder="请选择应用">
            <Option v-for="(v, i) in appList" :value="v.app_id" :kk="i" :key="v.id" @click.native="handleAppChange(v)">
              {{v.app_name}}</Option>
          </Select>
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
        <Button type="text" @click="editDatabaseCancel">取消</Button>
        <Button type="primary" @click="editDatabaseConfirm">确定</Button>
      </div>
      <div slot="footer" v-else>
        <Button type="text" @click="addDatabaseCancel">取消</Button>
        <Button type="primary" @click="addDatabaseConfirm">确定</Button>
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
        <FormItem label="DB编码" prop="d_orgin_id">
          <Input v-model="TableTemp.d_orgin_id" placeholder="请输入DB编码" :disabled="true"></Input>
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
      <div slot="footer" v-if="EditTable">
        <Button type="text" @click="addTabelCancel">取消</Button>
        <Button type="primary" @click="editTableConfirm(EditTable)">确定</Button>
      </div>
      <div slot="footer" v-else>
        <Button type="text" @click="addTabelCancel">取消</Button>
        <Button type="primary" @click="addTableConfirm(EditTable)">确定</Button>
      </div>
    </Modal>
    <Modal v-model="showDesignTable" title="设计表" width="1350" :closable="true" :mask-closable="false"
      :loading="designTableLoading" :mask="true">
      <vxe-grid ref="xGrid" v-bind="designTableOptions">
        <template #operate="{ row }">
          <template v-if="$refs.xGrid.isActiveByRow(row)">
            <vxe-button icon="fa fa-save" status="primary" title="保存" circle @click="saveRowEvent(row)"></vxe-button>
          </template>
          <template v-else>
            <vxe-button icon="fa fa-edit" title="编辑" circle @click="editRowEvent(row)"></vxe-button>
          </template>
          <vxe-button icon="fa fa-trash" title="删除" circle @click="removeRowEvent(row)"></vxe-button>
          <!-- <vxe-button icon="fa fa-eye" title="查看" circle></vxe-button> -->
          <!-- <vxe-button icon="fa fa-gear" title="设置" circle></vxe-button> -->
        </template>
      </vxe-grid>
      <div slot="footer">
        <!-- <Button type="text" @click="showDesignTable = false">取消</Button>
        <Button type="primary" @click="showDesignTable = false">保存</Button> -->
      </div>
    </Modal>
  </div>
</template>

<script>
import { getList as getAppList } from "@/api/app";
import Sortable from "sortablejs";
import databaseTools from "@/api/database";
export default {
  computed: {
    gridOptions2() {
      return {
        border: true,
        columnKey: true,
        class: "sortable-column-demo",
        scrollX: {
          enabled: false,
        },
        columns: [
          {
            title: "表名",
            field: "name_code",
            width: 150,
            slots: {
              // 使用 JSX 渲染
              default: ({ row }) => {
                return [
                  <div
                    onContextmenu={(e) => this.onContextmenu(e, this, 3, row)}
                    onClick={(e) => this.handleLevelThreeClick(e, row, this)}
                    class="myRow"
                  >
                    {row.name_code}
                  </div>,
                ];
              },
            },
          },
          {
            title: "中文别名",
            field: "name",
            width: 150,
            slots: {
              // 使用 JSX 渲染
              default: ({ row }) => {
                return [
                  <div
                    onContextmenu={(e) => this.onContextmenu(e, this, 3, row)}
                    onClick={(e) => this.handleLevelThreeClick(e, row, this)}
                    class="myRow"
                  >
                    {row.name}
                  </div>,
                ];
              },
            },
          },
          {
            title: "实体",
            field: "flag_table",
            width: 150,
            slots: {
              // 使用 JSX 渲染
              default: ({ row }) => {
                return [
                  <div
                    onContextmenu={(e) => this.onContextmenu(e, this, 3, row)}
                    onClick={(e) => this.handleLevelThreeClick(e, row, this)}
                    class="myRow"
                  >
                    {row.flag_table == 1 ? "是" : "否"}
                  </div>,
                ];
              },
            },
          },
          {
            title: "引擎",
            field: "c_engine",
            width: 150,
            slots: {
              // 使用 JSX 渲染
              default: ({ row }) => {
                return [
                  <div
                    onContextmenu={(e) => this.onContextmenu(e, this, 3, row)}
                    onClick={(e) => this.handleLevelThreeClick(e, row, this)}
                    class="myRow"
                  >
                    {row.c_engine}
                  </div>,
                ];
              },
            },
          },
          {
            title: "字符集",
            field: "c_charset",
            width: 150,
            slots: {
              // 使用 JSX 渲染
              default: ({ row }) => {
                return [
                  <div
                    onContextmenu={(e) => this.onContextmenu(e, this, 3, row)}
                    onClick={(e) => this.handleLevelThreeClick(e, row, this)}
                    class="myRow"
                  >
                    {row.c_charset}
                  </div>,
                ];
              },
            },
          },
          {
            title: "排序规则",
            field: "c_collation",
            width: 150,
            slots: {
              // 使用 JSX 渲染
              default: ({ row }) => {
                return [
                  <div
                    onContextmenu={(e) => this.onContextmenu(e, this, 3, row)}
                    onClick={(e) => this.handleLevelThreeClick(e, row, this)}
                    class="myRow"
                  >
                    {row.c_collation}
                  </div>,
                ];
              },
            },
          },
          {
            title: "注释",
            field: "c_comment",
            width: 150,
            minWidth: 150,
            slots: {
              // 使用 JSX 渲染
              default: ({ row }) => {
                return [
                  <div
                    onContextmenu={(e) => this.onContextmenu(e, this, 3, row)}
                    onClick={(e) => this.handleLevelThreeClick(e, row, this)}
                    class="myRow"
                  >
                    {row.c_comment}
                  </div>,
                ];
              },
            },
          },
        ],
        data: this.data7,
      };
    },
    designTableOptions() {
      return {
        border: true,
        resizable: true,
        keepSource: true,
        showOverflow: true,
        height: 530,
        toolbarConfig: {
          buttons: [
            {
              code: "insert_actived",
              name: "新增",
              status: "perfect",
              icon: "fa fa-plus",
            },
          ],
          perfect: true,
          zoom: {
            iconIn: "fa fa-arrows-alt",
            iconOut: "fa fa-expand",
          },
          custom: {
            icon: "fa fa-cog",
          },
        },
        editConfig: {
          // 设置触发编辑为手动模式
          trigger: "manual",
          // 设置为整行编辑模式
          mode: "row",
          // 显示修改状态和新增状态
          showStatus: true,
          // 自定义可编辑列头的图标
          icon: "fa fa-file-text-o",
        },
        columns: [
          {
            title: "名",
            field: "name_code",
            width: 150,
            minWidth: 150,
            editRender: { name: "input", type: "text" },
          },
          {
            field: "c_type",
            title: "类型",
            width: 150,
            minWidth: 150,
            editRender: {
              name: "select",
              options: [
                { value: "tinyint", label: "tinyint" },
                { value: "smallint", label: "smallint" },
                { value: "mediumint", label: "mediumint" },
                { value: "int", label: "int" },
                { value: "bigint", label: "bigint" },
                { value: "float", label: "float" },
                { value: "double", label: "double" },
                { value: "demical", label: "demical" },
                { value: "datetime", label: "datetime" },
                { value: "timestamp", label: "timestamp" },
                { value: "char", label: "char" },
                { value: "varchar", label: "varchar" },
                { value: "tinyblob", label: "tinyblob" },
                { value: "mediumblob", label: "mediumblob" },
                { value: "blob", label: "blob" },
                { value: "longblob", label: "longblob" },
                { value: "tinytext", label: "tinytext" },
                { value: "mediumtext", label: "mediumtext" },
                { value: "text", label: "text" },
                { value: "longtext", label: "longtext" },
              ],
            },
          },
          {
            field: "c_len",
            title: "长度",
            width: 150,
            minWidth: 150,
            editRender: { name: "input", type: "number" },
          },
          {
            field: "demical",
            title: "小数点",
            width: 150,
            minWidth: 150,
            editRender: { name: "input", type: "number" },
          },
          {
            field: "c_null",
            title: "不是 null",
            width: 150,
            minWidth: 150,
            editRender: {
              name: "select",
              options: [
                { value: "0", label: "√" },
                { value: "1", label: "×" },
              ],
            },
          },
          {
            field: "is_key",
            title: "主键",
            width: 150,
            minWidth: 150,
            editRender: {
              name: "select",
              options: [
                { value: "0", label: "" },
                { value: "1", label: "🔑" },
              ],
            },
          },
          {
            field: "is_increment",
            title: "自增",
            width: 150,
            minWidth: 150,
            editRender: {
              name: "select",
              options: [
                { value: "0", label: "×" },
                { value: "1", label: "√" },
              ],
            },
          },
          {
            field: "c_comment",
            title: "注释",
            width: 150,
            minWidth: 150,
            editRender: { name: "input", type: "text" },
          },
          {
            title: "操作",
            width: 120,
            slots: { default: "operate" },
            fixed: "right",
          },
        ],
        data: this.columns,
        loading: this.designTableOptions_loading,
      };
    },
  },
  data() {
    return {
      designTableOptions_loading: false,
      showDesignTable: false, // 设计表弹窗
      designTableLoading: true, // 设计表异步
      appList: [],
      showTable: {},
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
      rightContentArr: [], //右边内容
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
          title: "实体",
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
          minWidth: 150,
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
      columnParent: {}, //  当前操作column的origin_id,app_id信息
    };
  },
  created() {
    this.columnDrop2();
    getAppList().then((res) => {
      this.appList = res.data.data.list;
    });
  },
  activated() {
    getAppList().then((res) => {
      this.appList = res.data.data.list;
    });
  },
  beforeDestroy() {
    if (this.sortable2) {
      this.sortable2.destroy();
    }
  },
  methods: {
    saveRowEvent(row) {
      const $grid = this.$refs.xGrid;
      if (!row.c_null) {
        this.$set(row, "c_null", 0);
      }
      if (!row.is_key) {
        this.$set(row, "is_key", 0);
      }
      if (!row.is_increment) {
        this.$set(row, "is_increment", 0);
      }
      if (!row.c_type) {
        this.$set(row, "c_type", "tinyint");
      }
      if (!row.c_comment) {
        this.$set(row, "c_comment", "未填写");
      }
      console.log(row, this.onData);
      $grid.clearActived().then(() => {
        this.designTableOptions_loading = true;
        if (row.id) {
          // 保存
          databaseTools
            .editField(Object.assign({}, row, this.columnParent))
            .then((res) => {
              if (res.data.code == 1) {
                setTimeout(() => {
                  this.designTableOptions_loading = false;
                  this.$Message.success("保存成功");
                }, 300);
              } else {
                this.designTableOptions_loading = false;
                this.$Message.error(res.data.msg);
              }
            });
        } else {
          // 新增
          databaseTools
            .addField(Object.assign({}, row, this.columnParent))
            .then((res) => {
              if (res.data.code == 1) {
                this.$set(row, "id", 666);
                setTimeout(() => {
                  this.designTableOptions_loading = false;
                  this.$Message.success("保存成功");
                }, 300);
              } else {
                this.designTableOptions_loading = false;
                this.$Message.error(res.data.msg);
              }
            });
        }
        // databaseTools
      });
    },
    // 编辑 field
    editRowEvent(row) {
      const $grid = this.$refs.xGrid;
      $grid.setActiveRow(row);
    },
    // 删除 field
    removeRowEvent(row) {
      const $grid = this.$refs.xGrid;
      console.log("row", row);
      this.$Modal.confirm({
        title: "提示",
        content: `您确定要删除该数据？`,
        onOk: () => {
          if (row.id) {
            databaseTools
              .delField(
                _.pick(Object.assign({}, row, this.columnParent), [
                  "app_id",
                  "orgin_id",
                  "id",
                ])
              )
              .then((res) => {
                if (res.data.code == 1) {
                  $grid.remove(row);
                  this.$Message.success("删除成功");
                } else {
                  this.$Message.error(res.data.msg);
                }
              });
          } else {
            $grid.remove(row);
            this.$Message.success("删除成功");
          }
        },
        onCancel: () => {},
      });
    },
    // 设计表
    designTable() {
      console.log("onData", this.onData);
      this.columnParent = {
        app_id: this.onData.app_id,
        o_orgin_id: this.onData.orgin_id,
      };
      this.threeClickNext(this.onData, this);
      this.showDesignTable = true;
    },
    // root刷新
    handleLevelOneRefresh() {
      this.data5[0].loading = true;
      console.log("onData", this.onData);
      this.data5 = [
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
      ];
    },
    // 选择应用
    handleAppChange(item) {
      this.$set(this.databaseTemp, "app_id", item.app_id);
      // this.databaseTemp.app_id = item.id;
      console.log("app_id", this.databaseTemp.app_id);
    },
    columnDrop2() {
      this.$nextTick(() => {
        const $table = this.$refs.xGrid2;
        this.sortable2 = Sortable.create(
          $table.$el.querySelector(
            ".body--wrapper>.vxe-table--header .vxe-header--row"
          ),
          {
            handle: ".vxe-header--column:not(.col--fixed)",
            onEnd: ({ item, newIndex, oldIndex }) => {
              const { fullColumn, tableColumn } = $table.getTableColumn();
              const targetThElem = item;
              const wrapperElem = targetThElem.parentNode;
              const newColumn = fullColumn[newIndex];
              if (newColumn.fixed) {
                // 错误的移动
                if (newIndex > oldIndex) {
                  wrapperElem.insertBefore(
                    targetThElem,
                    wrapperElem.children[oldIndex]
                  );
                } else {
                  wrapperElem.insertBefore(
                    wrapperElem.children[oldIndex],
                    targetThElem
                  );
                }
                return this.$XModal.message({
                  content: "固定列不允许拖动！",
                  status: "error",
                });
              }
              // 转换真实索引
              const oldColumnIndex = $table.getColumnIndex(
                tableColumn[oldIndex]
              );
              const newColumnIndex = $table.getColumnIndex(
                tableColumn[newIndex]
              );
              // 移动到目标列
              const currRow = fullColumn.splice(oldColumnIndex, 1)[0];
              fullColumn.splice(newColumnIndex, 0, currRow);
              $table.loadColumn(fullColumn);
            },
          }
        );
      });
    },
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
    // 删除table
    delTable() {
      console.log("delete table", this.onData, this.data5, this.showTable);
      let x = this.data5[0].children.findIndex(
        (e) => e.orgin_id == this.onData.d_orgin_id
      );
      let y = this.data5[0].children[x].children.findIndex(
        (e) => e.id == this.onData.id
      );
      this.$Modal.confirm({
        title: "提示",
        content: `真的要删除【${this.onData.name_code}(${this.onData.name})】吗？`,
        onOk: () => {
          databaseTools
            .delTable(_.pick(this.onData, ["orgin_id", "app_id"]))
            .then((res) => {
              if (res.data.code == 1) {
                this.data5[0].children[x].children.splice(y, 1);
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
      // Object.assign(this.TableTemp, this.onData);
      this.TableTemp = _.cloneDeep(this.onData);
      console.log("tableTemp", this.TableTemp);
      this.showAddTable = true;
      this.EditTable = true;
    },
    // 编辑数据库模型取消
    editDatabaseCancel() {
      this.$Modal.confirm({
        title: "提示",
        content: "您所做修改都不会被保存，确定要离开吗？",
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
    // 编辑数据表确认
    editTableConfirm() {
      console.log("确认修改 数据表", this.onData, this.TableTemp);
      this.$refs["addTableForm"].validate((valid) => {
        if (valid) {
          this.addTableLoading = false;
          databaseTools.editTable(this.TableTemp).then((res) => {
            if (res.data.code == 1) {
              this.TableTemp.title = this.TableTemp.name_code;
              Object.assign(this.onData, this.TableTemp);
              this.$Message.success(
                "修改成功!",
                Object.assign(this.onData, this.TableTemp)
              );
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
    // 数据表添加确认
    addTableConfirm(EditTable) {
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
        content: "您所做修改都不会被保存，确定要离开吗？",
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
                orgin_id: e.orgin_id,
                app_id: e.app_id,
                d_orgin_id: e.d_orgin_id,
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
        content: "您所做修改都不会被保存，确定要离开吗？",
        onOk: () => {
          this.showAddDatabase = false;
          this.$refs["addDatabaseForm"].resetFields();
        },
        onCancel: () => {},
      });
    },
    // 添加数据库模型确认
    addDatabaseConfirm() {
      console.log("this.databaseTemp", this.databaseTemp);
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
    threeClickNext(item, that) {
      return new Promise((resolve) => {
        console.log("threeClickNext", item);
        this.showTable = item;
        let index = that.data5[0].children.findIndex(
          (e) => e.orgin_id == item.d_orgin_id
        );
        that.data7 = that.data5[0].children[index].children;
        databaseTools
          .getProperty({
            size: 999,
            page: 1,
            app_id: item.app_id,
            o_orgin_id: item.orgin_id,
          })
          .then((res) => {
            let rightContentArr = [
              {
                name_code: "update_time", // 字段名
                c_type: "datetime", // 类型
                c_len: "", // 类型长度
                c_null: 0, // 是否为NULL
                c_default: "", // 是否有默认值
                is_increment: 0, // 是否自增
                c_comment: "删除时间", // 注释
              },
            ];
            let rightContentKey = {
              is_key: 1,
              key_type: "NORMAL",
              key_fun: "BTREE",
            };
            if (res.data.code == 1 && res.data.data.count > 0) {
              this.columns = res.data.data.list;
              resolve();
              console.log("columns", this.columns);
              this.rightContentArr = this.columns.map((e) => {
                return {
                  name_code: e.name_code,
                  c_type: e.c_type, // 类型
                  c_len: e.c_len, // 类型长度
                  c_null: e.c_null, // 是否为NULL
                  c_default: e.c_default, // 是否有默认值
                  is_increment: e.is_increment, // 是否自增
                  c_comment: e.c_comment, // 注释
                  show_word: `'${e.name_code}' ${e.c_type}(${e.c_len}) ${
                    e.c_null == 1 ? "NOT NULL" : ""
                  } DEFAULT ${e.c_default} COMMENT '${e.c_comment}' ${
                    e.is_increment ? "AUTO_INCREMENT" : ""
                  }`,
                };
              });
            } else {
              // this.$Message.warning("暂无字段，请创建~");
              this.columns = [];
              this.rightContentArr = [];
            }
          });
      });
    },
    // 树上二级元素点击
    handleClick($event, item, that) {
      this.showTable = {};
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
            this.$Message.warning("cannot find any database!");
            callbackData = [];
            callback(callbackData);
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
                  app_id: e.app_id,
                  d_orgin_id: e.d_orgin_id,
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
                  this.onContextmenu($event, this, 3, data)
                }
                onClick={($event) =>
                  this.handleLevelThreeClick($event, data, this, root, node)
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
          };
          this.handleLevelTwoRefresh();
          break;
        default:
          return;
          break;
      }
      children.push(obj);
      this.$set(data, "children", children);
      console.log(this.data5);
    },
    // 添加数据库 数据表
    handleAppend() {
      console.log("添加数据库 数据表", this.onData);
      if (this.onData.level == 1) {
        // 添加数据库
        // if (!this.onData.expand) {
        //   this.$Message.error("请展开该项后再操作！");
        //   return;
        // }
        this.showAddDatabase = true;
        return;
      }
      if (this.onData.level == 2) {
        this.showAddTable = true;
        this.TableTemp.app_id = this.onData.app_id;
        this.TableTemp.d_orgin_id = this.onData.orgin_id;
      }
    },
    handleAppendDatabase() {
      this.onData = this.data5[0];
      this.menuMod = 1;
      console.log("添加数据库", this.onData);
      this.showAddDatabase = true;
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
.middle-split-pane {
  /deep/.vxe-body--column .vxe-cell {
    padding-left: 0px;
    padding-right: 0px;
    height: 100%;
    width: 100%;
    position: relative;
  }
}
.myRow {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  text-indent: 10px;
}

.intent-20 {
  text-indent: 20px;
}
.intent-10 {
  text-indent: 10px;
}
.right-split-pane {
  padding: 10px 10px;
}
.demo-split-pane,
.middle-split-pane {
  height: calc(~"100vh - 122px");
  padding-left: 3px;
}
.whole {
  width: 100%;
  height: calc(~"100vh - 122px");
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