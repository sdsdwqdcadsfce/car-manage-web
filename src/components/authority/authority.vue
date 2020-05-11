<template>
    <div>
        <!--        面包屑导航-->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <!--            <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>-->
            <el-breadcrumb-item>权限设置</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--        卡片视图区-->
        <el-card>
            <!--            栅格布局-->
            <el-row :gutter="10" type="flex" justify="space-between">
                <!--                搜索区布局-->
                <el-col :span="8">
                    <el-input clearable @clear="getUserList" placeholder="请输入员工账号查询支持模糊查询" class="input-with-select"
                              v-model="queryInfo.workerName">
                    </el-input>
                </el-col>
                <el-col :span="16">
                    <div class="grid-content bg-purple">
                        <el-button type="primary" @click="getUserList">查询</el-button>
                    </div>
                </el-col>
            </el-row>
            <!--            表格-->
            <el-table :data="userList" style="width: 100%" border fixed>
                <el-table-column label="#" type="index">
                </el-table-column>
                <el-table-column prop="workercode" label="员工编号">
                </el-table-column>
                <el-table-column prop="workername" label="员工姓名">
                </el-table-column>
                <el-table-column prop="workerauthority" label="员工权限">
                    <template slot-scope="scope">
                        <el-switch v-if="scope.row.workerauthority!='3' " active-text="管理权限" inactive-text="普通权限"
                                   v-model='scope.row.workerauthority==1?open:close' @change="changesWitch(scope.row)">
                        </el-switch>
                        <el-switch v-if="scope.row.workerauthority=='3' " active-color="#13ce66" active-text="超级权限"
                                   disabled v-model='root'>
                        </el-switch>
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
    </div>
</template>

<script>
    export default {
        created() {
            this.getUserList();
        },
        data() {
            return {
                //查询的参数
                queryInfo: {
                    page: 1,
                    limit: 10,
                    workerName: ''
                },
                updateForm: {
                    workercode: '',
                    workername: '',
                    workerauthority: ''
                },
                root: true,
                userList: [],
                total: 0,
                open: true,
                close: false
            }
        },
        methods: {
            //权限控制
            changesWitch(stage) {
                if (stage.workerauthority == 0) {
                    stage.workerauthority = 1
                    this.updateForm.workercode = stage.workercode
                    this.updateForm.workername = stage.workerName
                    this.updateForm.workerauthority = stage.workerauthority
                    this.commitUpdateUser();
                } else {
                    stage.workerauthority = 0
                    this.updateForm.workercode = stage.workercode
                    this.updateForm.workername = stage.workerName
                    this.updateForm.workerauthority = stage.workerauthority
                    this.commitUpdateUser();
                }
            },
            //提交修改
            async commitUpdateUser() {
                var data = await this.$http.get('/authority/updateWorkerAuthority?workerCode='+this.updateForm.workercode+'&authority='+this.updateForm.workerauthority);
                if (data.data.code != 200) return this.$message.error(data.data.msg);
                this.$message.success('修改成功')
                this.getUserList()
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
                var data = await this.$http.get('/authority/queryList', {params: this.queryInfo})
                this.userList = data.data.data.rows
                console.log(this.userList)
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
