using Api.Context;
using Api.Model;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(opt =>
{
    opt.UseSqlite(connectionString);
});


builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "AllowAllOrigins", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors("AllowAllOrigins");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapGet("/brands", async (AppDbContext db) => await db.Brands.ToListAsync());
app.MapGet("/products/{categoryId}", async (AppDbContext db, int categoryId) =>
{
    var categoriaComProdutosEMarcas = await db.Categories
        .AsNoTracking()
        .Where(c => c.Id == categoryId)
        .Select(c => new
        {
            c.Id,
            c.Name,
            Products = c.Products.Select(p => new
            {
                p.Id,
                p.Name,
                Brand = new
                {
                    p.Brand.Id,
                    p.Brand.Name
                }
            })
        })
        .FirstOrDefaultAsync();

    return categoriaComProdutosEMarcas;

});


app.MapPost("/brands", async (Brand brand, AppDbContext db) =>
{
    db.Brands.Add(brand);
    await db.SaveChangesAsync();
    return Results.Created();

});

app.MapGet("/products", async (AppDbContext db) => await db.Products.ToListAsync());
app.MapPost("/products", async (Product product, AppDbContext db) =>
{
    db.Products.Add(product);
    await db.SaveChangesAsync();
    return Results.Created();

});
app.MapGet("/categories", async (AppDbContext db) => await db.Categories.ToListAsync());
app.MapPost("/categories", async (Category category, AppDbContext db) =>
{
    db.Categories.Add(category);
    await db.SaveChangesAsync();
    return Results.Created();

});

app.MapGet("/sales", async (AppDbContext db, int productId) => await db.Sales.ToListAsync());
app.MapGet("/sales/{productId:int}", async (int productId, AppDbContext db) =>
{
    var currentDate = DateTime.Now;
    var startDate = currentDate.AddMonths(-4);
    var endDate = currentDate;

    var sales = await db.Sales
        .Where(s => s.ProductId == productId && s.Date >= startDate && s.Date <= endDate)
        .Select(s => new
        {
            s.Date,
            s.QuantitySold,
            s.TotalAmount,
            Product = new
            {

                s.Product.Name, // Inclui apenas o nome do produto
                s.Product.Category // Exemplo: Inclua outros campos necessários
            }
        })
        .ToListAsync();

    if (sales == null || sales.Count == 0)
    {
        return Results.NotFound("No sales found for this product!");
    }

    return Results.Ok(sales);
});

app.MapPost("/sales", async (Sale sale, AppDbContext db) =>
{
    db.Sales.Add(sale);
    await db.SaveChangesAsync();
    return Results.Created();

});



app.Run();