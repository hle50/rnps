let _onNavigationStateChange = (prevState, currentState) => {
  fireStateListeners(currentState, prevState);
};

let listeners = [];

let getCurrentRoute = (navigationState) => {
  if (!navigationState) {
    return null;
  }
  
  let route = navigationState.routes[navigationState.index];
  
  if (route.routes && route.routes.length > 0) {
    return getCurrentRoute(route);
  }
  
  return route;
};

let fireStateListeners = (state, prevState) => {
  let route = getCurrentRoute(state);
  let prevRoute = getCurrentRoute(prevState);
  if (listeners.focus) {
    listeners.focus.forEach(ls => {
      if (ls.screenName === route.routeName && ls.key === route.key) {
        ls.callback(state);
      }
    });
  }
  
  if (listeners.blur) {
    listeners.blur.forEach(ls => {
      if (ls.screenName === prevRoute.routeName && ls.key === prevRoute.key) {
        ls.callback(state);
      }
    });
  }
};

export default {
  onNavigationStateChange: _onNavigationStateChange,
  addListener: (navigationState, name, callback) => {
    if (!listeners[name]) {
      listeners[name] = [];
    }
    
    let screenName = navigationState.routeName;
    let key = navigationState.key;
    
    if(!listeners[name].filter((ls)=> ls.screenName === screenName && ls.key === key)[0]){
      listeners[name].push({
        screenName,
        key,
        navigationState,
        callback
      });
    }
  },
  removeListener: (navigationState, name, callback) => {
    if (!listeners[name]) {
      return;
    }
    
    let screenName = navigationState.routeName;
    let key = navigationState.key;
    
    listeners[name] = listeners[name].filter(obj => {
      return obj.screenName === screenName && obj.key === key && obj.callback !== callback;
    });
  }
}