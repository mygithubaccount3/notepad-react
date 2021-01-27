import ApiRequestService from './ApiRequestService';

class UsersService {
    /**
     * Sign up
     *
     * @param username
     * @param email
     * @param password
     */
    static async signUp(username, email, password) {
        return ApiRequestService.post('/signup', {email, username, password});
    }

    /**
     * Sign in
     *
     * @param email
     * @param password
     */
    static async signIn(email, password) {
        return ApiRequestService.post('/login', {email, password});
    }

    /**
     * Sign out
     */
    static async signOut() {
        return ApiRequestService.get('/logout');
    }

    /**
     * Get user by id
     *
     * @param id
     */
    static async get(id) {
        return ApiRequestService.get(`/user/${id}`);
    }
}

export default UsersService;
