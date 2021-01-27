import React from 'react';
import { useTranslation } from "react-i18next";

function Category({fetchNotes}) {
    const { t } = useTranslation();

    const onCategoryChange = (e) => {
        fetchNotes(1, e.target.value)()
    }

    return (
        <select name="category" id="category" onChange={onCategoryChange}>
            <option value="all">{t("categories.all")}</option>
            <option value="general">{t("categories.general")}</option>
            <option value="sport">{t("categories.sport")}</option>
            <option value="work">{t("categories.work")}</option>
            <option value="relax">{t("categories.relax")}</option>
        </select>
    )
}

export default Category;
