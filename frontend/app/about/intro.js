import React from 'react';
import { Carousel } from 'antd';
import './intro.css';

import 'antd/dist/antd.css';

class Intro extends React.Component{
    render(){
        return(
            <div id="intro">
                <Carousel autoplay={true} dots={true} effect="fade">
                    <div>
                        <div className="sentence">"政府对新闻及言论自由持宽容的态度，但是政府不能容忍言论的自由沦为制造谎言的自由，从而使它变成危害国家人民利益的工具。"</div>
                        <div className="author">——〔美〕马哈蒂尔：《西方新闻自由可能破坏发展中国家》</div>
                    </div>
                    <div>
                        <div className="sentence">"人必需有外部的刺激，必需有每天使他和全世界的事件发生联系的报纸，必需有杂志向他报告现代思想的动态。"</div>
                        <div className="author">——〔俄〕赫尔岑：《谁之罪》</div>
                    </div>
                    <div>
                        <div className="sentence">"在唤起民众、造成舆论方面，新闻媒介的力量远远超过总统。其原因很简单，新闻媒介总是拥有最后的说话权。"</div>
                        <div className="author">——〔美〕理查德·尼克松：《理查德·尼克松回忆录》</div>
                    </div>
                    <div>
                        <div className="sentence">"信仰的自由，教育的自由，言论的自由，集会的自由，这些是民主的基础。一且新闻的自由遭到严重的挑战时，这一切便会化为乌有。"</div>
                        <div className="author">——〔美〕罗斯福：《给H·哈定的信》</div>
                    </div>
                </Carousel>
            </div>
        );
    }
}

export default Intro;