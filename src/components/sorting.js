import { sortMap } from "../lib/sort.js";
/**
 * Инициализация сортировки
 */
export function initSorting(columns) {
    const newQuery = (query, action) => {
        let field = null;
        let order = null;

        if (action && action.name === "sort") {
            // запомнить выбранный режим сортировки
            action.dataset.value = sortMap[action.dataset.value];
            field = action.dataset.field;
            order = action.dataset.value;

            // сбросить сортировки остальных колонок
            columns.forEach((column) => {
                if (column.dataset.field !== action.dataset.field) {
                    column.dataset.value = "none"; //сброс в начальное состояние
                }
            });

        } else {
            //получить выбранный режим сортировки
            columns.forEach((column) => {
                if (column.dataset.value !== "none") {
                    field = column.dataset.field;
                    order = column.dataset.value;
                }
            });
        }

        const sort =
            field && order !== "none"
                ? `${field}:${order}`
                : null;

        return sort
            ? Object.assign({}, query, { sort })
            : query;
    };

    return newQuery;
}