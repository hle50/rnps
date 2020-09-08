import React from 'react';
import {View, StyleSheet} from 'react-native';
import Realm from 'realm';
import {schemas} from './schemas';
import MyText from '../components/myText/MyText';

// instances
let realmInstance = null;
let isInitiated = false;

export default class RealmProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isConnected: isInitiated,
      isError: false,
    };
  }

  async componentDidMount() {
    if (isInitiated) {
      if (this.props.callback) {
        this.props.callback();
      }
      return;
    }
    await Realm.open({
      schema: schemas,
      schemaVersion: 3,
    })
      .then((realm) => {
        realmInstance = realm;
        this.setState({isConnected: true});
        if (this.props.callback) {
          this.props.callback();
        }
        isInitiated = true;
      })
      .catch((error) => {
        console.log('Failed to connect Realm Mobile Database!');
        console.log(error);
        //this.setState({ isError: true });
      });
  }

  render() {
    const {isConnected, isError} = this.state;
    return (
      <View style={styles.container}>
        {isError && (
          <View style={styles.centerContainer}>
            <MyText>Could not connect to local database.</MyText>
          </View>
        )}
        {isConnected && (
          <View style={styles.container}>{this.props.children}</View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1},
  centerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// Service

export class RealmService {
  static object(schemaName) {
    return realmInstance.objects(schemaName);
  }

  static getById(schemaName, id) {
    return new Promise((resolve, reject) => {
      try {
        let list = realmInstance.objects(schemaName);
        let obj = list.filtered('id == $0', id)[0];
        resolve(obj);
      } catch (e) {
        reject(e);
      }
    });
  }

  static getAll(schemaName) {
    return new Promise((resolve, reject) => {
      try {
        let list = realmInstance.objects(schemaName);
        resolve(list);
      } catch (e) {
        reject(e);
      }
    });
  }

  static getByIds(schemaName, ids) {
    return new Promise((resolve, reject) => {
      try {
        let result = [];

        ids.forEach(async (id) => {
          let obj = await RealmService.getById(schemaName, id);
          if (obj) {
            result.push(obj);
          }
        });

        resolve(result);
      } catch (e) {
        reject(e);
      }
    });
  }

  static insert(schemaName, data) {
    return new Promise((resolve, reject) => {
      try {
        realmInstance.write(() => {
          const obj = realmInstance.create(schemaName, data);
          resolve({...obj});
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  static update(schemaName, id, data) {
    return new Promise((resolve, reject) => {
      try {
        realmInstance.write(async () => {
          let obj = await RealmService.getById(schemaName, id);
          if (obj) {
            let newObject = {...obj, ...data};
            realmInstance.write(async () => {
              realmInstance.create(schemaName, newObject, true);
              resolve(newObject);
              return;
            });
          }
          reject({message: 'Object is null'});
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  static delete(schemaName, id) {
    return new Promise((resolve, reject) => {
      try {
        realmInstance.write(async () => {
          let obj = await RealmService.getById(schemaName, id);
          if (obj) {
            realmInstance.write(async () => {
              realmInstance.delete(obj);
              resolve();
              return;
            });
          }
          reject({message: 'Object is null'});
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  static deleteMultiple(schemaName, ids) {
    return new Promise((resolve, reject) => {
      try {
        realmInstance.write(() => {
          ids.forEach(async (id) => {
            await RealmService.delete(schemaName, id);
          });
          resolve();
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
