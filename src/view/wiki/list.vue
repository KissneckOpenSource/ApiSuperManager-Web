<style scoped>
  .line-height-16 {
    line-height: 30px;
  }

  .url {
    width: 90%;
    display: inline-block;
  }

  .editor-wrapper {
    width: 100%;
    height: 700px;
  }

  .interface-test-url {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
  }

  .showall {
    margin-top: 10px;
  }
</style>
<template>
  <Layout style="height: 100%">
    <Menu mode="horizontal" theme="dark" active-name="list">
      <template v-if="!firstLoad">
        <div class="wiki-logo">
          <Spin size="large"></Spin>
        </div>
      </template>
      <template v-else>
        <div class="wiki-logo" v-if="appinfo.app_id == -1" @click="$router.push({ name: 'home' })">
          首页
        </div>
        <div class="wiki-logo" v-else>接口文档</div>
      </template>
      <div class="wiki-nav">
        <MenuItem name="explain" to="/wiki/explain">
          <Icon type="md-list-box" />
         接口设计文档
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
    <Content class="wiki-content-con">
      <Card class="margin-top-15">
        <div>
          <h3 class="line-height-16">接口状态说明：</h3>
          <p class="line-height-16">
            <Tag color="warning">测试</Tag>系统将不过滤任何字段，也不进行AccessToken的认证，但在必要的情况下会进行UserToken的认证！
          </p>
          <p class="line-height-16">
            <Tag color="primary">启用</Tag>系统将严格过滤请求字段，并且进行全部必要认证！
          </p>
          <p class="line-height-16">
            <Tag color="error">禁用</Tag>系统将拒绝所有请求，一般应用于危机处理！
          </p>
        </div>
      </Card>
      <Card class="margin-bottom-10" style="margin-top: 10px;">
      <Form ref="myForm" :rules="ruleValidate" :model="searchConf" inline :label-width="90">
        <FormItem class="margin-bottom-0" label="应用分组" prop="app_group_id">
          <Select v-model="searchConf.app_group_id" clearable placeholder="请选择应用分组" style="width:200px" filterable>
            <Option v-for="(v, i) in appGroup" :value="v.hash" :kk="i" :key="v.hash"> {{v.name}}</Option>
          </Select>
        </FormItem>
        <FormItem class="margin-bottom-0" label="接口名称" prop="interface_name">
          <Input v-model="searchConf.interface_name" placeholder="请输入接口名称" clearable></Input>
        </FormItem>
        <FormItem class="margin-bottom-0" label="真实类库" prop="api_class">
          <Input v-model="searchConf.api_class" placeholder="请输入真实类库" clearable></Input>
        </FormItem>
        <Button type="primary" @click="search">{{ $t('find_button') }}/{{ $t('refresh_button') }}</Button>
        <Button type="success" @click="Panelopen" style="margin-left: 10px;">展开/收缩</Button>
      </Form>
    </Card>
      <div class="wiki-layout-con">
        <Spin size="large" fix v-if="show_loading"></Spin>
        <Collapse v-model="Panelvalue">
          <Panel v-bind:key="index" v-for="(item, index) in groupInfo" :name="index.toString()">
            {{item.name}}【{{item.create_time}}】 <span style="float: right;" class="margin-right-20">接口数量{{item.api_info
              ? item.api_info.length : 0}} | 项目热度{{item.hot}}</span>
            <p slot="content" v-if="item.api_info">
              <span v-bind:key="api_index" v-for="(api_item, api_index) in item.api_info"
                @click="showApiDetail(api_item.hash)" style="cursor:pointer">
                <Alert type="warning" v-if="api_item.method === 0">
                  <h3>
                    /api/{{
                    api_item.hash_type === 1
                    ? api_item.api_class
                    : api_item.hash
                    }}
                  </h3>
                  <template slot="desc">
                    <div style="display: flex; flex-direction: column">
                      <div>
                        <Tag color="warning">不限</Tag>
                        {{ api_item.info }}
                      </div>
                      <div>
                        <Tag color="red">接口说明</Tag>
                        {{ api_item.des || "无" }}
                      </div>
                    </div>
                  </template>
                </Alert>
                <Alert type="success" v-if="api_item.method === 1">
                  <h3>
                    /api/{{
                    api_item.hash_type === 1
                    ? api_item.api_class
                    : api_item.hash
                    }}
                  </h3>
                  <template slot="desc">
                    <div style="display: flex; flex-direction: column">
                      <div>
                        <Tag color="success">POST</Tag>
                        {{ api_item.info }}
                      </div>
                      <div>
                        <Tag color="red">接口说明</Tag>
                        {{ api_item.des || "无" }}
                      </div>
                    </div>
                  </template>
                </Alert>
                <Alert v-if="api_item.method === 2">
                  <h3>
                    /api/{{
                    api_item.hash_type === 1
                    ? api_item.api_class
                    : api_item.hash
                    }}
                  </h3>
                  <template slot="desc">
                    <div style="display: flex; flex-direction: column">
                      <div>
                        <Tag color="primary">GET</Tag>
                        {{ api_item.info }}
                      </div>
                      <div>
                        <Tag color="red">接口说明</Tag>
                        {{ api_item.des || "无" }}
                      </div>
                    </div>
                  </template>
                </Alert>
                <Alert v-if="api_item.method === 3">
                  <h3>
                    /api/{{
                    api_item.hash_type === 1
                    ? api_item.api_class
                    : api_item.hash
                    }}
                  </h3>
                  <template slot="desc">
                    <div style="display: flex; flex-direction: column">
                      <div>
                        <Tag color="green">PUT</Tag>
                        {{ api_item.info }}
                      </div>
                      <div>
                        <Tag color="red">接口说明</Tag>
                        {{ api_item.des || "无" }}
                      </div>
                    </div>
                  </template>
                </Alert>
                <Alert v-if="api_item.method === 4">
                  <h3>
                    /api/{{
                    api_item.hash_type === 1
                    ? api_item.api_class
                    : api_item.hash
                    }}
                  </h3>
                  <template slot="desc">
                    <div style="display: flex; flex-direction: column">
                      <div>
                        <Tag color="error">DELETE</Tag>
                        {{ api_item.info }}
                      </div>
                      <div>
                        <Tag color="red">接口说明</Tag>
                        {{ api_item.des || "无" }}
                      </div>
                    </div>
                  </template>
                </Alert>
                <Alert v-if="api_item.method === 5">
                  <h3>
                    /api/{{
                    api_item.hash_type === 1
                    ? api_item.api_class
                    : api_item.hash
                    }}
                  </h3>
                  <template slot="desc">
                    <div style="display: flex; flex-direction: column">
                      <div>
                        <Tag color="gold">PATCH</Tag>
                        {{ api_item.info }}
                      </div>
                      <div>
                        <Tag color="red">接口说明</Tag>
                        {{ api_item.des || "无" }}
                      </div>
                    </div>
                  </template>
                </Alert>
              </span>
            </p>
            <p slot="content" v-else style="text-align: center">
              <span>暂无接口</span>
            </p>
          </Panel>
        </Collapse>
        <ABackTop :height="100" :bottom="80" :right="60" container=".wiki-layout-con"></ABackTop>
      </div>
    </Content>
    <!-- <Footer class="wiki-footer-center">&copy; Powered  By <Tag color="primary">{{co}}</Tag></Footer> -->
    <Footer class="wiki-footer-center"></Footer>
    <Drawer :title="api_detail.info" v-model="show_detail" width="820" :mask-closable="true" @on-close="closeDrawer"
      :draggable="true" @on-resize-width="handleResize">
      <Tabs type="card" @on-click="handleClickTab($event)">
        <TabPane label="接口说明">
          <Form :label-width="80">
            <FormItem label="接口地址">
              <Tag v-if="api_detail.method === 1" color="success">POST</Tag>
              <Tag v-if="api_detail.method === 2" color="primary">GET</Tag>
              <Tag v-if="api_detail.method === 3" color="green">PUT</Tag>
              <Tag v-if="api_detail.method === 4" color="error">DELETE</Tag>
              <Tag v-if="api_detail.method === 5" color="gold">PATCH</Tag>
              <Tag v-if="api_detail.method === 0" color="warning">不限</Tag>
              <Alert class="url">······{{api_detail.api_class}}</Alert>
            </FormItem>
            <FormItem label="接口说明">
              <Alert type="success">{{ api_detail.des || "无" }}</Alert>
            </FormItem>
            <FormItem label="Headers">
              <Table border :columns="header_columns" :data="header_data"></Table>
            </FormItem>
            <FormItem label="请求参数">
              <Table border :columns="request_columns" :data="detail_info.request"></Table>
            </FormItem>
            <FormItem label="返回参数">
              <Table border :columns="response_columns" :data="detail_info.response"></Table>
            </FormItem>
            <FormItem label="返回示例" v-if="code">
              <div style="width: 100%" v-highlight>
                <pre><code>{{code}}</code></pre>
              </div>
            </FormItem>
          </Form>
        </TabPane>
        <TabPane label="接口测试" style="position: relative">
          <!-- <Card style="width:100%">
            <div style="text-align:center">
              <img width="120px" src="https://cn.vuejs.org/images/logo.png">
              <h3>在线测试功能，即将到来</h3>
            </div>
          </Card> -->
          <!-- <iframe
            src="http://tool.chinaz.com/tools/httptest.aspx?jdfwkey=2ugnf2"
            id="mobsf"
            scrolling="no"
            frameborder="0"
            style="position:absolute;height: 100%; width:100%;"
          ></iframe> -->
          <Form :label-width="80">
            <FormItem label="请求方式">
              <div class="interface-test-url">
                <Select v-model="testForm.method" style="width: 300px; margin-bottom: 10px">
                  <Option :value="2">GET</Option>
                  <Option :value="1">POST</Option>
                  <Option :value="3">PUT</Option>
                  <Option :value="4">DELETE</Option>
                  <Option :value="5">PATCH</Option>
                </Select>
              </div>
            </FormItem>
            <!-- <FormItem label="填写地址">
              <div class="interface-test-url"> -->
                <!-- <Alert class="url">{{url}}</Alert> -->
                <!-- <Alert class="url"><Input v-model="requestURLPrefix" placeholder=""
                    style="width: calc(50% - 100px);"></Input> -->
                  <!-- {{requestURL}}<Input v-model="requestURLSuffix" placeholder=""
                    style="width: calc(50% - 100px);"></Input></Alert>
              </div>
            </FormItem> -->
            <FormItem label="请求地址">
              <div class="interface-test-url">
                <!-- <Alert class="url">{{url}}</Alert> -->
                <!-- <Alert class="url">{{ requestURLPrefix + requestURL }}</Alert> -->
                <Alert class="url">
                {{url}}<Input v-model="requestURLSuffix" placeholder=""
                style="width: calc(50% - 100px);" v-if="route_index!=''"></Input>
                <span v-if="last_c">{{last_c}}</span>
              </Alert>
                <Button type="primary" @click="sendRequset">发送请求</Button>
              </div>
            </FormItem>
            <FormItem label="请求头部">
              <Form :label-width="120" :label-position="left">
                <FormItem v-for="(header, ri) in header_data_test" :key="ri" :label="header.field_name"
                  style="margin-bottom: 10px;">
                  <Input v-model="header.result_val" placeholder="" style="width: calc(100% - 200px);"></Input>
                </FormItem>
              </Form>
            </FormItem>
            <FormItem label="请求参数">
              <Form :label-width="120">
                <FormItem v-for="(header, ri) in request_columns_test" :key="ri" :label="header.field_name"
                  style="margin-bottom: 10px;" :required="header.is_must === 1">
                  <Input v-model="header.result_val" placeholder="" style="width: calc(100% - 200px);"></Input>
                </FormItem>
              </Form>
            </FormItem>
            <FormItem label="加密方式">
              <Select v-model="testForm.crypto" style="width:300px; margin-bottom: 10px;">
                <Option :value="1">无</Option>
                <Option :value="2">md5</Option>
              </Select>
            </FormItem>
            <FormItem label="返回示例">
              <json-viewer :value="interfaceTestStr"></json-viewer>
              <!-- <div>{{}}</div> -->
            </FormItem>
          </Form>
        </TabPane>
        <TabPane label="接口代码">
          <div class="editor-wrapper" id="monaco" v-if="readyShowEditor">
            <codeEditor :key="width + updateCounter" :value="code_php" @updateCode="updateCode" @saveCode="saveCode" />
          </div>
        </TabPane>
      </Tabs>
    </Drawer>
  </Layout>
