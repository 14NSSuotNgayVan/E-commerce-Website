import { useState } from 'react';

interface IParams {
    pageCount?: number
}

const usePagination = ({ pageCount }: IParams) => {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(pageCount || 10);

    const _changePage = (newPage: number) => {
        setPage(newPage);
    };

    const _changePerPage = (newPerPage: number) => {
        setPerPage(newPerPage);
        setPage(1);
    };

    return {
        page,
        perPage,
        _changePage,
        _changePerPage
    };
};

export default usePagination;