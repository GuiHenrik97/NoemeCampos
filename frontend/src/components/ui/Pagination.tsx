import React from "react";

interface PaginationProps {
    page: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
                                                   page,
                                                   pageSize,
                                                   totalItems,
                                                   onPageChange,
                                               }) => {
    const totalPages = Math.ceil(totalItems / pageSize);


    const generatePages = () => {
        const pages = [];
        const maxVisible = 5;

        let start = Math.max(1, page - Math.floor(maxVisible / 2));
        let end = start + maxVisible - 1;

        if (end > totalPages) {
            end = totalPages;
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            {/* Botão anterior */}
            <button
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            >
                ◀
            </button>

            {/* Páginas */}
            {generatePages().map((p) => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`px-3 py-1 rounded ${
                        p === page
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                    }`}
                >
                    {p}
                </button>
            ))}

            {/* Botão próximo */}
            <button
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)}
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            >
                ▶
            </button>
        </div>
    );
};

export default Pagination;