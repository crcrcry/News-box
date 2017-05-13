import React from 'react';
import Card from './card';

import 'antd/dist/antd.css';

class News extends React.Component {
    state = {
        cardArr: []
    }
    componentWillReceiveProps(nextProps){
        var cardArr;

        if(nextProps.column == "猜你喜欢"){
            // 临时请求新闻，而不是从传递过来的数组中获取，因为后端sql api较为强大，更方便得到想要的数据
            var columnInfo = nextProps.columnLikeRatio.slice(0);
            for(let item of columnInfo){
                item.reqCount = 0;
            }
            cardArr = [];
            for(let i = 0; i < 30; i++){
                let random = Math.random();
                let sum = 0;
                for(let item of columnInfo){
                    sum += item.ratio;
                    if(sum > random){
                        const url = 'http://127.0.0.1:3000/getone';
                        var req = new Request(url, {
                            method: 'POST',
                            body: `type=${item.type}&index=${item.reqCount++}`,
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        });

                        fetch(req).then((response) => {
                            return response.json();
                        }).then((data) => {
                            if(data.code == 0){
                                cardArr.push(
                                    <Card key={data.news.id} {...data.news} />
                                );
                                this.setState({
                                    cardArr: cardArr
                                })
                            }
                        });
                        break;
                    }
                }
            }
        }else{
            cardArr = nextProps.newsArr.map((item, index)=>{
                if(item.type == nextProps.column){
                    return (
                        <Card key={index} {...item}/>
                    );
                }
            });
            this.setState({
                cardArr: cardArr
            })
        }
    }
    render(){
        var display = (this.props.show == true) ? "block" : "none";

        return (
            <div style={{ width: '100%', height: '100%', position: 'relative', display: display }}>
                {this.state.cardArr}
            </div>
        );
    }
}

export default News;