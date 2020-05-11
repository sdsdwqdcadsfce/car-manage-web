<template>
    <div>
        <!--        面包屑导航-->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <!--            <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>-->
            <el-breadcrumb-item>美容项目管理</el-breadcrumb-item>
            <el-breadcrumb-item>美容项目列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--        卡片视图区-->
        <el-card>
            <!--            栅格布局-->
            <el-row :gutter="10" type="flex" justify="space-between">
                <!--                搜索区布局-->
                <el-col :span="8">
                    <el-input clearable @clear="getUserList" placeholder="请输入项目名称查询支持模糊查询" class="input-with-select"
                              v-model="queryInfo.projectname">

                    </el-input>
                </el-col>
                <el-col :span="16">
                    <div class="grid-content bg-purple">
                        <el-button type="primary" @click="getUserList">查询</el-button>
                    </div>
                </el-col>
                <el-col :span="3">
                    <div class="grid-content bg-purple">
                        <el-button type="primary" @click="insertVisible =true">新增项目</el-button>
                    </div>
                </el-col>
            </el-row>
            <!--            表格-->
            <el-table :data="userList" style="width: 100%" border fixed>
                <el-table-column label="#" type="index">
                </el-table-column>
                <el-table-column prop="projectid" label="项目编号">
                </el-table-column>
                <el-table-column prop="projectname" label="项目名称">
                </el-table-column>
                <el-table-column prop="projectunit" label="项目单位">
                </el-table-column>
                <el-table-column prop="projectmoney" label="项目价格">
                </el-table-column>
                <el-table-column label="产品列表" width="200px">
                    <template slot-scope="scope">
                        <div v-for="item in scope.row.goods">
                            <el-tag type="success">{{item.goodsName}}:{{item.count}} {{scope.row.projectunit}}</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="服务列表" width="80px">
                    <template slot-scope="scope">
                        <div v-for="item in scope.row.services">
                            <el-tag>{{item.servicename}}</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                    <template slot-scope="scope">
                        <el-tooltip content="编辑" placement="top" :enterable="true">
                            <el-button type="primary" icon="el-icon-edit" size="mini"
                                       @click="updateUser(scope.row.id+'')"></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" size="mini"
                                       @click="removeUserById(scope.row.id)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!--            分页组件-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.page"
                    :page-sizes="[10,15,20,25 ]"
                    :page-size="queryInfo.limit"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>

        <!--        新增弹出框-->
        <el-dialog
                title="新增用户"
                :visible.sync="insertVisible"
                :close-on-click-modal="false"
                width="50%">
            <el-form :model="RegistForm" :rules="registRules" ref="registFormRef" label-width="100px">
                <el-form-item label="项目名称" prop="projectname">
                    <el-input v-model="RegistForm.projectname"></el-input>
                </el-form-item>
                <el-form-item label="项目单位" prop="projectunit">
                    <el-input v-model="RegistForm.projectunit"></el-input>
                </el-form-item>
                <el-form-item label="项目价格" prop="projectmoney">
                    <el-input v-model="RegistForm.projectmoney"></el-input>
                </el-form-item>
                <el-form-item label="项目产品" prop="goods">
                    <el-collapse>
                        <el-collapse-item title="请选择项目产品" name="1">
                            <el-table
                                    :data="projectList"
                                    border
                                    style="width: 100%">
                                <el-table-column
                                        prop="goodsname"
                                        label="产品名称"
                                        width="150">
                                </el-table-column>


                                <el-table-column
                                        label="产品数量"
                                        width="205">

                                    <template slot-scope="scope">
                                        <el-input-number v-model="scope.row.count" @change="handleChange(scope.row)"
                                                         :min="0" :max="10" label="描述文字"></el-input-number>
                                    </template>

                                </el-table-column>

                            </el-table>
                        </el-collapse-item>
                    </el-collapse>
                </el-form-item>
                <el-form-item label="项目服务" prop="services">
                    <el-collapse>
                        <el-collapse-item title="请选择项目服务" name="1">
                            <el-table
                                    :data="serviceList"
                                    border
                                    @selection-change="handleSelectionChange"
                                    style="width: 100%">
                                <el-table-column
                                        label="选择服务"
                                        type="selection">
                                </el-table-column>
                                <el-table-column
                                        prop="servicename"
                                        label="服务项目"
                                        width="150">
                                </el-table-column>
                            </el-table>
                        </el-collapse-item>
                    </el-collapse>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="insertUser">确 定</el-button>
                <el-button @click="insertVisible = false">取 消</el-button>
           </span>

        </el-dialog>

        <!--        修改弹出框-->
        <el-dialog
                title="修改用户"
                :close-on-click-modal="false"
                :visible.sync="updateVisible"
                width="50%" @close="updateClose">
            <el-form :model="updateForm" :rules="updateFormRules" ref="updateFormRef" label-width="100px">
                <el-form-item label="项目编号">
                    <el-input v-model="updateForm.projectcode" disabled></el-input>
                </el-form-item>
                <el-form-item label="项目名称">
                    <el-input v-model="updateForm.projectname"></el-input>
                </el-form-item>
                <el-form-item label="项目单位" prop="projectunit">
                    <el-input v-model="updateForm.projectunit"></el-input>
                </el-form-item>
                <el-form-item label="项目价格" prop="projectmoney">
                    <el-input v-model="updateForm.projectmoney"></el-input>
                </el-form-item>
                <el-form-item label="项目产品" prop="goods">
                    <el-collapse>
                        <el-collapse-item title="请选择项目产品" name="1">
                            <el-table
                                    :data="updateForm.goods"
                                    border
                                    style="width: 100%">
                                <el-table-column
                                        prop="goodsName"
                                        label="产品名称"
                                        width="150">
                                </el-table-column>
                                <el-table-column
                                        label="产品数量"
                                        width="205">
                                    <template slot-scope="scope">
                                        <el-input-number v-model="scope.row.count" @change="handleChange(scope.row)"
                                                         :min="0" :max="10" label="描述文字"></el-input-number>
                                    </template>

                                </el-table-column>

                            </el-table>
                        </el-collapse-item>
                    </el-collapse>
                </el-form-item>
                <el-form-item label="项目服务" prop="services">
                    <el-collapse>
                        <el-collapse-item title="请选择项目服务" name="1">
                            <el-table
                                    :data="serviceList"
                                    border
                                    ref="multipleTable"
                                    @selection-change="handleSelectionChangeUp"
                                    style="width: 100%">
                                <el-table-column
                                        label="选择服务"
                                        type="selection">
                                </el-table-column>
                                <el-table-column
                                        prop="servicename"
                                        label="服务项目"
                                        width="150">
                                </el-table-column>
                            </el-table>
                        </el-collapse-item>
                    </el-collapse>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="commitUpdateUser">确 定</el-button>
                <el-button @click="updateVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        created() {
            this.getUserList();
            this.getProjectList();
            this.getServiceList();
        },
        data() {
            // // 验证手机号的规则
            var checkMobile = (rule, value, cb) => {
                // 验证手机号的正则表达式
                const regMobile = new RegExp("^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*))$")

                if (regMobile.test(value)) {
                    return cb()
                }

                cb(new Error('请输入合法的金额'))
            }
            return {
                // 修改的状态
                updateVisible: false,
                open: true,
                num: 0,
                //新增的状态
                insertVisible: false,
                close: false,
                //查询的参数
                queryInfo: {
                    page: 1,
                    limit: 10,
                    projectname: ''
                },
                userList: [],
                projectList: [],
                serviceList: [],
                total: 0,
                // 新增用户数据
                RegistForm: {
                    projectname: '',
                    projectunit: '',
                    projectmoney: '',
                    goods: [],
                    services: [],
                },
                //修改的数据
                updateForm: {
                    projectcode: '',
                    projectname: '',
                    projectunit: '',
                    projectmoney: '',
                    goods: [],
                    services: [],
                    choioseService: [],
                    id: ''
                },
                //修改校验规则
                updateFormRules: {
                    projectname: [
                        {required: true, message: '请输入项目名', trigger: 'blur'},
                    ],
                    projectunit: [
                        {required: true, message: '项目单位', trigger: 'blur'},
                    ],
                    projectmoney: [
                        {required: true, message: '项目价格', trigger: 'blur'},
                        {validator: checkMobile, trigger: 'blur'}
                    ]
                },

                //新增校验规则
                registRules: {
                    projectname: [
                        {required: true, message: '请输入项目名', trigger: 'blur'},
                    ],
                    projectunit: [
                        {required: true, message: '项目单位', trigger: 'blur'},
                    ],
                    projectmoney: [
                        {required: true, message: '项目价格', trigger: 'blur'},
                        {validator: checkMobile, trigger: 'blur'}
                    ]
                }
            }
        },
        mounted() {

        },
        methods: {
            first(rows){
                console.log(1)
                this.$nextTick(()=>{
                    rows.forEach(row => {
                        console.log(row)
                        this.$refs.multipleTable.toggleRowSelection(row,true);
                    });
                })
            },
            handleSelectionChange(val) {
                this.RegistForm.services = val
            },
            handleSelectionChangeUp(val) {
                this.updateForm.services = val
            },
            handleChange(row) {
                var flag = true;
                console.log(row)
                if (this.RegistForm.goods.length > 0) {
                    for (var i = 0; i < this.RegistForm.goods.length; i++) {
                        if (this.RegistForm.goods[i].id == row.id) {
                            this.RegistForm.goods[i].count = row.count
                            flag = false
                            break
                        }
                    }
                }
                if (flag) {
                    var row1 = {}
                    row1.id = row.id
                    row1.count = row.count
                    row1.goodsName = row.goodsname
                    this.RegistForm.goods.push(row1)
                }
            },
            // 根据Id删除对应的用户信息
            async removeUserById(id) {
                // 弹框询问用户是否删除数据
                const confirmResult = await this.$confirm(
                    '此操作将永久删除该用户, 是否继续?',
                    '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).catch(err => err)

                // 如果用户确认删除，则返回值为字符串 confirm
                // 如果用户取消了删除，则返回值为字符串 cancel
                if (confirmResult !== 'confirm') {
                    return this.$message.info('已取消删除')
                }

                var data = await this.$http.get('/project/delete?id=' + id)

                if (data.data.code !== 200) {
                    return this.$message.error('删除用户失败！')
                }

                this.$message.success('删除用户成功！')
                this.getUserList()
            },
            //通过id查询数据并打开修改页面赋值进去
            async updateUser(id) {
                var data = await this.$http.get('/project/query?id=' + id)
                if (data.data.code != 200) return this.$message.error(data.data.msg);
                this.updateForm.projectcode = data.data.data.projectcode
                this.updateForm.projectname = data.data.data.projectname
                this.updateForm.projectunit = data.data.data.projectunit
                this.updateForm.projectmoney = data.data.data.projectmoney
                this.updateForm.goods = data.data.data.goods
                for (var i = 0; i < this.projectList.length; i++) {
                    var flag = true
                    for (var j = 0; j < this.updateForm.goods.length; j++) {
                        if (this.updateForm.goods[j].id == this.projectList[i].id) {
                            flag = false
                            break
                        }
                    }
                    if (flag) {

                        this.projectList[i].goodsName = this.projectList[i].goodsname
                        console.log(this.projectList[i].goodsName)
                        this.updateForm.goods.push(this.projectList[i])
                    }
                }
                this.updateForm.services = this.serviceList
                var list = []
                for (var i = 0; i <  this.serviceList.length ; i++) {
                    for (var j = 0; j <data.data.data.services.length ; j++) {
                        if(this.serviceList[i].servicecode==data.data.data.services[j].servicecode){
                            list.push( this.serviceList[i])
                        }
                    }
                }
                this.first(list)
                this.updateForm.id = data.data.data.id
                this.updateVisible = true
            },


            //查询产品列表
            async getProjectList() {
                var data = await this.$http.get('/stock/queryList', {params: this.queryInfo})
                this.projectList = data.data.data.rows
                this.projectList.map(v => {
                    this.$set(v, 'count', 0)
                });
            },
            //查询服务列表
            async getServiceList() {
                var data = await this.$http.get('/query', {params: this.queryInfo})
                this.serviceList = data.data.data
            },
            //提交修改
            commitUpdateUser() {
                //预校验
                this.$refs.updateFormRef.validate(async valid => {
                    if (!valid) return;
                    //取消0的商品
                    var goods = []
                    for (var i = 0; i < this.updateForm.goods.length; i++) {
                        if (this.updateForm.goods[i].count != 0) {
                            goods.push(this.updateForm.goods[i])
                        }
                    }
                    this.updateForm.goods = goods
                    var data = await this.$http.post('/project/update', this.updateForm);
                    if (data.data.code != 200) return this.$message.error(data.data.msg);
                    this.$message.success('修改成功')
                    this.$refs.updateFormRef.resetFields()
                    this.updateVisible = false
                    this.getUserList()
                })
            },
            //修改页面关闭后清空数据
            updateClose() {
                this.$refs.updateFormRef.resetFields()
            },
            // 新增项目
            insertUser() {
                //预校验
                this.$refs.registFormRef.validate(async valid => {
                    if (!valid) return;
                    var data = await this.$http.post('/project/insert', this.RegistForm);
                    if (data.data.code != 200) return this.$message.error(data.data.msg);
                    this.$message.success('注册成功')
                    this.$refs.registFormRef.resetFields()
                    this.insertVisible = false
                    this.getProjectList()
                    this.getServiceList()
                    this.getUserList()
                })
            },
            changesWitch(stage) {
                if (stage.userSex == 0) {
                    stage.userSex = 1
                } else {
                    stage.userSex = 0
                }
            },
            // 分页组件中的条数的变更
            handleSizeChange(size) {
                this.queryInfo.limit = size
                this.getUserList()
            },
            // 分页组件中当前页码的变化
            handleCurrentChange(page) {
                this.queryInfo.page = page
                this.getUserList()
            },
            async getUserList() {
                var data = await this.$http.get('/project/queryList', {params: this.queryInfo})
                this.userList = data.data.data.rows
                this.total = data.data.data.total
            }
        }

    }
</script>
<!--scoped 代表当前页面生效-->
<style lang="less" scoped>
    .el-table {
        margin-top: 15px;
    }

    .nopadding {
        margin-right: 50px;
    }

    .rm {
        width: 40px;
    }

    .el-tag {
        margin-bottom: 5px;
    }
</style>
