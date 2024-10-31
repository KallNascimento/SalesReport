namespace Api.Model
{
    public class Sale
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public Product? Product { get; set; }

        public DateTime Date { get; set; }
        public int QuantitySold { get; set; }
        public decimal TotalAmount { get; set; }
    }
}
