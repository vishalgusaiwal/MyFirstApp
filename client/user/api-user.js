const create = async (user) => {
    try {
        let resp = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        return await resp.json();
    } catch (err) {
        console.log(err);
    }
}

const list = async (signal) => {
    try {
        let resp = await fetch('/api/users', {
            method: 'GET',
            signal: signal
        });
        resp = await resp.json();
        return resp;
    } catch (err) {
        console.log(err);
    }
}

const read = async (params, credentials, signal) => {
    try {
        let resp = await fetch('/api/users/' + params.userId, {
            method: 'GET',
            signal: signal,
            headers: {
                'Accept': 'application/json',
                'content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            }
        });
        resp = await resp.json();
        console.log(resp);
        return resp;
    } catch (err) {
        console.log(err);
    }
}

const update = async (params, credentials, user) => {
    try {
        let resp = await fetch('/api/users/' + params.userId, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + credentials.t
            },
            body: user
        });
        resp = await resp.json();
        return resp;
    } catch (err) {
        console.log(err);
    }
}

const remove = async (params, credentials) => {
    try {
        let resp = await fetch('/api/users/' + params.userId, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            }
        });
        return await resp.json();
    } catch (err) {
        console.log(err);
    }
}

const follow = async (params, credentials, followId) => {
    try {
        let resp = await fetch('/api/user/follow/', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            },
            body: JSON.stringify({ userId: params.userId, followId: followId })
        });
        resp = await resp.json();
        return resp;
    } catch (err) {
        console.log(err);
    }
}
const unfollow = async (params, credentials, unfollowId) => {
    try {
        let resp = await fetch('/api/user/unfollow/', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            },
            body: JSON.stringify({ userId: params.userId, unfollowId: unfollowId })
        });
        return await resp.json();
    } catch (err) {
        console.log(err);
    }
}

const findPeople = async (params, credentials, signal) => {
    try {
        let response = await fetch('/api/users/findPeople/' + params.userId, {
            method: 'GET',
            signal: signal,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            }
        });
        response = await response.json();
        return response;
    } catch (err) {
        console.log(err);
    }
}
export { create, list, read, update, remove, follow, unfollow, findPeople };