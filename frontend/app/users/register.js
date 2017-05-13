import React from 'react';
import { Form, Input, Button, Modal, message } from 'antd';
import {login} from './api'
import 'antd/dist/antd.css';

const FormItem = Form.Item;


class RegisterForm extends React.Component{
    state = {
        show: false,
        confirmDirty: false,
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);

                // 若不设置 headers 则服务器的 body 无法正确解析
                const url = 'http://127.0.0.1:3000/register';
                var req = new Request(url, {
                    method: 'POST',
                    body: `name=${values.username}&password=${values.password}&email=${values.email}`,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });

                fetch(req).then((response) => {
                    return response.json();
                }).then((data) => {
                    if(data.code == 0){
                        //注册成功 帮助用户直接登陆
                        this.setState({
                            show: false,
                        })

                        message.success(data.msg + "，自动登录中", 1, () => {
                            login(values.username, values.password);
                        });
                    }else{
                        message.warning(data.msg);
                    }
                });
            }
        });
    }
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }
    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }
    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            show: nextProps.show
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 6,
                },
            },
        };
        return (
            <Modal
                width={720}
                title="用户注册"
                visible={this.state.show}
                onCancel={this.props.cancel}
                footer={null}
            >
                <div style={{margin: '40px 0px 48px 30px'}}>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem
                            {...formItemLayout}
                            label="Username"
                            hasFeedback
                        >
                            {getFieldDecorator('username', {
                                rules: [{
                                    required: true, message: 'Please input your Username!',
                                }, {
                                    max: 32, message: 'Username\'s length should be 1 to 32!'
                                }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="E-mail"
                            hasFeedback
                        >
                            {getFieldDecorator('email', {
                                rules: [{
                                    type: 'email', message: 'The input is not valid E-mail!',
                                }, {
                                    required: true, message: 'Please input your E-mail!',
                                }, {
                                    max: 64, message: 'Email\'s length should be 1 to 64!'
                                }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Password"
                            hasFeedback
                        >
                            {getFieldDecorator('password', {
                                rules: [{
                                    required: true, message: 'Please input your password!',
                                }, {
                                   min: 6, max: 32, message: 'Password\'s length should be 6 to 32!'
                                }, {
                                    validator: this.checkConfirm,
                                }],
                            })(
                                <Input type="password" />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Confirm Password"
                            hasFeedback
                        >
                            {getFieldDecorator('confirm', {
                                rules: [{
                                    required: true, message: 'Please confirm your password!',
                                }, {
                                    validator: this.checkPassword,
                                }],
                            })(
                                <Input type="password" onBlur={this.handleConfirmBlur} />
                            )}
                        </FormItem>
                        <FormItem {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" size="large">注册</Button>
                        </FormItem>
                    </Form>
                </div>
            </Modal>
        );
    }
}

const Register = Form.create()(RegisterForm);

export default Register;