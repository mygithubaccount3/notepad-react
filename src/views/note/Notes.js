import React, {Fragment, Component} from 'react';
import {NavLink, withRouter} from "react-router-dom";
import Pagination from "react-js-pagination";
import {withTranslation} from "react-i18next";
import {APP_URL} from "../../.env";
import {store} from "../../contexts/AuthContext";
import Breadcrumbs from "../../components/Breadcrumps";
import Category from "../../components/Category";
import NotesService from "../../services/NotesService";
import UsersService from "../../services/UsersService";
import Message from "../../components/Message";

class Notes extends Component {
    constructor(props) {
        super(props);
        this.onSearchQueryChange = this.onSearchQueryChange.bind(this);
        this.logout = this.logout.bind(this);
        this.remove = this.remove.bind(this);
        this.getNotes = this.getNotes.bind(this);
    }

    static contextType = store;

    state = {
        notes: {
            data: [],
            current_page: 0,
            total: 0,
            per_page: 0
        },
        searchQuery: '',
        error: ''
    }

    async componentDidMount() {
        window.$('#category').chosen({width: '100px'}).change(e => this.getNotes(1, e.target.value)());
        await this.getNotes()();
    }

    onSearchQueryChange(e) {
        this.setState({
                ...this.state,
                searchQuery: e.target.value
            }
        );
    }

    async logout() {
        const {signOut} = this.context;

        await UsersService.signOut();
        signOut();
        this.props.history.push('/en/signin')
    }

    getNotes(pageNumber = 1, category = 'all') {
        return async (e) => {
            e && e.preventDefault();
            NotesService.list({
                search: this.state.searchQuery,//q
                category: category,//cat
                page: pageNumber
            }, this.props.location.pathname)
                .then(res => {
                    this.setState((prevState => {
                        return {
                            ...prevState,
                            notes: {
                                ...prevState.notes,
                                data: res.data.data,
                                current_page: res.data.meta.current_page,
                                total: res.data.meta.total,
                                per_page: res.data.meta.per_page
                            }
                        }
                    }))
                })
        }
    }

    remove(uid) {
        return async (e) => {
            e.preventDefault();

            NotesService.delete(uid, this.props.location.pathname)
                .then(() => this.setState(prevState => {
                    return {
                        notes: {
                            ...prevState.notes,
                            data: prevState.notes.data.filter(el => el.uid !== uid),
                            total: prevState.notes.total - 1
                        }
                    }
                }), res => this.setState(() => {
                    return {
                        error: res.data.message
                    }
                }))
        }
    }

    renderNotes() {
        const {data} = this.state.notes;

        return (
            <Fragment>
                {data.map((note, index) => {
                    return (
                        <tr key={index}>
                            <th scope="row">{note.id}</th>
                            <td>{note.translations[this.props.location.pathname.slice(1, 3) === 'en' ? 0 : 1].title}</td>
                            <td>{note.translations[this.props.location.pathname.slice(1, 3) === 'en' ? 0 : 1].text}</td>
                            <td>{note.visibility}</td>
                            <td>{note.category}</td>
                            <td>
                                {note.user_id === +localStorage.getItem('user_id') ?
                                    <Fragment>
                                        {console.log(note.user_id + " " +localStorage.getItem('user_id'))}
                                        <NavLink exact
                                                 to={{pathname: `${this.props.location.pathname}/${note.uid}/edit`}}
                                                 className="note__edit py-1 px-1 mr-2">{this.props.t("note.edit")}</NavLink>
                                        <button name="remove"
                                                className="note__remove btn-danger py-1 px-1"
                                                onClick={this.remove(note.uid)}>{this.props.t("note.remove")}
                                        </button>
                                    </Fragment>
                                    : null}
                            </td>
                        </tr>
                    )
                })}
                    </Fragment>
                    )
                }

    render() {
        return (
            <Fragment>
                <Breadcrumbs/>
                <div className="main">
                    <nav className="navbar navbar-light bg-white">
                        <div>
                            {localStorage.getItem('access_token') ?
                                <Fragment>
                                    <button onClick={this.logout}
                                            className="btn btn-danger headerBtn">
                                        {this.props.t("navbar.log_out")}
                                    </button>
                                    <NavLink exact to={`${this.props.location.pathname}/create`}
                                             className="btn btn-primary mr-2 headerBtn">
                                        {this.props.t("breadcrumbs.note_new")}
                                    </NavLink>
                                </Fragment>
                                : <NavLink exact to="/signin"
                                           className="btn btn-primary mr-2 headerBtn">
                                    {this.props.t("navbar.log_in")}
                                </NavLink>
                            }
                        </div>
                        <form className="form-inline">
                            <div className="input-group">
                                <input type="text" name="search" id="search"
                                       className="form-control"
                                       placeholder={this.props.t("searchbar_placeholder")}
                                       onChange={this.onSearchQueryChange}/>
                                <div className="input-group-append">
                                    <button onClick={this.getNotes()}
                                            className="btn btn-outline-primary"><i
                                        className='fa fa-search'></i></button>
                                </div>
                            </div>
                        </form>
                        <Category fetchNotes={this.getNotes}/>
                        <div className="languages-wrapper">
                            <a href={`${APP_URL}en/notes`}
                               className={this.props.i18n.language === 'en' ? 'active' : ''}>{this.props.t('language.english')}</a>
                            <a href={`${APP_URL}ru/notes`}
                               className={this.props.i18n.language === 'ru' ? 'active' : ''}>{this.props.t('language.russian')}</a>
                        </div>
                    </nav>
                    {this.state.error !== '' && <Message message={this.state.error} color='red'/>}
                    <div className="table-responsive">
                        <table className="table table-striped mt-4">
                            <caption>{this.props.t("breadcrumbs.note_list")}</caption>
                            <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">{this.props.t("table_header.title")}</th>
                                <th scope="col">{this.props.t("table_header.note")}</th>
                                <th scope="col">{this.props.t("table_header.visibility")}</th>
                                <th scope="col">{this.props.t("table_header.category")}</th>
                                <th scope="col">{this.props.t("table_header.action")}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.renderNotes()}
                            </tbody>
                        </table>
                    </div>
                    <Pagination activePage={this.state.notes.current_page}
                                totalItemsCount={this.state.notes.total}
                                itemsCountPerPage={this.state.notes.per_page}
                                onChange={async (pageNumber) => {
                                    await this.getNotes(pageNumber)()
                                }} itemClass="page-item" linkClass="page-link"
                                firstPageText={this.props.t("paginator_first_page_link_value")}
                                lastPageText={this.props.t("paginator_last_page_link_value")}/>
                </div>
            </Fragment>

        )
    }
}

export default withRouter(withTranslation()(Notes))
