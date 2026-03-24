interface PaginationProps {
    page: number
    totalPages: number
    onPageChange: (page: number) => void
}
interface PaginationProps {
    page: number
    totalPages: number
    onPageChange: (page: number) => void
}

export default function Pagination({
                                       page,
                                       totalPages,
                                       onPageChange,
                                   }: PaginationProps) {

    const maxVisible = 5

    function generatePages() {
        const pages: number[] = []

        let start = Math.max(1, page - Math.floor(maxVisible / 2))
        let end = start + maxVisible - 1

        if (end > totalPages) {
            end = totalPages
            start = Math.max(1, end - maxVisible + 1)
        }

        for (let i = start; i <= end; i++) {
            pages.push(i)
        }

        return pages
    }

    return (
        <div className="bg-white rounded shadow p-4 flex justify-center items-center gap-2">
            <button
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
                className="px-3 py-1 border rounded disabled:opacity-40"
            >
                ◀
            </button>

            {generatePages().map((p) => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`px-3 py-1 border rounded ${
                        p === page
                            ? "bg-[#ff6900] text-white"
                            : "hover:bg-gray-100"
                    }`}
                >
                    {p}
                </button>
            ))}

            <button
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)}
                className="px-3 py-1 border rounded disabled:opacity-40"
            >
                ▶
            </button>
        </div>
    )
}