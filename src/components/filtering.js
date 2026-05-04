import {createComparison, defaultRules} from "../lib/compare.js";
/**
 * Инициализация фильтрации
 * @param {object} elements - объект, содержащий DOM элементы шаблона фильтрации
 * @returns {...function} - функции уравления фильтрацией
 */
export function initFiltering(elements) {
    /**
     * Функция для заполнения выпадающих списков опциями
     * @param {object} elements - пары. где ключ - название элемента (в нашем случае прописанное в dataset) , а значение - соответствующий ему DOM элемент(SELECT)
     * @param {object} indexes - пары, где ключ - название элемента, а значение JSON-объект со значениями будущих опций элемента
     * Важно: для корректной работы ключ в elements должен быть идентичен ключу в indexes
     */
    const updateIndexes = (elements, indexes) => {
        // Получаем ключи из объекта
        Object.keys(indexes).forEach((elementName) => {
            // Перебираем по именам
            elements[elementName].append(
                // в каждый элемент добавляем опции
                ...Object.values(indexes[elementName]) // формируем массив имён, значений опций
                    .map((name) => {
                        // используйте name как значение и текстовое содержимое
                        const opt = document.createElement("option");
                        opt.value = name;
                        opt.textContent = name;
                        return opt;
                    }),
            );
        });
    };

    /**
     * Функция дополняет query-параметры значениями фильтрации для http-запроса
     * @param {object} query - исходные query-параметры http-запроса
     * @param {object?} state - исходное состояние таблицы. Необходим для корректной работы очистки при сбросе фильтра. в остальных случаях здесь не используется
     * @param {HTMLButtonElement?} action  DOMElement (кнопка), действием над которым вызваны изменения (опционально для очистки фильтра)
     * @returns {object} - обновленный query или исходный, если фильтровать нечего
     */
    const applyFiltering = (query, state, action) => {
        // — обработать очистку поля
        if (action && action.name === "clear") {
            const fieldName = action.dataset.field;
            const parent = action.parentElement;
            parent.querySelector(`input[name = ${fieldName}]`).value = "";
            state[fieldName] = "";
        }

        //  отфильтровать данные
        const filter = {};
        Object.keys(elements).forEach((key) => {
            if (elements[key]) {
                //если элемент - селект или инпут
                if (
                    ["INPUT", "SELECT"].includes(elements[key].tagName) &&
                    elements[key].value
                ) {
                    // ищем поля ввода в фильтре с непустыми данными()
                    filter[`filter[${elements[key].name}]`] =
                        elements[key].value; // чтобы сформировать в query вложенный объект фильтра
                }
            }
        });

        return Object.keys(filter).length
            ? Object.assign({}, query, filter)
            : query; // если в фильтре что-то добавилось, применим к запросу
    };

    return { updateIndexes, applyFiltering };
}