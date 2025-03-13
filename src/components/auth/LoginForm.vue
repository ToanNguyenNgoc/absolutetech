<template>
    <div class="login-container">
        <div class="login-box-wrapper">
            <div class="logo-login">
                <img :src="require('@/assets/logo.png')" alt="Logo" />
            </div>
            <form @submit.prevent="handleSubmit" class="login-box">
                <h1 class="login-title">Login</h1>
                <div class="form-container">
                    <!-- Field: Login Name -->
                    <div class="form-group">
                        <label for="username">Login Name</label>
                        <input id="username" type="text" v-model="username" @blur="validateLoginName"
                            :class="{ 'input-error': errors.username }" />
                        <p v-if="errors.username" class="error-text">
                            {{ errors.username }}
                        </p>
                    </div>

                    <!-- Field: Password -->
                    <div class="form-group">
                        <label for="password">Password</label>
                        <el-input id="password" v-model="password" type="password" show-password
                            @blur="validatePassword" :class="{ 'input-error': errors.password }" />
                        <p v-if="errors.password" class="error-text">
                            {{ errors.password }}
                        </p>
                    </div>
                    <div class="form-group">
                        <button type="submit" class="login-button" :disabled="!isFormValid"
                            :aria-disabled="!isFormValid">
                            Login
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>


<script>
import { login } from '@/api';
import { setCookie } from '@/utils/cookie';

export default {
    name: "LoginForm",
    props: {
        serverErrors: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            username: "",
            password: "",
            errors: {
                username: "",
                password: "",
            },
        };
    },
    computed: {
        isFormValid() {
            return (
                this.username.length > 0 &&
                this.password.length > 0 &&
                !this.errors.username &&
                !this.errors.password
            );
        },
    },
    watch: {
        serverErrors: {
            deep: true,
            immediate: true,
            handler(newVal) {
                if (newVal.username) {
                    this.errors.username = newVal.username;
                }
                if (newVal.password) {
                    this.errors.password = newVal.password;
                }
            },
        },
    },
    methods: {
        validateLoginName() {
            if (!this.username) {
                this.errors.username = "Login Name is required";
            } else {
                this.errors.username = "";
            }
        },
        validatePassword() {
            if (!this.password) {
                this.errors.password = "Password is required";
            } else {
                this.errors.password = "";
            }
        },
        async handleLogin(credentials) {
            try {
                const response = await login(credentials);
                const token = response.data.data.access_token;
                setCookie('access_token', token, 86400);
                this.$router.push('/admin/users');
            } catch (error) {
                if (error.response && error.response.data) {
                    const serverErrors = error.response.data.errors || [];
                    this.errors.username = "";
                    this.errors.password = "";
                    serverErrors.forEach((err) => {
                        if (err.field && err.message) {
                            if (Object.prototype.hasOwnProperty.call(this.errors, err.field)) {
                                this.errors[err.field] = err.message;
                            }
                        }
                    });
                } else {
                    console.error('Login error:', error);
                }
            }
        },
        handleSubmit() {
            this.validateLoginName();
            this.validatePassword();

            if (this.isFormValid) {
                this.handleLogin({
                    username: this.username,
                    password: this.password,
                });
            }
        },
    },
};
</script>

<style scoped>
:deep(:-webkit-autofill),
:deep(:-webkit-autofill:hover),
:deep(:-webkit-autofill:focus),
:deep(:-webkit-autofill:active) {
  box-shadow: 0 0 0px 1000px #F3F3F3 inset !important;
  -webkit-box-shadow: 0 0 0px 1000px #F3F3F3 inset !important;
}

.form-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 53px;
}

.login-box-wrapper {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
}

.form-group input {
    width: calc(100% - 16px);
    height: 46px;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 0 8px;
    background: var(--DRK-Lightest-grey, #F3F3F3);
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
}

.form-group input:focus {
    border: 1px solid var(--DRK-blue, #0080F6);
    outline: none;
}

:deep(.el-input ) {
    height: 46px;
}
:deep(.el-input__wrapper) {
    background: var(--DRK-Lightest-grey, #F3F3F3);
}
.input-error {
    border-color: red !important;
}
:deep(.input-error .el-input__wrapper) {
    box-shadow: 0 0 0 1px red inset;
}


.logo-login {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.logo-login img {
    display: block;
    width: 335px;
    height: 56px;
    margin-bottom: 75px;
}

.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
    background-image: url('@/assets/icon-bg-overlay.png');
    background-repeat: no-repeat;
    background-position: right center;
    background-size: contain;
}

.login-box {
    max-width: 500px;
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.25);
    padding: 40px;
    border-radius: 4px;
    background-color: #fff;
}

.login-title {
    color: #131d36;
    text-align: center;
    font-family: "Gotham", sans-serif;
    font-size: 24px;
    font-weight: 500;
    line-height: 140%;
    margin-bottom: 40px;
}

.form-group label {
    font-weight: 500;
    margin-bottom: 4px;
    display: block;
}

.error-text {
    color: red;
    font-size: 14px;
    margin-top: 4px;
}

.login-button {
    width: 100%;
    height: 48px;
    border-radius: 4px;
    border: none;
    color: #fff;
    font-family: "Gotham", sans-serif;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    background-color: #0080f6;
    margin-top: 34px;
}

.login-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

@media (max-width: 991px) {
    .login-box-wrapper {
        width: 100%;
        max-width: 500px;
        margin: 0 auto;
    }

    .login-box {
        max-width: 500px;
    }
}

@media (max-width: 640px) {
    .login-box-wrapper {
        width: 100%;
        max-width: 343px;
        margin: 0 auto;
    }

    .login-box {
        max-width: 343px;
        padding: 32px 16px;
    }

    .login-title {
        font-size: 24px;
        margin-bottom: 32px;
    }

    .login-button {
        font-size: 14px;
        height: 44px;
    }

    .login-button {
        color: #fff;
        font-size: 16px;
        cursor: pointer;
        background-color: #0080f6;
        margin-top: 24px;
    }
}
</style>