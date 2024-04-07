const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: user } = data;
    const currentPage = page ? +page : 2;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, user, totalPages, currentPage };
};


module.exports = { getPagination, getPagingData }