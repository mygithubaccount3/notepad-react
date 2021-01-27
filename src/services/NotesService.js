import ApiRequestService from './ApiRequestService';

class NotesService {
    /**
     * Fetch list of notifications
     *
     * @param data
     * @param endpoint
     */
    static async list(data = {}, endpoint = '/en/notes') {
        return ApiRequestService.get(endpoint, data);
    }

    /**
     * Store notes by uid
     *
     * @param note
     */
    static async store(note) {
        return ApiRequestService.post(`/en/notes`, note);
    }

    /**
     * Fetch note by uid
     *
     * @param uid
     */
    static async read(uid, locale) {
        return ApiRequestService.get(`/${locale}/notes/${uid}`);
    }

    /**
     * Edit note
     *
     * @param uid
     * @param locale
     */
    static async edit(uid, locale) {
        return ApiRequestService.get(`/${locale}/notes/${uid}/edit`);
    }

    /**
     * Update note by uid
     *
     * @param note
     */
    static async update(note) {
        return ApiRequestService.patch(`/en/notes/${note.uid}`, note);
    }

    /**
     * Delete note by uid
     *
     * @param uid
     * @param endpoint
     */
    static async delete(uid, endpoint) {
        return ApiRequestService._delete(`${endpoint}/${uid}`);
    }
}

export default NotesService;
