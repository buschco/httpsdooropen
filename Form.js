/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
var Buffer = require('buffer/').Buffer
import {TouchableOpacity, TextInput, Platform, StyleSheet, Text, View, AsyncStorage} from 'react-native';
type Props = {};
export default class App extends Component<Props> {
  constructor(props){
    super(props)
    this.state = {
      user: "",
      pass: ""
    }
  }

  storeCred = async () => {
    var prehash = this.state.user + ":" + this.state.pass
    var hash = Buffer.from(prehash).toString('base64')
    console.log(hash);
    try {
      await AsyncStorage.setItem('hash', hash);
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={{height: 40, width: 200,borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => this.setState({user: text})}
          value={this.state.user}
        />
        <TextInput
          style={{height: 40, width: 200, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => this.setState({pass: text})}
          value={this.state.pass}
        />
        <TouchableOpacity onPress={this.storeCred}>
          <Text>Save</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
  }
});
