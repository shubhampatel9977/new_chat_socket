import { BASE_URL } from '..';

function setImagePath(path) {
    if (path == null || path == undefined || path == '') {
        return null;
    } else {
        return `${BASE_URL}/${path}`
    }
}

export default setImagePath;