import {message} from 'antd';
import Cookie from 'js-cookie';

function login(username, password, callback) {
    const url = 'http://127.0.0.1:3000/login';
    var req = new Request(url, {
        method: 'POST',
        body: `name=${username}&password=${password}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    fetch(req).then((response) => {
        return response.json();
    }).then((data) => {
        if(data.code == 0){
            //登陆成功，将用户数据写入cookie
            Cookie.set('userInfo', data);

            message.success('登陆成功，切换用户请再次点击登陆', 3);
            if(callback)    callback(true);
        }else{
            message.warning(data.msg);
            if(callback)    callback(false);
        }
    });
}

function updateCookie(username, email, callback) {
    const url = 'http://127.0.0.1:3000/update_cookie';
    var req = new Request(url, {
        method: 'POST',
        body: `name=${username}&email=${email}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    fetch(req).then((response) => {
        return response.json();
    }).then((data) => {
        if(data.code == 0){
            //登陆成功，将用户数据写入cookie
            Cookie.set('userInfo', data);

            if(callback)    callback(true);
        }else{
            console.log("更新 cookie 失败");
            if(callback)    callback(false);
        }
    });
}

export {login, updateCookie};