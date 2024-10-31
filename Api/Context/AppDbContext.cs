using Api.Model;
using Microsoft.EntityFrameworkCore;

namespace Api.Context
{
    class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<Brand> Brands { get; set; }
        public virtual DbSet<Product> Products { get; set; }
        public virtual DbSet<Sale> Sales { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<Category>().HasKey(c => c.Id);
           
            modelBuilder.Entity<Category>().Property(c => c.Name)
                                           .HasMaxLength(50)
                                           .IsRequired();

            modelBuilder.Entity<Brand>().HasKey(b => b.Id);
            modelBuilder.Entity<Brand>().Property(b => b.Name)
                                        .HasMaxLength(50)
                                        .IsRequired();

            modelBuilder.Entity<Product>().HasKey(p => p.Id);
            modelBuilder.Entity<Product>().HasOne(p => p.Brand).WithMany();
            modelBuilder.Entity<Product>().HasOne<Category>(p => p.Category)
                                          .WithMany(p => p.Products)
                                          .HasForeignKey(p => p.CategoryId);

            modelBuilder.Entity<Product>().Property(p => p.Name)
                                          .HasMaxLength(200)
                                          .IsRequired();

            modelBuilder.Entity<Sale>().HasKey(s => s.Id);



        }
    }

}
