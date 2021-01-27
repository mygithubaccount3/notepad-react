import React, {Fragment} from 'react';
import {useTranslation} from "react-i18next";

function Invitation({link}) {
    const {t} = useTranslation();

    return (
        <Fragment>
            <h1>{t("invitation")}</h1>
            <a href={link}>{t("invitation_link_value")}</a>
        </Fragment>
    )
}

export default Invitation;
