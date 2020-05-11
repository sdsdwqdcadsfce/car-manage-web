<template>
    <div>
        <!--        面包屑导航-->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <!--            <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>-->
            <el-breadcrumb-item>车辆美容信息管理</el-breadcrumb-item>
            <el-breadcrumb-item>车辆美容信息列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--        卡片视图区-->
        <el-card>
            <!--            栅格布局-->
            <el-row :gutter="10" type="flex" justify="space-between">
                <!--                搜索区布局-->
                <el-col :span="8">
                    <el-input clearable @clear="getUserList" placeholder="请输入车辆编码查询支持模糊搜索" class="input-with-select"
                              v-model="queryInfo.carCode">

                    </el-input>
                </el-col>
                <el-col :span="16">
                    <div class="grid-content bg-purple">
                        <el-button type="primary" @click="getUserList">查询</el-button>
                    </div>
                </el-col>
                <el-col :span="3">
                    <div class="grid-content bg-purple">
                        <el-button type="primary" @click="insertVisible =true">新增信息</el-button>
                    </div>
                </el-col>
            </el-row>
            <!--            表格-->
            <el-table :data="userList" style="width: 100%" border fixed>
                <el-table-column label="#" type="index">
                </el-table-column>
                <el-table-column prop="businessDate" label="服务时间">
                </el-table-column>
                <el-table-column prop="carcode" label="车辆编码">
                </el-table-column>
                <el-table-column prop="carbeautyName" label="美容项目">
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
                title="新增服务"
                :visible.sync="insertVisible"
                :close-on-click-modal="false"
                width="50%">
            <el-form :model="RegistForm" :rules="registRules" ref="registFormRef" label-width="100px">
                <el-form-item label="业务时间" prop="RegistForm.businessDate">
                    <el-date-picker
                            v-model="RegistForm.businessDate"
                            type="date"
                            :picker-options="pickerOptions"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="车辆的编码" prop="carcode">
                    <el-input v-model="RegistForm.carcode"></el-input>
                </el-form-item>
                <el-form-item label="项目名称" prop="RegistForm.carbeautyid">
                    <el-select v-model="RegistForm.carbeautyid" placeholder="请选择项目名称" @click="queryProjectName()">
                        <el-option v-for="UserName in  projectNameList" :label="UserName.projectname"
                                   :value="UserName.id"></el-option>
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
                <el-form-item label="业务时间" prop="goodsdate">
                    <el-date-picker
                            v-model="updateForm.businessDate"
                            type="date"
                            :picker-options="pickerOptions"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="车辆的编码" prop="carcode">
                    <el-input v-model="updateForm.carcode"></el-input>
                </el-form-item>
                <el-form-item label="项目名称">
                    <el-select v-model="updateForm.carbeautyid" placeholder="请选择项目名称" @click="queryProjectName()">
                        <el-option v-for="UserName in  projectNameList" :label="UserName.projectname"
                                   :value="UserName.id"></el-option>
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
            this.queryProjectName();
        },
        data() {
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
                    carCode: ''
                },
                projectNameList: [],
                userList: [],
                total: 0,
                // 新增用户数据
                RegistForm: {
                    businessDate: '',
                    carcode: '',
                    carbeautyid: ''

                },
                //修改的数据
                updateForm: {
                    businessDate: '',
                    carcode: '',
                    carbeautyid: '',
                    id: ''
                },
                //修改校验规则
                updateFormRules: {
                    carcode: [
                        {required: true, message: '请输入车辆编码', trigger: 'blur'},
                    ]

                },
                //新增校验规则
                registRules: {
                    carcode: [
                        {required: true, message: '请输入车辆编码', trigger: 'blur'},
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

                var data = await this.$http.get('/carManage/delete?id=' + id)

                if (data.data.code !== 200) {
                    return this.$message.error('删除用户失败！')
                }

                this.$message.success('删除用户成功！')
                this.getUserList()
            },
            //通过id查询数据并打开修改页面赋值进去
            async updateUser(id) {
                console.log(id)
                var data = await this.$http.get('/carManage/query?id=' + id)
                if (data.data.code != 200) return this.$message.error(data.data.msg);
                this.updateForm.businessDate = data.data.data.businessDate
                this.updateForm.carcode = data.data.data.carcode
                this.updateForm.id = data.data.data.id
                this.updateForm.carbeautyid = data.data.data.carbeautyid
                console.log(data.data.data)
                this.updateVisible = true
            },
            //提交修改
            commitUpdateUser() {
                //预校验
                this.$refs.updateFormRef.validate(async valid => {
                    if (!valid) return;
                    var data = await this.$http.post('/carManage/update', this.updateForm);
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
                    var data = await this.$http.post('/carManage/insert', this.RegistForm);
                    if (data.data.code != 200) return this.$message.error(data.data.msg);
                    this.carUserNaneList = []
                    this.projectNameList = []
                    this.RegistForm.businessDate=''
                    this.RegistForm.carbeautyid=''
                    this.RegistForm.carcode=''

                    this.insertVisible = false
                    this.$message.success('新增成功')
                    this.$refs.registFormRef.resetFields()
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
                var data = await this.$http.get('/carManage/queryList', {params: this.queryInfo})
                console.log(this.userList)
                for (var i = 0; i < data.data.data.rows.length; i++) {
                    var carbeautyName = await this.$http.get('/project/query?id='+ data.data.data.rows[i].carbeautyid)
                    data.data.data.rows[i].carbeautyName=carbeautyName.data.data.projectname
                }
                this.userList = data.data.data.rows
                console.log(  this.userList)
                this.total = data.data.data.total
            },

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
