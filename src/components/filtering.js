/**
 * Инициализация фильтрации
 * @param {object} elements - DOM элементы фильтрации
 * @returns {object} - функции работы с фильтрацией
 */
export function initFiltering(elements) {

    /**
     * Заполнение select полей option элементами
     * @param {object} elements
     * @param {object} indexes
     */
    const updateIndexes = (elements, indexes) => {

        Object.keys(indexes).forEach((elementName) => {

            elements[elementName].append(

                ...Object.values(indexes[elementName]).map((name) => {

                    const option = document.createElement("option");

                    option.value = name;
                    option.textContent = name;

                    return option;
                }),
            );
        });
    };

    /**
     * Обновление query параметров для фильтрации
     * @param {object} query
     * @param {object} state
     * @param {HTMLButtonElement?} action
     * @returns {object}
     */
    const applyFiltering = (query, state, action) => {

        // очистка поля фильтра
        if (action && action.name === "clear") {

            const fieldName = action.dataset.field;
            const parent = action.parentElement;

            parent.querySelector(`input[name=${fieldName}]`).value = "";

            state[fieldName] = "";
        }

        // формирование filter query
        const filter = {};

        Object.keys(elements).forEach((key) => {

            if (elements[key]) {

                if (
                    ["INPUT", "SELECT"].includes(elements[key].tagName) &&
                    elements[key].value
                ) {

                    filter[`filter[${elements[key].name}]`] =
                        elements[key].value;
                }
            }
        });

        return Object.keys(filter).length
            ? Object.assign({}, query, filter)
            : query;
    };

    return {
        updateIndexes,
        applyFiltering
    };
}