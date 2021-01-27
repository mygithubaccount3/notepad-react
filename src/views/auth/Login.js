import React, {useState, Fragment} from 'react';
import {withRouter, NavLink} from "react-router-dom";
import {useTranslation} from "react-i18next";
import Message from "../../components/Message";
import UsersService from "../../services/UsersService";

function Login(props) {
    const [error, setError] = useState(() => {
        return {email: [], password: []}
    });
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const {t} = useTranslation();

    const logIn = (e) => {
        e.preventDefault();

        UsersService.signIn(email, password)
            .then(res => {
                    localStorage.setItem('access_token', res.data.token)
                    localStorage.setItem('user_id', res.data.user_id)
                    //return <Redirect to={'/en/notes'} />
                    props.history.push('/en/notes');
                },
                res => setError(() => res.data.errors));
    }

    const onEmailChange = (e) => {
        setEmail(e.target.value)
    }

    const onPasswordChange = (e) => {
        setPassword(e.target.value)
    }

    return (
        <Fragment>
            {props.location.state && props.location.state.hasOwnProperty('message') &&
            props.location.state.message !== '' &&
            <Message message={props.location.state.message} color='green'/>}
            <h1 className="text-center">{t("log_in_page_title")}</h1>
            <form onSubmit={logIn} className="w-50 mx-auto">
                <div className="form-group">
                    <label htmlFor="email">{t("email_field_name")}:</label>
                    <input type="email" id="email" name="email" className="form-control"
                           onChange={onEmailChange}/>
                    <p style={{color: 'red'}}>{error.email}</p>
                </div>
                <div className="form-group">
                    <label htmlFor="password">{t("pass_field_name")}:</label>
                    <input type="password" id="password" name="password" className="form-control"
                           onChange={onPasswordChange}/>
                    <p style={{color: 'red'}}>{error.password}</p>
                </div>
                <input type="submit" name="submit" className="btn btn-primary"
                       value={t("log_in_btn_value")}/>
            </form>
            <p className="text-center">{t("sign_up_question")} <NavLink
                to="/en/signup">{t("sign_up_link_value")}</NavLink></p>
        </Fragment>
    )
}

export default withRouter(Login);
