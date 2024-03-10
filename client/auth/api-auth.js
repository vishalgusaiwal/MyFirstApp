const signin = async (user) => {
    try {
        let resp = await fetch('/auth/signin', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(user)
        });
        resp = await resp.json();
        console.log(resp);
        return resp;
    } catch (err) {
        console.log(err);
    }
}

const signout = async () => {
    try {
        let resp = await fetch('/auth/signout/', {
            method: 'GET'
        });
        return await resp.json();
    } catch (err) {
        console.log(err);
    }
}

export { signin, signout };