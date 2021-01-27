import React, {Fragment, useState, useEffect} from 'react';
import {NavLink, useParams, withRouter} from "react-router-dom";
import {useTranslation} from "react-i18next";
import Breadcrumbs from "../../components/Breadcrumps";
import Message from "../../components/Message";
import NotesService from "../../services/NotesService";

function NotesEdit(props) {
    const [error, setError] = useState(() => {
        return {
            title_en: '',
            text_en: '',
            title_ru: '',
            text_ru: '',
        }
    });

    const [note, setNote] = useState(() => {
        return {
            translations: {
                en: {
                    title: '',
                    text: '',
                },
                ru: {
                    title: '',
                    text: '',
                }
            },
            visibility: 'public',
            share_user_email: '',
            category: ''
        }
    })
    const {uid} = useParams();
    const {t, i18n} = useTranslation();

    const onInputChange = (e) => {
        e.persist();

        if(e.target.id.includes('title') || e.target.id.includes('text')) {
            setNote((prevState) => {
                return {
                    ...prevState,
                    translations: {
                        ...prevState.translations,
                        [e.target.id.slice(-2)]: {
                            ...prevState.translations[e.target.id.slice(-2)],
                            [e.target.id.includes('title') ? 'title' : 'text']: e.target.value
                        }
                    }
                }
            })
        } else {
            setNote((prevState) => {
                return {
                    ...prevState,
                    [e.target.id]: e.target.value
                }
            })
        }
    }

    const updateNote = e => {
        e.preventDefault();

        if (uid) {
            NotesService.update({uid, ...note})
                .then(() => props.history.push(`/${i18n.language}/notes`), res => {
                    setError(() => {
                        return {
                            title_en: res.data.errors['translations.en.title'],
                            text_en: res.data.errors['translations.en.text'],
                            title_ru: res.data.errors['translations.ru.title'],
                            text_ru: res.data.errors['translations.ru.text'],
                            //translations: {},
                            visibility: res.data.errors.visibility,
                            share_user_email: res.data.errors.share_user_email,
                            category: res.data.errors.category
                        }
                    })
                })
        } else {
            NotesService.store(note)
                .then(() => props.history.push(`/${i18n.language}/notes`), res => {
                    setError(() => {
                        return {
                            title_en: res.data.errors['translations.en.title'],
                            text_en: res.data.errors['translations.en.text'],
                            title_ru: res.data.errors['translations.ru.title'],
                            text_ru: res.data.errors['translations.ru.text'],
                            //translations: {},
                            visibility: res.data.errors.visibility,
                            share_user_email: res.data.errors.share_user_email,
                            category: res.data.errors.category
                        }
                    })
                })
        }
    }

    useEffect(() => {
        if (uid) {
            NotesService.edit(uid, i18n.language)
                .then(res => {
                    setNote(() => {
                        return {
                            translations: {
                                en: {
                                    title: res.data.translations[0].title,
                                    text: res.data.translations[0].text,
                                },
                                ru: {
                                    title: res.data.translations[1].title,
                                    text: res.data.translations[1].text,
                                }
                            },
                            visibility: res.data.visibility,
                            share_user_email: '',
                            category: res.data.category,
                        }
                    })
                }, () => {
                    props.history.push(`${props.location.pathname.slice(0, 3)}/notes`)
                });
        }
    }, [uid])

    return (
        <Fragment>
            <Breadcrumbs/>
            <h1 className="text-center">{t("note_edit_page_title")}</h1>
            <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item" role="presentation">
                    <a className="nav-link active" id="en-tab" data-toggle="tab" href="#en"
                       role="tab" aria-controls="en" aria-selected="true">EN</a>
                </li>
                <li className="nav-item" role="presentation">
                    <a className="nav-link" id="ru-tab" data-toggle="tab" href="#ru"
                       role="tab" aria-controls="ru" aria-selected="false">RU</a>
                </li>
            </ul>
            <form
                className="d-flex flex-column w-25 m-auto"
                onSubmit={updateNote}>

                <div className="tab-content" id="myTabContent">
                    <div className="tab-pane fade show active" id="en" role="tabpanel" aria-labelledby="en-tab">
                        <div className="form-group">
                            <label htmlFor="title_en">{t("note_edit_title_field_name")} (EN)</label>
                            <input type="text" name="title_en" id="title_en" className="form-control"
                                   defaultValue={note.translations.en.title ?? ''} onChange={onInputChange}/>
                            {error.title_en !== '' && <Message message={error.title_en} color='red'/>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="text_en">{t("note_edit_text_field_name")} (EN)</label>
                            <textarea name="text_en" id="text_en" cols="34" rows="10"
                                      className="form-control"
                                      onChange={onInputChange} defaultValue={note.translations.en.text ?? ''}/>
                            {error.text_en !== '' && <Message message={error.text_en} color='red'/>}
                        </div>
                    </div>
                    <div className="tab-pane fade" id="ru" role="tabpanel" aria-labelledby="ru-tab">
                        <div className="form-group">
                            <label htmlFor="title_ru">{t("note_edit_title_field_name")} (RU)</label>
                            <input type="text" name="title_ru" id="title_ru" className="form-control"
                                   defaultValue={note.translations.ru.title ?? ''} onChange={onInputChange}/>
                            {error.title_ru !== '' && <Message message={error.title_ru} color='red'/>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="text_ru">{t("note_edit_text_field_name")} (RU)</label>
                            <textarea name="text_ru" id="text_ru" cols="34" rows="10"
                                      className="form-control"
                                      onChange={onInputChange} defaultValue={note.translations.ru.text ?? ''}/>
                            {error.text_ru !== '' && <Message message={error.text_ru} color='red'/>}
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="visibility">{t("table_header.visibility")}:</label>
                    <select name="visibility" id="visibility" className="form-control"
                            onChange={onInputChange}
                            defaultValue={note.visibility === 'private' ? 'private' : 'public'}>
                        <option value="">--{t("visibility_field_default_value")}--</option>
                        <option value="public">{t("visibility_field_public_value")}</option>
                        <option value="private">{t("visibility_field_private_value")}</option>
                    </select>
                </div>
                {uid && note.visibility === 'private' && (
                    <div className="form-group">
                        <label htmlFor="share_user_email">{t("share_with_field_name")}:</label>
                        <input type="email" name="share_user_email" id="share_user_email"
                               className="form-control" onChange={onInputChange}/>
                    </div>
                )}
                <div className="form-group">
                    <label htmlFor="category">{t("table_header.category")}</label>
                    <select name="category" id="category" className="form-control"
                            defaultValue={note.category ?? 'general'} onChange={onInputChange}>
                        <option value="general">{t("categories.general")}</option>
                        <option value="sport">{t("categories.sport")}</option>
                        <option value="work">{t("categories.work")}</option>
                        <option value="relax">{t("categories.relax")}</option>
                    </select>
                </div>
                <div className="mx-auto">
                    <input type="submit" className="btn btn-primary"
                           value={`${uid ? t("update_note_btn_value") : t("create_note_btn_value")}`}/>
                    <NavLink exact to={`/${i18n.language}/notes`}
                             activeClassName="btn">{t("cancellation_link_value")}</NavLink>
                </div>
            </form>
        </Fragment>
    )
}

export default withRouter(NotesEdit);
