import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import UserProfile from './components/UserProfile';

function App() {
    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route path="/register" component={Register} />
                    <Route path="/login" component={Login} />
                    <Route path="/user/:id" component={UserProfile} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