</template>
<script>
  // monaco editor
  import codeEditor from '../../components/code-editor'
  import './list.less'
  import { apiGroup, detail, logout, updateCode } from '@/api/wiki'
  import { setToken } from '@/libs/util'
  import ABackTop from '@/components/main/components/a-back-top'
  import JsonViewer from 'vue-json-viewer'
  import axios from 'axios'
  import { getAll } from "@/api/app-group";
  export default {
    name: 'wiki',
    components: {
      ABackTop,
      [JsonViewer.name]: JsonViewer,
      codeEditor
    },
    data() {
      return {
        width: 0,
        firstLoad: false, // 第一次grouplist请求是否完成
        readyShowEditor: false, // 是否可以渲染编辑器
        show_detail: false, // 是否展示右侧API详细
        show_loading: false, // 是否在拉取WIKI
        app_id: sessionStorage.getItem('ApiAdmin_AppInfo'),
        code: '',
        url: '',
        last_c:'',
        route_index:'',
        requestURL: '',
        requestURLPrefix: '',
        requestURLSuffix: ':id',
        groupInfo: [],
        header_columns: [
          {
            title: '参数名称',
            key: 'field_name'
          },
          {
            title: '类型',
            render: (h, params) => {
              return h('Tag', {
                props: {
                  'color': 'blue'
                }
              }, this.detail_info.dataType[params.row.data_type])
            }
          },
          {
            title: '字段状态',
            render: (h, params) => {
              if (params.row.is_must === 1) {
                return h('Tag', {
                  props: {
                    'color': 'red'
                  }
                }, '复杂认证')
              } else {
                return h('Tag', {
                  props: {
                    'color': 'blue'
                  }
                }, '简易认证')
              }
            }
          },
          {
            title: '字段说明',
            key: 'info',
            width: 290,
            render: (h, params) => {
              let text = params.row.info.substring(0, 20) + '...'
              if (params.row.info.length >= 20) {
                return h('Tooltip', {
                  props: {
                    transfer: true,
                    maxWidth: 200
                  }
                }, [
                  text,
                  h('div', {
                    slot: 'content',
                    style: {
                      whiteSpace: 'normal',
                      wordBreak: 'break-all',
                      wordWrap: 'break-word'
                    }
                  }, params.row.info)
                ])
              } else {
                return h('span', params.row.info)
              }
            }
          }
        ],
        request_columns: [
          {
            title: '字段名称',
            key: 'field_name'
          },
          {
            title: '类型',
            width: 100,
            render: (h, params) => {
              return h('Tag', {
                props: {
                  'color': 'blue'
                }
              }, this.detail_info.dataType[params.row.data_type])
            }
          },
          {
            title: '字段属性',
            width: 100,
            render: (h, params) => {
              if (params.row.is_must === 1) {
                return h('Tag', {
                  props: {
                    'color': 'red'
                  }
                }, '必填')
              } else {
                return h('Tag', {
                  props: {
                    'color': 'orange'
                  }
                }, '选填')
              }
            }
          },
          {
            title: '默认值',
            key: 'default'
          },
          {
            title: '字段说明',
            key: 'info',
            width: 290,
            render: (h, params) => {
              let text = params.row.info.substring(0, 20) + '...'
              if (params.row.info.length >= 20) {
                return h('Tooltip', {
                  props: {
                    transfer: true,
                    maxWidth: 200
                  }
                }, [
                  text,
                  h('div', {
                    slot: 'content',
                    style: {
                      whiteSpace: 'normal',
                      wordBreak: 'break-all',
                      wordWrap: 'break-word'
                    }
                  }, params.row.info)
                ])
              } else {
                return h('span', params.row.info)
              }
            }
          }
        ],
        response_columns: [
          {
            title: '字段名称',
            key: 'show_name'
          },
          {
            title: '类型',
            render: (h, params) => {
              return h('Tag', {
                props: {
                  'color': 'blue'
                }
              }, this.detail_info.dataType[params.row.data_type])
            }
          },
          {
            title: '字段说明',
            key: 'info',
            width: 290,
            render: (h, params) => {
              let text = params.row.info.substring(0, 20) + '...'
              if (params.row.info.length >= 20) {
                return h('Tooltip', {
                  props: {
                    transfer: true,
                    maxWidth: 200
                  }
                }, [
                  text,
                  h('div', {
                    slot: 'content',
                    style: {
                      whiteSpace: 'normal',
                      wordBreak: 'break-all',
                      wordWrap: 'break-word'
                    }
                  }, params.row.info)
                ])
              } else {
                return h('span', params.row.info)
              }
            }
          }
        ],
        detail_info: {},
        api_detail: {},
        header_data: [],
        appinfo: {},
        code_php: '',
        co: '',
        testForm: {
          method: ''
        }, // 接口测试数据
        header_data_test: [], // 接口测试头部
        request_columns_test: [], // 接口测试请求参数
        interfaceTestStr: '等待中...', // 接口测试返回参数
        updateCounter: 0, // 代码更新
        Panelvalue: [],
        showAll: false,
        searchConf:{
          app_group_id:"",
          interface_name:"",
          api_class:"",
        },
        appGroup:[],
      }
    },
    created() {
      let vm = this;
      this.getList()
      getAll().then((response)=>{
        vm.appGroup = response.data.data.list;
        console.log('appgroup',vm.appGroup);
      })
    },
    mounted() {
    },
    methods: {
      // 保存代码
      saveCode(code) {
        this.code_php = code
        let data = new FormData()
        data.append('code', code)
        updateCode(data).then(() => {
        })
      },
      // 更新代码
      updateCode(code) {
        this.code_php = code
      },
      handleResize(e) {
        this.width = e
      },
      handleClickTab(e) {
        if (e === 2) {
          this.readyShowEditor = true
        }
      },
      // 返回首页
      handleBackHome() {
        this.$router.push({ name: 'home' })
      },
      sendRequset() {
        let vm = this
        let methodsObject = {
          2: 'get',
          1: 'post',
          3: 'put',
          4: 'delete',
          5: 'patch'
        }
        if (!methodsObject[vm.testForm.method]) {
          vm.$Notice.warning({
            title: '提示',
            desc: '错误的请求类型！'
          })
        }
        console.log('请求头：', vm.getHeader())
        console.log('请求类型：', methodsObject[vm.testForm.method])
        console.log('请求参数：', vm.getData(methodsObject[vm.testForm.method]))
        let options = {
          method: methodsObject[vm.testForm.method],
          url: vm.last_c ? vm.requestURLSuffix == ':id'? vm.url +"" +vm.last_c :vm.url +vm.requestURLSuffix +vm.last_c: vm.requestURLSuffix == ':id'? vm.url +"":vm.url +vm.requestURLSuffix,
          headers: vm.getHeader(),
        }
        if (options.method === 'get') {
          let params = vm.getData(methodsObject[vm.testForm.method])
          options.params = params
        } else if (options.method === 'post') {
          options.data = vm.getData(methodsObject[vm.testForm.method])
        } else if (options.method === 'put') {
          options.data = vm.getData(methodsObject[vm.testForm.method])
        } else if (options.method === 'delete') {
          let params = vm.getData(methodsObject[vm.testForm.method])
          options.params = params
        } else if (options.method === 'patch') {
          options.data = vm.getData(methodsObject[vm.testForm.method])
        }
        console.log('options', options)
        axios(options).then(res => {
          vm.interfaceTestStr = res.data
          console.log('res: ', res)
        }).catch(error => {
          vm.interfaceTestStr = {
            msg: '本次请求未能完成！',
            error: error
          }
          console.log('error: ', error)
        })
        console.log(vm.url);
        var Mock = require("mockjs");
          var data = Mock.mock(vm.url);
      },
      getHeader() {
        let vm = this
        let headArr = vm.header_data_test
        if (Array.isArray(headArr) && headArr.length > 0) {
          let identifiedHeader = {}
          headArr.forEach(e => {
            e.result_val && (identifiedHeader[e.field_name] = e.result_val)
          })
          return identifiedHeader
        } else {
          return {}
        }
      },
      getData(method) {
        let vm = this
        let DataArr = vm.request_columns_test
        if (Array.isArray(DataArr) && DataArr.length > 0) {
          if (method === 'get' || method === 'delete') {
            let identifiedData = {}
            DataArr.forEach(e => {
              e.result_val && (identifiedData['' + e.field_name] = e.result_val)
            })
            return identifiedData
          } else if (method === 'post' || method === 'put' || method === 'patch') {
            let identifiedData = new FormData()
            DataArr.forEach(e => {
              e.result_val && (identifiedData.append(e.field_name, e.result_val))
            })
            return identifiedData
          }
        } else {
          if (method === 'get') {
            return {}
          } else if (method === 'post') {
            return new FormData()
          }
        }
      },
      logout() {
        let vm = this
        logout().then(response => {
          vm.$Message.success(response.data.msg)
          setToken('')
          sessionStorage.removeItem('ApiAdmin_AppInfo')
          vm.$router.push({
            name: 'wiki_login'
          })
        })
      },
      getList() {
        let vm = this
        apiGroup({
          app_group_id:vm.searchConf.app_group_id,
          interface_name:vm.searchConf.interface_name,
          api_class:vm.searchConf.api_class
        }).then(response => {
          vm.groupInfo = response.data.data.data
          vm.appinfo = response.data.data.appinfo
          vm.co = response.data.data.co
          vm.firstLoad = true
        })
        console.log('搜索参数',vm.searchConf);
      },
      closeDrawer() {
        this.getList()
      },
      showApiDetail(hash) {
        let vm = this
        vm.show_loading = true
        detail({
          hash: hash
        }).then(response => {
          let res = response.data.data
          vm.code_php = res.code_php
          this.updateCounter++
          vm.detail_info = res
          vm.show_detail = true
          vm.show_loading = false
          vm.url = res.url
          vm.last_c = res.end_index
          vm.route_index=res.route_index
          vm.requestURL = res.apiList.url
          vm.api_detail = res.apiList
          if (res.apiList.return_str) {
            vm.code = JSON.parse(res.apiList.return_str)
          }
          vm.header_data = [{
            is_must: res.apiList.access_token,
            field_name: 'Access-Token',
            info: 'APP认证秘钥【请在Header头里面传递】',
            data_type: 2
          }]
          vm.testForm.method = res.apiList.method
          vm.header_data_test = [
            {
              is_must: res.apiList.access_token,
              field_name: 'Access-Token',
              info: 'APP认证秘钥【请在Header头里面传递】',
              data_type: 2,
              result_val: ''
            },
            {
              is_must: res.apiList['x-auth-token'],
              field_name: 'x-auth-token',
              info: '用户token',
              data_type: 2,
              result_val: ''
            }
          ]
          vm.request_columns_test = res.request
          vm.interfaceTestStr = '等待中...'
        })
      },
      Panelopen() {
        let vm = this;
        let array = [];
        vm.showAll = !vm.showAll;
        if (vm.showAll) {
          //   vm.groupInfo.forEach((item,index)=>{
          //  array.push(index);
          // })
          for (let index = 0; index < vm.groupInfo.length; index++) {
            array.push(index)
          }
        } else {
          array = [];
        }
        console.log('array', array);
        this.Panelvalue = array;
      },
      search(){
        // let vm = this
        // apiGroup({
        //   app_group_id:vm.searchConf.app_group_id,
        //   interface_name:vm.searchConf.interface_name,
        //   api_class:vm.searchConf.api_class
        // }).then(response => {
        //   vm.groupInfo = response.data.data.data
        //   vm.appinfo = response.data.data.appinfo
        //   vm.co = response.data.data.co
        //   vm.firstLoad = true
        // })
        // console.log('搜索项',vm.searchConf);
        this.getList();
      }
    }
  }
</script>