import { getPages } from "../lib/utils.js";

/**
 * Инициализация пагинации
 * @param {object} - объект,содержащий DOM элементы шаблона пагинации, который будем заполнять
 * @param {function} createPage - колбэк для заполнения элемента данными по шаблону
 * @returns {...function} возвращает функции для управления пагинацией
 */

export const initPagination = (
    { pages, fromRow, toRow, totalRows },
    createPage,
) => {
    // подготовить шаблон кнопки для страницы и очистить контейнер
    const pageTemplate = pages.firstElementChild.cloneNode(true); // в качестве шаблона берём первый элемент из контейнера со страницами
    pages.firstElementChild.remove(); // и удаляем его (предполагаем, что там больше ничего, как вариант, можно и всё удалить из pages)

    let pageCount;

    /**
     * Функция обновляет query-параметры для http-запроса в зависимости от выбранного актором (пользователем) действия (нажатой кнопки)
     * @param {object} query - исходные query-параметры http-запроса
     * @param {object} state - исходное состояние таблицы. должен содержать ключи page и rowsPerPage
     * @param {HTMLButtonElement?} action - DOMElement (кнопка), над которым произведено действие
     * @returns {object} - обновленный query
     */
    const applyPagination = (query, state, action) => {
        const limit = state.rowsPerPage;
        let page = state.page;

        // Обработать действия
        if (action)
            switch (action.name) {
                case "prev":
                    page = Math.max(1, page - 1); // не меньше первой страницы
                    break;
                case "next":
                    page = Math.min(pageCount, page + 1);
                    break;
                case "first":
                    page = 1;
                    break;
                case "last":
                    page = pageCount;
                    break;
            }
        return Object.assign({}, query, {
            // добавим параметры к query, но не изменяем исходный объект
            limit,
            page,
        });
    };

    /**
     * Функция перерисовает элементы пагинации
     * @param {number} total - общее количество записей данных
     * @param {object} query - объект с параметрами вывода данных на страницу, установленных пользователем. Предполагается что содержит:
     * - page - актуаальная страница,
     * - limit - количество записей на страницу
     */
    const updatePagination = (total, { page, limit }) => {
        pageCount = Math.ceil(total / limit);

        // получить список видимых страниц и вывести их
        const visiblePages = getPages(page, pageCount, 5); // Получим массив страниц, которые нужно показать, выводим только 5 страниц
        pages.replaceChildren(
            ...visiblePages.map((pageNumber) => {
                // перебираем их и создаём для них кнопку
                const el = pageTemplate.cloneNode(true); // клонируем шаблон, который запомнили ранее
                return createPage(el, pageNumber, pageNumber === page); // вызываем колбэк из настроек, чтобы заполнить кнопку данными
            }),
        );

        // обновить статус пагинации
        fromRow.textContent = (page - 1) * limit + 1; // С какой строки выводим
        toRow.textContent = Math.min(page * limit, total); // До какой строки выводим, если это последняя страница, то отображаем оставшееся количество
        totalRows.textContent = total; // Сколько всего строк выводим на всех страницах вместе (после фильтрации будет меньше)
    };

    return {
        updatePagination,
        applyPagination,
    };
};