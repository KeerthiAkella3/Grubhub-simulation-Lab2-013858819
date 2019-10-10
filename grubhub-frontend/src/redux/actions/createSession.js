export const createSession = (user) => {
    return {
        type: 'CREATE_SESSION',
        user
    }
}

export default createSession;