import React from 'react';
import {Modal, Alert} from 'antd';
import superagent from 'superagent';
import cheerio from 'cheerio';
import Cookie from 'js-cookie';
import 'antd/dist/antd.css';

// 暂时不考虑卡片打开后 内部的图
class Card extends React.Component{
    state = {
        imgRatio: "140%",
        imgOpacity: 1,
        textOpacity: 0,
        text: false,
        newsContent: "",
    }
    // 图片动效定时器
    timmer = {
        in: null,
        out: null,
    }
    mouseInImg = (event) => {
        // debug
        // console.log("in");
        // console.log(event.target);

        // 清除 鼠标离开 定时器
        if(this.timmer.out !== null){
            clearInterval(this.timmer.out);
        }
        // 图片变小，透明，文字浮现
        var nowRatio = Number.parseInt(this.state.imgRatio);
        var nowImgOpacity = this.state.imgOpacity;
        var nowTextOpacity = this.state.textOpacity;
        this.timmer.in = setInterval(()=>{
            if(nowRatio <= 120){
                clearInterval(this.timmer.in);
            }else{
                nowRatio--;
                nowImgOpacity-=0.015;
                nowTextOpacity+=0.045;
                this.setState({
                    imgRatio: nowRatio+"%",
                    imgOpacity: nowImgOpacity,
                    textOpacity: nowTextOpacity,
                })
            }
        },30);
    }
    mouseOutImg = (event) => {
        // debug
        // console.log("out");
        // console.log(event.target);

        // 清除 鼠标进入 定时器
        if(this.timmer.in !== null){
            clearInterval(this.timmer.in);
        }
        // 图片变大，不透明，文字淡出
        var nowRatio = Number.parseInt(this.state.imgRatio);
        var nowImgOpacity = this.state.imgOpacity;
        var nowTextOpacity = this.state.textOpacity;
        this.timmer.out = setInterval(()=>{
            if(nowRatio >= 140){
                clearInterval(this.timmer.out);
            }else{
                nowRatio++;
                nowImgOpacity+=0.015;
                nowTextOpacity-=0.045
                this.setState({
                    imgRatio: nowRatio+"%",
                    imgOpacity:nowImgOpacity,
                    textOpacity: nowTextOpacity,
                })
            }
        },30);
    }
    clickImg = (event) => {
        //将新闻内容爬虫下来
        superagent.get(this.props.url).end((err, sres) => {
            if(err){
                //error
            }

            var $ = cheerio.load(sres.text);
            var content = $('#content').text().trim();

            // JSX 默认转义所有字符串，需要 dangerouslySetInnerHTML
            var promise = new Promise((resolve, reject) => {
                resolve(content);
            });
            promise.then((data) => {
                // 中间有不可显字符
                var result = data.replace(/[\n\s]+/g, "<br />");
                return result;
            }).then((data) => {
                this.setState({
                    text: true,
                    newsContent: data,
                });
            })
        })

        //将用户操作放入数据库
        var userInfo = Cookie.getJSON('userInfo');
        var req;
        var req_body;
        if(userInfo == undefined){
            req_body = `newsID=${this.props.id}`;
        }else{
            req_body = `name=${userInfo.name}&newsID=${this.props.id}&column=${this.props.type}`;
        }
        req = new Request('http://127.0.0.1:3000/user_behaviour', {
            method: 'POST',
            body: req_body,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        fetch(req).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data.msg);
        })
    }
    handleCancel = (event) => {
        this.setState({
            text: false,
        });
    }
    render(){
        var cardCSS = {
            display: 'inline-block',
            width: '16.667%',
            height: '200px',
            overflow: 'hidden',
            background: '#000',
            cursor: "pointer",
        };
        var imageCSS = {
            width: this.state.imgRatio,
            height: this.state.imgRatio,
            opacity: this.state.imgOpacity,

            textAlign: 'center',
            verticalAlign: 'middle',
        };
        var typeAndTitleCSS = {
            opacity: this.state.textOpacity,

            width: '16.667%',
            height: '200px',
            fontSize: '20px',
            position: 'absolute',
            zIndex: '100',
            color: '#fff',
            textAlign: 'center',
            padding: '60px 1%',
        };
        var contentCSS = {
            padding: '10px 24px',
            fontFamily: '微软雅黑',
            fontSize: '20px',
            lineHeight: '40px'
        }
        var typeAndTitle = "["+this.props.type+"] "+this.props.title;
        return(
            <div style={cardCSS} onClick={this.clickImg} onMouseOver={this.mouseInImg} onMouseOut={this.mouseOutImg}>
                <div style={typeAndTitleCSS}>{typeAndTitle}</div>
                <div>
                    <img style={imageCSS} src={this.props.image}/>
                </div>
                <Modal
                    width="1100px"
                    title={typeAndTitle}
                    visible={this.state.text}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <div style={contentCSS}>
                        正文：
                        <div dangerouslySetInnerHTML={{__html: this.state.newsContent}} />

                        <span style={{paddingLeft: '630px'}}>
                            时间：{this.props.time}
                            <a target="_blank" href={this.props.url} style={{paddingLeft: '20px'}}>原文链接</a>
                        </span>
                    </div>
                </Modal>
            </div>
        );

    }
}

export default Card;