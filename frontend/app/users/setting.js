import React from 'react';
import { Modal, message } from 'antd';
import Cookie from 'js-cookie';
import 'antd/dist/antd.css';


class Setting extends React.Component{
    state = {
        show: false,
        confirmLoading: false,
        values: [5,5,5,5,5,5,5,5,5,5],
    }
    type = ["头条", "社会", "国内", "国际", "娱乐", "体育", "军事", "科技", "财经", "时尚"];

    handleOk = () => {
        var userInfo = Cookie.getJSON('userInfo');
        const url = 'http://127.0.0.1:3000/setting';
        var req = new Request(url, {
            method: 'POST',
            body: `name=${userInfo.name}&settingArr=${this.state.values}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        fetch(req).then((response) => {
            return response.json();
        }).then((data) => {
            if(data.code == 0){
                Cookie.set('userInfo', data);
                message.success(data.msg);

                this.setState({
                    show: false,
                })

            }else{
                message.warning(data.msg);
            }
        });
    };

    handleChange = (event) => {
        var inputArr = event.target.parentNode.parentNode.childNodes;
        var changedValue = [];
        var i;
        for(i = 0; i < inputArr.length; i++){
            let tmpResult = inputArr[i].childNodes[6].value;
            tmpResult = tmpResult > 5 ? 5 : tmpResult;
            tmpResult = tmpResult < 0 ? 0 : tmpResult;
            changedValue[i] = tmpResult;
        }

        this.setState({
            values: changedValue,
        })
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.show != nextProps.show){
            var userInfo = Cookie.getJSON('userInfo')
            if(userInfo == undefined){
                message.warning("您好，请先登陆");
            }else{
                this.setState({
                    show: nextProps.show,
                    values: [userInfo.like_top, userInfo.like_shehui, userInfo.like_guonei, userInfo.like_guoji, userInfo.like_yule, userInfo.like_tiyu, userInfo.like_junshi, userInfo.like_keji, userInfo.like_caijing, userInfo.like_shishang]
                })
            }
        }
    }
    render() {
        var textCSS = {
            fontFamily: '微软雅黑',
            fontSize:  '18px',
            lineHeight: '24px',
            paddingBottom: '12px'
        };
        var settingArr = this.type.map((item, index) => {
            return (
                <div key={index} style={textCSS}>
                    {item}：<input id={index} type="number" value={this.state.values[index]} onChange={this.handleChange} />
                    {/* 不知道怎么用，index 传递不了 */}
                    {/*<Rate onChange={this.handleChange} value={this.state.values[index]} allowHalf />*/}
                </div>
            )
        })
        return (
            <Modal
                width={360}
                title="个人偏好设置"
                visible={this.state.show}
                onCancel={this.props.cancel}
                onOk={this.handleOk}
                confirmLoading={this.state.confirmLoading}
            >
                <div style={{margin: '24px 0px 24px 30px'}}>
                    {settingArr}
                </div>
            </Modal>
        );
    }
}

export default Setting;