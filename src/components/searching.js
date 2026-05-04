/**
 * Инициализация поиска
 * @param {string} searchField - имя (name) DOM элемента, использующегося в качестве поля для поиска (должно быть ключом в state)
 * @returns {function} - функция обновления query запроса
 */
export function initSearching(searchField) {
    /**
     * Функция обновляет query-параметры для http-запроса при наличии значения в поле поиска
     * @param {object} query - исходные query-параметры http-запроса
     * @param {object} state - исходное состояние таблицы. должен содержать ключ, соответствующий searchField для работыы поиска
     * @returns {object} - обновленный query (или исходный, если поиск не требуется)
     */
    const newQuery = (query, state) => {
        return state[searchField]
            ? Object.assign({}, query, {
                  // проверяем, что в поле поиска было что-то введено
                  search: state[searchField], // устанавливаем в query параметр
            })
            : query; // если поле с поиском пустое, просто возвращаем query без изменений
    };

    return newQuery;
}