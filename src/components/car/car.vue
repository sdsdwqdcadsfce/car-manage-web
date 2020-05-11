<template>
    <div>
        <!--        面包屑导航-->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <!--            <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>-->
            <el-breadcrumb-item>汽车信息管理</el-breadcrumb-item>
            <el-breadcrumb-item>汽车信息列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--        卡片视图区-->
        <el-card>
            <!--            栅格布局-->
            <el-row :gutter="10" type="flex" justify="space-between">
                <!--                搜索区布局-->
                <el-col :span="8">
                    <el-input clearable @clear="getUserList" placeholder="请输入车主姓名查询支持模糊查询" class="input-with-select"
                              v-model="queryInfo.carUserName">

                    </el-input>
                </el-col>
                <el-col :span="16">
                    <div class="grid-content bg-purple">
                        <el-button type="primary" @click="getUserList">查询</el-button>
                    </div>
                </el-col>
                <el-col :span="3">
                    <div class="grid-content bg-purple">
                        <el-button type="primary" @click="insertVisible =true">新增车辆</el-button>
                    </div>
                </el-col>
            </el-row>
            <!--            表格-->
            <el-table :data="userList" style="width: 100%" border fixed>
                <el-table-column label="#" type="index">
                </el-table-column>
                <el-table-column prop="carcode" label="汽车编号">
                </el-table-column>
                <el-table-column prop="carcolor" label="汽车颜色">
                </el-table-column>
                <el-table-column prop="cartype" label="汽车类型">
                </el-table-column>
                <el-table-column prop="carusername" label="车主姓名">
                </el-table-column>
                <el-table-column prop="carmodel" label="汽车型号">
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
                        <!--                        <el-tooltip content="分配权限" placement="top" :enterable="false">-->
                        <!--                            <el-button type="warning" icon="el-icon-s-tools" size="mini"></el-button>-->
                        <!--                        </el-tooltip>-->
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
                :close-on-click-modal="false"
                title="新增车辆"
                :visible.sync="insertVisible"
                width="50%">
            <el-form :model="RegistForm" :rules="registRules" ref="registFormRef" label-width="100px">

                <el-form-item label="汽车编码" prop="carcode">
                    <el-input v-model="RegistForm.carcode"></el-input>
                </el-form-item>
                <el-form-item label="汽车颜色" prop="carcolor">
                    <el-input v-model="RegistForm.carcolor"></el-input>
                </el-form-item>
                <el-form-item label="汽车类型" prop="cartype">
                    <el-input v-model="RegistForm.cartype"></el-input>
                </el-form-item>
                <el-form-item label="车主姓名">
                    <el-select v-model="RegistForm.carusername" placeholder="请选择车主姓名" @click="queryCarUserName()">
                        <el-option v-for="UserName in  carUserNaneList" :label="UserName.realname"
                                   :value="UserName.realname"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="车辆型号" prop="carmodel">
                    <el-input v-model="RegistForm.carmodel"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="insertVisible = false">取 消</el-button>
                <el-button type="primary" @click="insertUser">确 定</el-button>
           </span>

        </el-dialog>

        <!--        修改弹出框-->
        <el-dialog
                title="修改车辆"
                :visible.sync="updateVisible"
                :close-on-click-modal="false"
                width="50%" @close="updateClose">
            <el-form :model="updateForm" :rules="updateFormRules" ref="updateFormRef" label-width="70px">
                <el-form-item label="汽车编码" prop="carcode" >
                    <el-input v-model="updateForm.carcode" disabled></el-input>
                </el-form-item>
                <el-form-item label="汽车颜色" prop="carcolor">
                    <el-input v-model="updateForm.carcolor"></el-input>
                </el-form-item>
                <el-form-item label="汽车类型" prop="cartype">
                    <el-input v-model="updateForm.cartype"></el-input>
                </el-form-item>
                <el-form-item label="车主姓名">
                    <el-select v-model="updateForm.carusername" placeholder="请选择车主姓名" @click="queryCarUserName()">
                        <el-option v-for="UserName in  carUserNaneList" :label="UserName.realname"
                                   :value="UserName.realname"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="车辆型号" prop="carmodel">
                    <el-input v-model="updateForm.carmodel"></el-input>
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

        },
        data() {
            // 验证邮箱的规则
            var checkEmail = (rule, value, cb) => {
                // 验证邮箱的正则表达式
                const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

                if (regEmail.test(value)) {
                    // 合法的邮箱
                    return cb()
                }

                cb(new Error('请输入合法的邮箱'))
            }

            // // 验证手机号的规则
            var checkMobile = (rule, value, cb) => {
                // 验证手机号的正则表达式
                const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

                if (regMobile.test(value)) {
                    return cb()
                }

                cb(new Error('请输入合法的手机号'))
            }
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
                    carUserName: ''
                },
                userList: [],
                //车主姓名的数据级
                carUserNaneList: [],
                total: 0,
                // 新增用户数据
                RegistForm: {
                    carcode: '',
                    carcolor: '',
                    cartype: '',
                    carusername: '',
                    carmodel: ""
                },
                //修改的数据
                updateForm: {
                    carcode: '',
                    carcolor: '',
                    cartype: '',
                    carusername: '',
                    carmodel: "",
                    id: ''
                },
                //修改校验规则
                updateFormRules: {
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {validator: checkEmail, trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {validator: checkMobile, trigger: 'blur'}
                    ]
                },

                //新增校验规则
                registRules: {
                    carusername: [
                        {required: true, message: '请选择车主姓名', trigger: 'blur'},
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

                var data = await this.$http.get('/car/delete?id=' + id)

                if (data.data.code !== 200) {
                    return this.$message.error('删除用户失败！')
                }

                this.$message.success('删除用户成功！')
                this.getUserList()
            },
            //通过id查询数据并打开修改页面赋值进去
            async updateUser(id) {
                console.log(id)
                var data = await this.$http.get('/car/queryById?id='+id)
                if (data.data.code != 200) return this.$message.error(data.data.msg);
                console.log(data.data.data)
                this.updateForm.carcode = data.data.data.carcode
                this.updateForm.carcolor = data.data.data.carcolor
                this.updateForm.cartype = data.data.data.cartype
                this.updateForm.carusername = data.data.data.carusername
                this.updateForm.carmodel = data.data.data.carmodel
                this.updateForm.id = data.data.data.id
                this.updateVisible = true
            },
            //提交修改
            commitUpdateUser() {
                //预校验
                this.$refs.updateFormRef.validate(async valid => {
                    if (!valid) return;
                    var data = await this.$http.post('/car/update', this.updateForm);
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
            // 新增用户
            insertUser() {
                //预校验
                this.$refs.registFormRef.validate(async valid => {
                    if (!valid) return;
                    var data = await this.$http.post('/car/insert', this.RegistForm);
                    if (data.data.code != 200) return this.$message.error(data.data.msg);
                    this.$message.success('注册成功')
                    this.$refs.registFormRef.resetFields()
                    this.RegistForm.carusername='';
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
                var data = await this.$http.get('/car/queryList', {params: this.queryInfo})
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
