<template>
    <div class="login-continer">
        <div class="login_box">
            <div class="login-title">
                <img src="../assets/logo.png">
            </div>
            <el-form ref="loginFormRef"  label-width="0px" :model="loginForm" :rules="loginRules" class="formItems">
                <el-form-item prop="userName">
                    <el-input v-model="loginForm.userName" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <el-form-item prop="passWord">
                    <el-input type="passWord" v-model="loginForm.passWord" prefix-icon="iconfont icon-3702mima"></el-input>
                </el-form-item>
                <el-form-item class="buts">
                    <el-button type="primary" @click="login" >登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>

        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                loginForm: {
                    userName: '',
                    passWord: ''
                },
                loginRules: {
                    userName: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur'}
                    ],
                    passWord: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur'}
                    ]
                }
            }
        },
        methods:{
            resetLoginForm() {
                this.$refs.loginFormRef.resetFields()
            },
            login: function () {
                this.$refs.loginFormRef.validate(async valid => {
                    if (!valid) return;
                    var data = await this.$http.post('/worker/login', this.loginForm);
                   if(data.data.code!=200) return this.$message.error(data.data.msg);
                    this.$message.success('登陆成功')
                    window.sessionStorage.setItem('token',data.data.data)
                    this.$router.push('/home')
                })
            }
        }

    }
</script>
<!--scoped 代表当前页面生效-->
<style lang="less" scoped>
    .login-continer {
        background-color: #2b4b6b;
        height: 100%;
    }

    .login_box {
        background-color: #fff;
        width: 450px;
        height: 300px;
        position: absolute;
        left: 50%;
        top: 50%;
        border-radius: 3px;
        transform: translate(-50%, -50%);
    }

    .login-title {
        width: 130px;
        height: 130px;
        border-radius: 50%;
        /*border: 1px solid #ccc;*/
        padding: 10px;
        background-color: #fff;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 10px #eee;
    }

    .login-title img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
    }

    .formItems {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 10px 20px;
        box-sizing: border-box;
    }

    .buts {
        display: flex;
        justify-content: flex-end;
    }
</style>
