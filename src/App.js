import React, {useContext, useEffect} from 'react';
import {Switch, Route, Redirect, useParams, useLocation} from 'react-router-dom';
import './App.scss';
import {store} from "./contexts/AuthContext";
import Login from "./views/auth/Login";
import Notes from "./views/note/Notes";
import SignUp from "./views/auth/SignUp";
import NotesEdit from "./views/note/NotesEdit";
import NotesShow from "./views/note/NotesShow";

function RedirectRoute({redirectTo, render}) {
    const {locale} = useParams();
    const location = useLocation();
    const isLngSupported = ['en', 'ru'].includes(locale);

    return isLngSupported ?
        redirectTo ? <Redirect to={`/${locale}${redirectTo}`}/> :
            render :
        redirectTo ? <Redirect to={`/en${redirectTo}`}/> :
            <Redirect to={`/en/${location.pathname.split('/')[2]}`}/>
}

function App() {
    const authMemo = useContext(store);
    useEffect(authMemo.restoreToken, [])

    return (
        <div className="App">
            <Switch>
                <Route exact path="/:locale/signup">
                    <RedirectRoute
                        redirectTo={authMemo.isSignedIn ? '/notes' : false}
                        render={<SignUp/>}
                    />
                </Route>
                <Route exact path="/:locale/signin">
                    <RedirectRoute
                        redirectTo={authMemo.isSignedIn ? '/notes' : false}
                        render={<Login/>}
                    />
                </Route>
                <Route exact path="/:locale/notes/create">
                    <RedirectRoute
                        redirectTo={!authMemo.isSignedIn ? '/signin' : false}
                        render={<NotesEdit/>}
                    />
                </Route>
                <Route exact path="/:locale/notes/:uid/edit">
                    <RedirectRoute
                        redirectTo={!authMemo.isSignedIn ? '/signin' : false}
                        render={<NotesEdit/>}
                    />
                </Route>
                <Route exact path="/:locale/notes">
                    <RedirectRoute
                        redirectTo={!authMemo.isSignedIn ? '/signin' : false}
                        render={<Notes/>}
                    />
                </Route>
                <Route exact path="/:locale/show/:uid">
                    <NotesShow/>
                </Route>
                <Route path="/">
                    <Redirect to="/en/notes"/>
                </Route>
            </Switch>
        </div>
    );
}

export default App;
