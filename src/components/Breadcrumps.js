import React from 'react';
import {NavLink} from "react-router-dom";
import { useTranslation } from "react-i18next";

function Breadcrumbs() {
    const { t, i18n } = useTranslation();

    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                <li className="breadcrumb-item">
                    <NavLink exact to={`/${i18n.language}/notes`} activeClassName="active">{t("breadcrumbs.note_list")}</NavLink>
                </li>
                <li className="breadcrumb-item">
                    <NavLink exact to={`/${i18n.language}/notes/create`} activeClassName="active">{t("breadcrumbs.note_new")}</NavLink>
                </li>
                <li className={"breadcrumb-item " + (window.location.pathname.indexOf('edit') !== -1
                    ? "active"
                    : "")}>
                    {t("breadcrumbs.note_edit")}
                </li>
            </ol>
        </nav>
    )
}

export default Breadcrumbs;
