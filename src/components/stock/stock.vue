<template>
    <div>
        <!--        面包屑导航-->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <!--            <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>-->
            <el-breadcrumb-item>库存管理</el-breadcrumb-item>
            <el-breadcrumb-item>库存列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--        卡片视图区-->
        <el-card>
            <!--            栅格布局-->
            <el-row :gutter="10" type="flex" justify="space-between">
                <!--                搜索区布局-->
                <el-col :span="8">
                    <el-input clearable @clear="getUserList" placeholder="请输入商品名称查询支持模糊查询" class="input-with-select"
                              v-model="queryInfo.goodsName">

                    </el-input>
                </el-col>
                <el-col :span="16">
                    <div class="grid-content bg-purple">
                        <el-button type="primary" @click="getUserList">查询</el-button>
                    </div>
                </el-col>
                <el-col :span="3">
                    <div class="grid-content bg-purple">
                        <el-button type="primary" @click="insertVisible =true">新增商品</el-button>
                    </div>
                </el-col>
            </el-row>
            <!--            表格-->
            <el-table :data="userList" style="width: 100%" border fixed>
                <el-table-column label="#" type="index">
                </el-table-column>
                <el-table-column prop="goodsid" label="商品编码">
                </el-table-column>
                <el-table-column prop="goodsname" label="商品名名">
                </el-table-column>
                <el-table-column prop="goodsdate" label="进货时间">
                </el-table-column>
                <el-table-column prop="goodscount" label="商品数量">
                </el-table-column>
                <el-table-column prop="suppliername" label="供应商">
                </el-table-column>
                <el-table-column prop="goodsmoney" label="商品价格">
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
                <el-form-item label="商品名称" prop="goodsname">
                    <el-input v-model="RegistForm.goodsname"></el-input>
                </el-form-item>
                <el-form-item label="进货时间" prop="goodsdate">
                    <el-date-picker
                            v-model="RegistForm.goodsdate"
                            type="date"
                            :picker-options="pickerOptions"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="商品数量" prop="goodscount">
                    <el-input v-model="RegistForm.goodscount"></el-input>
                </el-form-item>
                <el-form-item label="供应商" prop="suppliername">
                    <el-input v-model="RegistForm.suppliername"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="goodsmoney">
                    <el-input v-model="RegistForm.goodsmoney"></el-input>
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
                :visible.sync="updateVisible"
                :close-on-click-modal="false"
                width="50%" @close="updateClose">
            <el-form :model="updateForm" :rules="updateFormRules" ref="updateFormRef" label-width="100px">
                <el-form-item label="商品编码">
                    <el-input v-model="updateForm.goodsid" disabled></el-input>
                </el-form-item>
                <el-form-item label="商品名称" prop="goodsname">
                    <el-input v-model="updateForm.goodsname" disabled></el-input>
                </el-form-item>
                <el-form-item label="进货时间" prop="goodsdate">
                    <el-date-picker
                            v-model="updateForm.goodsdate"
                            type="date"
                            :picker-options="pickerOptions"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="供应商名称">
                    <el-input v-model="updateForm.suppliername"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="goodsmoney">
                    <el-input v-model="updateForm.goodsmoney"></el-input>
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
        },
        data() {
            // 验证邮箱的规则
            var checkEmail = (rule, value, cb) => {
                // 验证邮箱的正则表达式
                const regEmail =  new RegExp('^\\+?[1-9][0-9]*$')

                if (regEmail.test(value)) {
                    // 合法的邮箱
                    return cb()
                }

                cb(new Error('请输入正整数'))
            }

            // // 验证手机号的规则
            var checkMobile = (rule, value, cb) => {
                // 验证手机号的正则表达式
                const regMobile =  new RegExp("^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*))$")

                if (regMobile.test(value)) {
                    return cb()
                }

                cb(new Error('请输入合法的金额'))
            }
            return {
                //时间插件要求今天以前的数据
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
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
                    goodsName: ''
                },
                userList: [],
                total: 0,
                // 新增用户数据
                RegistForm: {
                    goodsname: '',
                    goodsdate: '',
                    goodscount: '',
                    suppliername: '',
                    goodsmoney: ''
                },
                //修改的数据
                updateForm: {
                    goodsid: '',
                    goodsname: '',
                    goodsdate: '',
                    goodscount: '',
                    suppliername: '',
                    goodsmoney: '',
                    id: ''
                },
                //修改校验规则
                updateFormRules: {
                    goodsname: [
                        {required: true, message: '请输入商品名称', trigger: 'blur'},
                    ],
                    goodscount: [
                        {required: true, message: '请输入商品的数量', trigger: 'blur'},
                        {validator: checkEmail, trigger: 'blur'}
                    ],
                    goodsmoney: [
                        {required: true, message: '请输入商品的价格', trigger: 'blur'},
                        {validator: checkMobile, trigger: 'blur'}
                    ]
                },
                //新增校验规则
                registRules: {
                    goodsname: [
                        {required: true, message: '请输入商品名称', trigger: 'blur'},
                    ],
                    goodscount: [
                        {required: true, message: '请输入商品的数量', trigger: 'blur'},
                        {validator: checkEmail, trigger: 'blur'}
                    ],
                    goodsmoney: [
                        {required: true, message: '请输入商品的价格', trigger: 'blur'},
                        {validator: checkMobile, trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
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

                var data = await this.$http.get('/stock/delete?id=' + id)

                if (data.data.code !== 200) {
                    return this.$message.error('删除用户失败！')
                }

                this.$message.success('删除用户成功！')
                this.getUserList()
            },
            //通过id查询数据并打开修改页面赋值进去
            async updateUser(id) {
                console.log(id)
                var data = await this.$http.get('/stock/query?id=' + id)
                if (data.data.code != 200) return this.$message.error(data.data.msg);
                this.updateForm.goodsid = data.data.data.goodsid
                this.updateForm.goodsname = data.data.data.goodsname
                this.updateForm.goodsdate = data.data.data.goodsdate
                this.updateForm.goodscount = data.data.data.goodscount
                this.updateForm.suppliername = data.data.data.suppliername
                this.updateForm.goodsmoney = data.data.data.goodsmoney
                this.updateForm.id = data.data.data.id
                this.updateVisible = true
            },
            //提交修改
            commitUpdateUser() {
                //预校验
                this.$refs.updateFormRef.validate(async valid => {
                    if (!valid) return;
                    var data = await this.$http.post('/stock/update', this.updateForm);
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
                    this.RegistForm.goodscount=parseInt(this.RegistForm.goodscount)
                    console.log(this.RegistForm.goodscount)
                    var data = await this.$http.post('/stock/insert', this.RegistForm);
                    if (data.data.code != 200) return this.$message.error(data.data.msg);
                    this.$message.success('新增成功')
                    this.$refs.registFormRef.resetFields()
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
                var data = await this.$http.get('/stock/queryList', {params: this.queryInfo})
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
