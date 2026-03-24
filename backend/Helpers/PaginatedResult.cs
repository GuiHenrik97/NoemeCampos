namespace NoemeCampos.Helpers;

public class PaginatedResult<T>
{
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalItems { get; set; }
    public int TotalPages { get; set; }

    public List<T> Data { get; set; } = new();

    public PaginatedResult(List<T> data, int count, int page, int pageSize)
    {
        Data = data;
        TotalItems = count;
        Page = page;
        PageSize = pageSize;
        TotalPages = (int)Math.Ceiling(count / (double)pageSize);
    }
}