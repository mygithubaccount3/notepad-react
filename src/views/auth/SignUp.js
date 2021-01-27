import React, {Fragment, useState} from 'react';
import {withRouter, NavLink} from "react-router-dom";
import {useTranslation} from "react-i18next";
import Message from "../../components/Message";
import UsersService from "../../services/UsersService";

function SignUp({history}) {
    const [credentials, setCredentials] = useState(() => {
        return {
            email: '',
            username: '',
            password: ''
        }
    });
    const [error, setError] = useState(() => {
        return {
            username: '',
            email: '',
            password: ''
        }
    });

    const {t} = useTranslation();

    const onUsernameChange = (e) => {
        setCredentials({
                ...credentials,
                username: e.target.value
            }
        )
    }

    const onEmailChange = (e) => {
        setCredentials({
                ...credentials,
                email: e.target.value
            }
        )
    }

    const onPasswordChange = (e) => {
        setCredentials({
                ...credentials,
                password: e.target.value
            }
        )
    }

    const signUp = async (e) => {
        e.preventDefault();

        await UsersService.signUp(credentials.username, credentials.email, credentials.password)
            .then(async (res) => {
                history.push({
                    pathname: '/en/signin',
                    state: {
                        message: `User ${res.data.data.email} was successfully created`
                    }
                })
            }, res => {
                setError(() => {
                    return {
                        username: res.data.errors.username ?? '',
                        email: res.data.errors.email ?? '',
                        password: res.data.errors.password ?? '',
                    }
                })
            });
    }

    return (
        <Fragment>
            <h1 className="text-center">{t("sign_up_page_title")}</h1>
            <form className="w-50 mx-auto" onSubmit={signUp}>
                <div className="form-group">
                    <label htmlFor="username">{t("username_field_name")}:</label>
                    <input type="text" id="username" name="username" className="form-control"
                           onChange={onUsernameChange}/>
                    {error.username.length > 0 && <p style={{color: 'red'}}>{error.username}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="email">{t("email_field_name")}:</label>
                    <input type="email" id="email" name="email" className="form-control"
                           onChange={onEmailChange}/>
                    {error.email.length > 0 && <p style={{color: 'red'}}>{error.email}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="password">{t("pass_field_name")}:</label>
                    <input type="password" id="password" name="password" className="form-control"
                           onChange={onPasswordChange}/>
                    {error.password.length > 0 && <p style={{color: 'red'}}>{error.password}</p>}
                </div>
                <input type="submit" name="submit" className="btn btn-primary"
                       value={t("sign_up_btn_value")}/>
            </form>
            <p className="text-center">{t("log_in_question")} <NavLink
                to="/en/signin">{t("log_in_link_value")}</NavLink></p>
        </Fragment>
    )
}

export default withRouter(SignUp);
