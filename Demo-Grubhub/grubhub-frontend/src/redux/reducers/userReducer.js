const initState = {
    username: "",
    authFlag: ""
}

const userReducer = (state = initState, action) => {
    switch (action.type) {
        case 'CREATE_SESSION':
            let username = action.user.username;
            let authFlag = action.user.authFlag;
            return {
                username: username,
                authFlag: authFlag
            }
        default:
            console.log(state);
            return state    
    }
};

export default userReducer;