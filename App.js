/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {AppState, TouchableOpacity, Platform, StyleSheet, Text, View, AsyncStorage} from 'react-native';
import Form from './Form'
type Props = {};
export default class App extends Component<Props> {
  constructor(props){
    super(props)
    this.state = {
      open: false,
      unauthorized: false,
      appState: AppState.currentState
    }
  }

  wipe() {
    AsyncStorage.removeItem('hash')
  }

  getCred = async () => {
    try {
      const value = await AsyncStorage.getItem('hash');
      if (value !== null) {
        this.openDoor(value)
      } else {
        this.setState({
          unauthorized: true
        })
      }
     } catch (error) {
       // Error retrieving data
     }
  }

  _handleAppStateChange(nextAppState) {
    if(this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.getCred()
    }
    this.setState({appState: nextAppState});
  }

  componentDidMount() {
    this.getCred()
    AppState.addEventListener('change', this._handleAppStateChange.bind(this));
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange.bind(this));
  }

  openDoor(hash){
    console.log(hash);
    fetch('https://192.168.178.58:3000/open', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + hash
      }
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      this.setState({
        open: data.open
      })
    }.bind(this))
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.wipe.bind(this)}>
          <Text>wipe storage</Text>
        </TouchableOpacity>
        {this.state.unauthorized ? <Form /> : <View style={this.state.open!=true ? styles.close : styles.open}>
          <Text>offen {this.state.open + " "}</Text>
       </View>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  open: {
    backgroundColor: 'green',
    height: 400,
    width: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  close: {
    backgroundColor: 'red',
    height: 400,
    width: 400,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
