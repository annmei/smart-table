/**
 * Инициализация поиска
 * @param {string} searchField - имя DOM элемента (должно совпадать с ключом в state)
 * @returns {function} - функция обновления query 
 */
export function initSearching(searchField) {
    /**
     * Обновление query параметров при наличии значения в поле поиска
     * @param {object} query - текущие query параметры
     * @param {object} state - текущее состояние таблицы
     * @returns {object} - обновлённый query
     */
    const newQuery = (query, state) => {
        return state[searchField]
            ? Object.assign({}, query, {   
                search: state[searchField],
            })
            : query; 
    };

    return newQuery;
}