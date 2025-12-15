using Microsoft.EntityFrameworkCore;
using Tessera.API.Models;

namespace Tessera.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // DbSets (Tables)
        public DbSet<User> Users { get; set; }
        public DbSet<Buyer> Buyers { get; set; }
        public DbSet<Organizer> Organizers { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<TicketType> TicketTypes { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Wishlist> Wishlists { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships

            // User -> Buyer (One-to-One)
            modelBuilder.Entity<Buyer>()
                .HasOne(b => b.User)
                .WithOne(u => u.Buyer)
                .HasForeignKey<Buyer>(b => b.UserID);

            // User -> Organizer (One-to-One)
            modelBuilder.Entity<Organizer>()
                .HasOne(o => o.User)
                .WithOne(u => u.Organizer)
                .HasForeignKey<Organizer>(o => o.UserID);

            // Organizer -> Event (One-to-Many)
            modelBuilder.Entity<Event>()
                .HasOne(e => e.Organizer)
                .WithMany(o => o.Events)
                .HasForeignKey(e => e.OrganizerID);

            // Event -> Ticket (One-to-Many)
            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.Event)
                .WithMany(e => e.Tickets)
                .HasForeignKey(t => t.EventID)
                .OnDelete(DeleteBehavior.Restrict);

            // Event -> TicketType (One-to-Many)
            modelBuilder.Entity<TicketType>()
                .HasOne(tt => tt.Event)
                .WithMany(e => e.TicketTypes)
                .HasForeignKey(tt => tt.Event_ID)
                .OnDelete(DeleteBehavior.Cascade);

            // TicketType -> Ticket (One-to-Many)
            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.TicketType)
                .WithMany(tt => tt.Tickets)
                .HasForeignKey(t => t.TicketTypeID)
                .OnDelete(DeleteBehavior.Restrict);

            // Buyer -> Ticket (One-to-Many, optional)
            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.Buyer)
                .WithMany()
                .HasForeignKey(t => t.UserID)
                .OnDelete(DeleteBehavior.SetNull);

            // User -> Order (One-to-Many)
            modelBuilder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany(u => u.Orders)
                .HasForeignKey(o => o.UserID);

            // Order -> Ticket (Many-to-Many)
            modelBuilder.Entity<Order>()
                .HasMany(o => o.Tickets)
                .WithMany(t => t.Orders)
                .UsingEntity(j => j.ToTable("OrderTickets"));

            // Wishlist relationships
            // Buyer -> Wishlist (One-to-Many)
            modelBuilder.Entity<Wishlist>()
                .HasOne(w => w.Buyer)
                .WithMany()
                .HasForeignKey(w => w.UserID)
                .OnDelete(DeleteBehavior.Cascade);

            // Event -> Wishlist (One-to-Many)
            modelBuilder.Entity<Wishlist>()
                .HasOne(w => w.Event)
                .WithMany()
                .HasForeignKey(w => w.EventID)
                .OnDelete(DeleteBehavior.Cascade);

            // Unique constraint to prevent duplicate wishlist entries
            modelBuilder.Entity<Wishlist>()
                .HasIndex(w => new { w.UserID, w.EventID })
                .IsUnique();
        }
    }
}