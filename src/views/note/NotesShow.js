import React, {useState, useEffect} from 'react';
import {useParams, withRouter} from "react-router-dom";
import {useTranslation} from "react-i18next";
import NotesService from "../../services/NotesService";
import UsersService from "../../services/UsersService";

function NotesShow(props) {
    const [note, setNote] = useState(() => {
        return {
            title: '',
            text: '',
            visibility: '',
        }
    });
    const [userEmail, setUserEmail] = useState(() => '');
    const {uid} = useParams();
    const {t, i18n} = useTranslation();

    useEffect(() => {
        (async () => {
            NotesService.read(uid, i18n.language)
                .then(res => {
                    setNote(() => res.data);

                    console.log(res)
                    UsersService.get(res.data.user_id)
                        .then(res => setUserEmail(() => res.data.email))
                }, res => {
                    console.log(res);

                    props.history.push({
                        pathname: '/notes',
                    })
                })
        })()

    }, [])

    return (
        <div className="d-flex flex-column p-6 note__detail">
            <h1 className="align-self-center">{t("note_page_title")}</h1>
            <p className="note__title">
                <span className="font-weight-bold">{t("note_edit_title_field_name")}: </span>
                {note.title}
            </p>
            <p className="note__text">
                <span className="font-weight-bold">{t("note_edit_text_field_name")}: </span>
                {note.text}
            </p>
            <p className="note__visibility">
                <span className="font-weight-bold">{t("table_header.visibility")}: </span>
                {note.visibility}
            </p>
            <p className="note__author">
                <span className="font-weight-bold">{t("note_author")}: </span>
                {userEmail}
            </p>
        </div>
    )
}

export default withRouter(NotesShow);
