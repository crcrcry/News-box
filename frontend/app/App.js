import React from 'react';
import { Layout, Menu, Icon, message } from 'antd';
import Cookie from 'js-cookie';

import Users from "./users/index"
import News from "./news/index";
import About from "./about/index";
import {updateCookie} from './users/api'


const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

import 'antd/dist/antd.css';
import './App.css';

class App extends React.Component {
    state = {
        loginShow: false,
        regShow: false,
        setShow: false,
        newsShow: true,
        aboutShow: false,
        collapsed: false,
        loginTextShow: true,
        mode: 'inline',
        newsArr: [],
        newsType: ["猜你喜欢", "头条", "社会", "国内", "国际", "娱乐", "体育", "军事", "科技", "财经", "时尚"],
        duringDays: 0,
        column: "头条",   //默认栏目头条
        columnLikeRatio: [],
    };
    onCollapse = (collapsed) => {
        this.setState({
            collapsed,
            mode: collapsed ? 'vertical' : 'inline',
            loginTextShow: !collapsed,
        });
    };
    handleClick = (event) => {
        var value = event.target.outerHTML;
        var nowState;
        if(value.includes("登陆")){
            nowState = {
                loginShow: true,
                regShow: false,
                setShow: false,
            };
        }else if(value.includes("注册")){
            nowState = {
                loginShow: false,
                regShow: true,
                setShow: false,
            };
        }else if(value.includes("个人设置")){
            nowState = {
                loginShow: false,
                regShow: false,
                setShow: true,
            };
        }else if(value.includes("新闻中心")||value.includes("global")){
            nowState = {
                loginShow: false,
                regShow: false,
                setShow: false,
                newsShow: true,
                aboutShow: false,
            }
        }else if(value.includes("关于")||value.includes("file")){
            nowState = {
                loginShow: false,
                regShow: false,
                setShow: false,
                newsShow: false,
                aboutShow: true,
            }
        }else{
            //新闻栏目
            let column = event.target.innerText;
            if(column == "猜你喜欢"){
                var userInfo = getUserInfo();
                if(userInfo == undefined){
                    message.warning('请您先登陆');
                }else{
                    updateCookie(userInfo.name, userInfo.email, (result) => {
                        nowState = {
                            loginShow: false,
                            regShow: false,
                            setShow: false,
                            newsShow: true,
                            aboutShow: false,
                        }

                        userInfo = getUserInfo();
                        nowState.column = "猜你喜欢";
                        var tmpLikeRatio = [{
                            type: "头条",
                            like: userInfo.like_top,
                            visit: userInfo.visit_top,
                            ratio: 0
                        },{
                            type: "社会",
                            like: userInfo.like_shehui,
                            visit: userInfo.visit_shehui,
                            ratio: 0
                        },{
                            type: "国内",
                            like: userInfo.like_guonei,
                            visit: userInfo.visit_guonei,
                            ratio: 0
                        },{
                            type: "国际",
                            like: userInfo.like_guoji,
                            visit: userInfo.visit_guoji,
                            ratio: 0
                        },{
                            type: "娱乐",
                            like: userInfo.like_yule,
                            visit: userInfo.visit_yule,
                            ratio: 0
                        },{
                            type: "体育",
                            like: userInfo.like_tiyu,
                            visit: userInfo.visit_tiyu,
                            ratio: 0
                        },{
                            type: "军事",
                            like: userInfo.like_junshi,
                            visit: userInfo.visit_junshi,
                            ratio: 0
                        },{
                            type: "科技",
                            like: userInfo.like_keji,
                            visit: userInfo.visit_keji,
                            ratio: 0
                        },{
                            type: "财经",
                            like: userInfo.like_caijing,
                            visit: userInfo.visit_caijing,
                            ratio: 0
                        },{
                            type: "时尚",
                            like: userInfo.like_shishang,
                            visit: userInfo.visit_shishang,
                            ratio: 0
                        }];
                        var maxVisit = getMaxOfArrObj(tmpLikeRatio, "visit");
                        var sumRatio = 0;

                        for(let item of tmpLikeRatio){
                            item.ratio = (0.5*item.visit/maxVisit) + (0.5*item.like/5);
                            sumRatio += item.ratio
                        }
                        for(let item of tmpLikeRatio){
                            item.ratio /= sumRatio;
                            item.ratio = Number.parseFloat(item.ratio.toFixed(2));
                        }
                        console.log(tmpLikeRatio);
                        nowState.columnLikeRatio = tmpLikeRatio.slice(0);
                        this.setState(nowState);
                    })
                }
            }else{
                nowState = {
                    loginShow: false,
                    regShow: false,
                    setShow: false,
                    newsShow: true,
                    aboutShow: false,
                    column: column,
                }
            }
        }
        this.setState(nowState);
    };
    handleModalCancel = () => {
        this.setState({
            loginShow: false,
            regShow: false,
            setShow: false,
        })
    };
    handleLoginToRegister = () => {
        this.setState({
            loginShow: false,
            regShow: true,
            setShow: false,
        })
    }
    componentDidMount() {
        const url = 'http://127.0.0.1:3000/init';
        var req = new Request(url, {method: 'GET',type:'json'});

        const mSecPerDay = 86400000;
        const startTime = new Date("Apr 6 2017");
        var nowTime = Date.now();
        var duringDays = (nowTime - startTime)/mSecPerDay;

        fetch(req).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);

