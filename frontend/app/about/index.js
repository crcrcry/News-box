import React from 'react';

import Intro from './intro';
import Statistics from './statistics';

class About extends React.Component{
    render(){
        var display = (this.props.show == true) ? "block" : "none";
        return(
            <div style={{display: display}}>
                <Intro/>
                <Statistics duringDays={this.props.duringDays}  newsNum={this.props.newsNum} />
            </div>
        )
    }
}

export default About;