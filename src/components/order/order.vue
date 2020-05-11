<template>
    <div>
        <!--        面包屑导航-->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <!--            <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>-->
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--        卡片视图区-->
        <el-card>
            <!--            栅格布局-->
            <el-row :gutter="10" type="flex" justify="space-between">
                <!--                搜索区布局-->
                <el-col :span="8">
                    <el-input clearable @clear="getUserList" placeholder="请输入订单编号查询" class="input-with-select"
                              v-model="queryInfo.ordercode">

                    </el-input>
                </el-col>
                <el-col :span="16">
                    <div class="grid-content bg-purple">
                        <el-button type="primary" @click="getUserList">查询</el-button>
                    </div>
                </el-col>
                <el-col :span="3">
                    <div class="grid-content bg-purple">
                        <el-button type="primary" @click="insertVisible =true">新增订单</el-button>
                    </div>
                </el-col>
            </el-row>
            <!--            表格-->
            <el-table :data="userList" style="width: 100%" border fixed>
                <el-table-column label="#" type="index">
                </el-table-column>
                <el-table-column prop="ordercode" label="订单编码">
                </el-table-column>
                <el-table-column prop="ordername" label="订单名称">
                </el-table-column>
                <el-table-column prop="usercode" label="用户编码">
                </el-table-column>
                <el-table-column prop="username" label="用户名称">
                </el-table-column>
                <el-table-column prop="projectcode" label="项目编码">
                </el-table-column>
                <el-table-column prop="projectname" label="项目名称">
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
                title="新增订单"
                :visible.sync="insertVisible"
                :close-on-click-modal="false"
                width="50%">
            <el-form :model="RegistForm" :rules="registRules" ref="registFormRef" label-width="100px">
                <el-form-item label="订单名称" prop="ordername">
                    <el-input v-model="RegistForm.ordername"></el-input>
                </el-form-item>
                <el-form-item label="用户名称" >
                    <el-select v-model="RegistForm.usercode" placeholder="请选择用户姓名" @click="queryCarUserName()">
                        <el-option v-for="UserName in  carUserNaneList" :label="UserName.realname"
                                   :value="UserName.usercode"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="项目名称" >
                    <el-select v-model="RegistForm.projectcode" placeholder="请选择项目名称" @click="queryProjectName()">
                        <el-option v-for="UserName in  projectNameList" :label="UserName.projectname"
                                   :value="UserName.projectcode"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="insertUser">确 定</el-button>
                <el-button @click="insertVisible = false">取 消</el-button>
           </span>
        </el-dialog>

        <!--        修改弹出框-->
        <el-dialog
                title="修改订单"
                :visible.sync="updateVisible"
                :close-on-click-modal="false"
                width="50%" @close="updateClose">
            <el-form :model="updateForm" :rules="updateFormRules" ref="updateFormRef" label-width="100px">
                <el-form-item label="商品编码" prop="ordercode">
                    <el-input v-model="updateForm.ordercode" disabled></el-input>
                </el-form-item>
                <el-form-item label="订单名称" prop="ordername">
                    <el-input v-model="updateForm.ordername"></el-input>
                </el-form-item>
                <el-form-item label="用户名称">
                    <el-select v-model="updateForm.username" placeholder="请选择用户姓名" @click="queryCarUserName()">
                        <el-option v-for="UserName in  carUserNaneList" :label="UserName.realname"
                                   :value="UserName.realname"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="项目名称">
                    <el-select v-model="updateForm.projectname" placeholder="请选择项目名称" @click="queryCarUserName()">
                        <el-option v-for="UserName in  carUserNaneList" :label="UserName.realname"
                                   :value="UserName.realname"></el-option>
                    </el-select>
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
            this.queryCarUserName();
            this.queryProjectName();
        },
        data() {
            return {
                // 修改的状态
                updateVisible: false,
                open: true,
                //新增的状态
                insertVisible: false,
                close: false,
                //查询的参数
                queryInfo: {
                    page: 1,
                    limit: 10,
                    ordercode: ''
                },
                carUserNaneList:[],
                projectNameList:[],
                userList: [],
                total: 0,
                // 新增用户数据
                RegistForm: {
                    ordername: '',
                    usercode: '',
                    projectcode: ''

                },
                //修改的数据
                updateForm: {
                    username:'',
                    projectname:'',
                    ordercode:'',
                    ordername: '',
                    usercode: '',
                    projectcode: '',
                    id: ''
                },
                //修改校验规则
                updateFormRules: {
                    ordername: [
                        {required: true, message: '请输入订单名称', trigger: 'blur'},
                    ],
                    projectcode: [
                        {required: true, message: '请输入项目名称', trigger: 'blur'},
                    ],
                    usercode: [
                        {required: true, message: '请输入所属用户', trigger: 'blur'},
                    ]
                },
                //新增校验规则
                registRules: {
                    ordername: [
                        {required: true, message: '请输入订单名称', trigger: 'blur'},
                    ],
                    projectcode: [
                        {required: true, message: '请输入项目名称', trigger: 'blur'},
                    ],
                    usercode: [
                        {required: true, message: '请输入所属用户', trigger: 'blur'},
                    ]
                }
            }
        },
        methods: {
            //点击后查询车辆的车主信息
            async queryCarUserName() {
                var data = await this.$http.get('/user/queryUser')

                if (data.data.code !== 200) {
                    return this.$message.error('获取用户编码失败失败！')
                }
                this.carUserNaneList = data.data.data;
                console.log(this.carUserNaneList)
            },
            //点击后查询项目的信息
            async queryProjectName() {
                var data = await this.$http.get('/project/queryName')

                if (data.data.code !== 200) {
                    return this.$message.error('获取用户编码失败失败！')
                }
                this.projectNameList = data.data.data;
                console.log(this.projectNameList)
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
                // console.log(confirmResult)
                if (confirmResult !== 'confirm') {
                    return this.$message.info('已取消删除')
                }

                var data = await this.$http.get('/order/delete?id=' + id)

                if (data.data.code !== 200) {
                    return this.$message.error('删除用户失败！')
                }

                this.$message.success('删除用户成功！')
                this.getUserList()
            },
            //通过id查询数据并打开修改页面赋值进去
            async updateUser(id) {
                console.log(id)
                var data = await this.$http.get('/order/query?id=' + id)
                if (data.data.code != 200) return this.$message.error(data.data.msg);
                this.updateForm.ordername = data.data.data.ordername
                this.updateForm.ordercode = data.data.data.ordercode
                this.updateForm.username = data.data.data.username
                this.updateForm.projectname = data.data.data.projectname
                this.updateForm.usercode = data.data.data.usercode
                this.updateForm.projectcode = data.data.data.projectcode
                this.updateForm.id = data.data.data.id
                console.log(data.data.data)
                this.updateVisible = true
            },
            //提交修改
            commitUpdateUser() {
                //预校验
                this.$refs.updateFormRef.validate(async valid => {
                    if (!valid) return;
                    var data = await this.$http.post('/order/update', this.updateForm);
                    if (data.data.code != 200) return this.$message.error(data.data.msg);
                    this.updateVisible = false
                    this.$message.success('修改成功')
                    this.$refs.updateFormRef.resetFields()
                    this.getUserList()
                })
            },
            //修改页面关闭后清空数据
            updateClose() {
                this.$refs.updateFormRef.resetFields()
            },
            // 新增用户
            insertUser() {
                //预校验
                this.$refs.registFormRef.validate(async valid => {
                    if (!valid) return;
                    this.RegistForm.goodscount = parseInt(this.RegistForm.goodscount)
                    console.log(this.RegistForm.goodscount)
                    var data = await this.$http.post('/order/insert', this.RegistForm);
                    if (data.data.code != 200) return this.$message.error(data.data.msg);
                    this.$message.success('注册成功')
                    this.$refs.registFormRef.resetFields()
                    this.carUserNaneList=[]
                    this.projectNameList=[]
                    this.insertVisible = false
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
                var data = await this.$http.get('/order/queryList', {params: this.queryInfo})
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

</style>
