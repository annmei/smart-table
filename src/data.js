import { makeIndex } from "./lib/utils.js";

const BASE_URL = 'https://webinars.webdev.education-services.ru/sp7-api';

export function initData() {

    // кеширование данных
    let sellers;
    let customers;

    // кеш последнего запроса
    let lastResult;
    let lastQuery;

    /**
     * Преобразование записей для таблицы
     */
    const mapRecords = (data) => data.map(item => ({
        id: item.receipt_id,
        date: item.date,
        seller: sellers[item.seller_id],
        customer: customers[item.customer_id],
        total: item.total_amount
    }));

    /**
     * Получение индексов
     */
    const getIndexes = async () => {

        // если данные уже загружены — повторный запрос не нужен
        if (!sellers || !customers) {

            [sellers, customers] = await Promise.all([
                fetch(`${BASE_URL}/sellers`).then(res => res.json()),
                fetch(`${BASE_URL}/customers`).then(res => res.json()),
            ]);

            // преобразование массивов в объект-индекс
            sellers = makeIndex(
                sellers,
                'id',
                value => `${value.first_name} ${value.last_name}`
            );

            customers = makeIndex(
                customers,
                'id',
                value => `${value.first_name} ${value.last_name}`
            );
        }

        return {
            sellers,
            customers
        };
    };

    /**
     * Получение записей
     */
    const getRecords = async (query, isUpdated = false) => {

        const qs = new URLSearchParams(query);
        const nextQuery = qs.toString();

        // возврат кеша
        if (lastQuery === nextQuery && !isUpdated) {// isUpdated нужен, чтобы иметь возможность делать запрос без кеша
            return lastResult;
        }
        // если lastQuery не было или изменились параметры, то запрашиваем данные с сервера
        const response = await fetch(`${BASE_URL}/records?${nextQuery}`);
        const records = await response.json();

        lastQuery = nextQuery;

        lastResult = {
            total: records.total,
            items: mapRecords(records.items)
        };

        return lastResult;
    };

    return {
        getIndexes,
        getRecords
    };
}