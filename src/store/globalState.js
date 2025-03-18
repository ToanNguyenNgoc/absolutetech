import { reactive } from "vue";

export const globalState = reactive({
    userInfo: null,
    setUser(user) {
        globalState.userInfo = user;
    },
    clearUser() {
        globalState.userInfo = null;
    }
});