            if(data.code == 0){
                this.setState({
                    newsArr: data.content,
                    duringDays: Number.parseInt(duringDays),
                })
            }else{
                alert("服务器响应错误");
            }
        })
    }
    render() {
        var userStateCSS = {
            margin: '10px 18px 6px 18px',
            textAlign: 'center',
            fontSize: '20px',
            fontFamily: '微软雅黑',
            color: '#ffffff',
            display: this.state.loginTextShow ? 'block' : 'none',
        }
        var newsNav = this.state.newsType.map((item, index) => {
            return(
                <Menu.Item key={index}><div onClick={this.handleClick}>{item}</div></Menu.Item>
            )
        })
        return (
            <Layout style={{ height: "100vh" }}>
                <Sider
                    collapsible
                    collapsed={this.state.collapsed}
                    onCollapse={this.onCollapse}
                >
                    <div className="logo" />
                    <div style={userStateCSS}>
                        {getWelcomedInfo()}
                        <hr style={{marginTop: '5px'}} />
                    </div>
                    <Menu theme="dark" mode={this.state.mode}>
                        <SubMenu
                            title={<div><Icon type="user" /><span className="nav-text">用户中心</span></div>}
                        >
                            <Menu.Item><div onClick={this.handleClick}>登陆</div></Menu.Item>
                            <Menu.Item><div onClick={this.handleClick}>注册</div></Menu.Item>
                            <Menu.Item><div onClick={this.handleClick}>个人设置</div></Menu.Item>
                        </SubMenu>

                        <SubMenu
                            title={<div onClick={this.handleClick}><Icon type="global" /><span className="nav-text">新闻中心</span></div>}
                        >
                            {newsNav}
                        </SubMenu>

                        <Menu.Item>
                                <div onClick={this.handleClick}>
                                    <Icon type="file" />
                                    <span className="nav-text">关于</span>
                                </div>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout style={{ background: "#fff"}}>
                    <Users loginShow={this.state.loginShow} regShow={this.state.regShow} setShow={this.state.setShow} cancel={this.handleModalCancel} loginToRegister={this.handleLoginToRegister}/>
                    <News newsArr={this.state.newsArr} show={this.state.newsShow} column={this.state.column} columnLikeRatio={this.state.columnLikeRatio} />
                    <About duringDays={this.state.duringDays} newsNum={this.state.newsArr.length} show={this.state.aboutShow} />
                </Layout>
            </Layout>
        );
    }
}

function getUserInfo() {
    var userInfo = Cookie.getJSON('userInfo');
    return userInfo;
}

function getWelcomedInfo() {
    var userInfo = getUserInfo();
    if(userInfo == undefined){
        return "您尚未登陆";
    }else{
        return "您好，"+userInfo.name;
    }
}

function getMaxOfArrObj(arr, property) {
    var result = 0;
    for(let item of arr){
        if(item[property] > result) result = item[property];
    }
    return result;
}

export default App;