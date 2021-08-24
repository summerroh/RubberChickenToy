import React, {Component} from 'react';
import Loading from './Loading';
import Chicken from './Chicken';

export default class App extends Component{
  state = {
    isLoading: false
  };
  
  // this.setState({ isLoading: false}
  

  render() {
    const { isLoading } = this.state;
    if ( isLoading==true ) {
    return <Loading />
    }
    else{
      return <Chicken />
    }
  }
}