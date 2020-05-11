<template>
    <el-container class="el-container">
        <el-header class="el-header">
            <div>
                <img src="../assets/logo1.png">
                <span>后台管理系统</span>
            </div>
            <el-button type="info" @click="out">退出</el-button>
        </el-header>
        <el-container>
            <el-aside :width="iszhedie==true?'60px':'200px'" class="left-aside">
                <div class="zhedie" @click="zhediemenu">|||</div>
                <el-menu
                        class="el-menu-vertical-demo"
                        background-color="#545c64"
                        text-color="#fff"
                        :default-active="defaultAct"
                        active-text-color="#ffd04b" unique-opened :collapse=iszhedie :collapse-transition="false" router >
                    <el-submenu :index="item.menuCode" v-for="item in menuList">
                        <template slot="title">
                            <i :class="fontMap[item.menuCode]"></i>
                            <span>{{item.menuName}}</span>
                        </template>
                        <el-menu-item :index="child.emnuPath" v-for="child in item.children" @click="changeDefaultAct(child.emnuPath)">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{child.menuName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main class="right-aside">
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        created() {
            this.getMenuList()
            this.defaultAct=window.sessionStorage.getItem('defaultAct');
        },
        data() {
            return {
                iszhedie: false,
                defaultAct:'',
                menuList: [],
                fontMap: {
                    '1': 'iconfont icon-tijikongjian',
                    '2': 'iconfont icon-user',
                    '3': 'iconfont icon-users',
                    '4': 'iconfont icon-shangpin',
                    '5': 'iconfont icon-showpassword',
                    '6': 'iconfont icon-baobiao',
                    '7': 'iconfont icon-danju',
                    '8': 'iconfont icon-3702mima'
                }
            }
        },
        methods: {
            changeDefaultAct(act){
                window.sessionStorage.setItem('defaultAct',act)
                this.defaultAct=window.sessionStorage.getItem('defaultAct');
            },
            zhediemenu() {
                this.iszhedie = !this.iszhedie
            },
            out() {
                window.sessionStorage.clear()
                this.$router.push('/login')
            },
            async getMenuList() {
                var data = await this.$http.get('/getMenu')
                if (data.data.code != 200) return this.$message.error(data.data.msg);
                this.menuList = data.data.data
            }
        }

    }
</script>
<!--scoped 代表当前页面生效-->
<style lang="less" scoped>
    .el-container {
        height: 100%;
    }

    .el-header {
        background-color: #373d41;
        display: flex;
        justify-content: space-between;
        align-items: center;

    }

    .el-menu {
        border-right: 0
    }

    .el-header div {
        display: flex;
        align-items: center;
    }

    .el-header img {
        height: 50px;
    }

    .el-header span {
        text-align: center;
        color: #fff;
        font-size: 18px;
        margin-left: 15px;
    }

    .left-aside {
        background-color: #333744;
    }

    .right-aside {
        background-color: #eaedf1;
    }

    .iconfont {
        margin-right: 10px;
    }

    .zhedie {
        display: flex;
        justify-content: flex-end;
        letter-spacing: 0.2em;
        /*margin-right: 3px;*/
        color: #F1F3F4;
    }


</style>
