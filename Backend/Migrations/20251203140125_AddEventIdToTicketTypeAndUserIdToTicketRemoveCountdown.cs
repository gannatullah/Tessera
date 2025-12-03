using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tessera.API.Migrations
{
    /// <inheritdoc />
    public partial class AddEventIdToTicketTypeAndUserIdToTicketRemoveCountdown : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    First_Name = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Last_Name = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Email = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Phone_No = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Password = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DOB = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.ID);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Buyers",
                columns: table => new
                {
                    UserID = table.Column<int>(type: "int", nullable: false),
                    Nationality = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Location = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Buyers", x => x.UserID);
                    table.ForeignKey(
                        name: "FK_Buyers_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Total_Amount = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    Order_Date = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UserID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Orders_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Organizers",
                columns: table => new
                {
                    UserID = table.Column<int>(type: "int", nullable: false),
                    IsVerified = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Organizers", x => x.UserID);
                    table.ForeignKey(
                        name: "FK_Organizers_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Events",
                columns: table => new
                {
                    Event_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Category = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Date = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    St_Date = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    E_Date = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    City = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Location = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Capacity = table.Column<int>(type: "int", nullable: true),
                    OrganizerID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Events", x => x.Event_ID);
                    table.ForeignKey(
                        name: "FK_Events_Organizers_OrganizerID",
                        column: x => x.OrganizerID,
                        principalTable: "Organizers",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "TicketTypes",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Price = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    Quantity_Total = table.Column<int>(type: "int", nullable: false),
                    Quantity_Sold = table.Column<int>(type: "int", nullable: false),
                    Event_ID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TicketTypes", x => x.ID);
                    table.ForeignKey(
                        name: "FK_TicketTypes_Events_Event_ID",
                        column: x => x.Event_ID,
                        principalTable: "Events",
                        principalColumn: "Event_ID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Tickets",
                columns: table => new
                {
                    Ticket_ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Status = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    QR_Code = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TicketTypeID = table.Column<int>(type: "int", nullable: false),
                    EventID = table.Column<int>(type: "int", nullable: false),
                    UserID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tickets", x => x.Ticket_ID);
                    table.ForeignKey(
                        name: "FK_Tickets_Buyers_UserID",
                        column: x => x.UserID,
                        principalTable: "Buyers",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Tickets_Events_EventID",
                        column: x => x.EventID,
                        principalTable: "Events",
                        principalColumn: "Event_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Tickets_TicketTypes_TicketTypeID",
                        column: x => x.TicketTypeID,
                        principalTable: "TicketTypes",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "OrderTickets",
                columns: table => new
                {
                    OrdersID = table.Column<int>(type: "int", nullable: false),
                    TicketsTicket_ID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderTickets", x => new { x.OrdersID, x.TicketsTicket_ID });
                    table.ForeignKey(
                        name: "FK_OrderTickets_Orders_OrdersID",
                        column: x => x.OrdersID,
                        principalTable: "Orders",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderTickets_Tickets_TicketsTicket_ID",
                        column: x => x.TicketsTicket_ID,
                        principalTable: "Tickets",
                        principalColumn: "Ticket_ID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Events_OrganizerID",
                table: "Events",
                column: "OrganizerID");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_UserID",
                table: "Orders",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_OrderTickets_TicketsTicket_ID",
                table: "OrderTickets",
                column: "TicketsTicket_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_EventID",
                table: "Tickets",
                column: "EventID");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_TicketTypeID",
                table: "Tickets",
                column: "TicketTypeID");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_UserID",
                table: "Tickets",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_TicketTypes_Event_ID",
                table: "TicketTypes",
                column: "Event_ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrderTickets");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Tickets");

            migrationBuilder.DropTable(
                name: "Buyers");

            migrationBuilder.DropTable(
                name: "TicketTypes");

            migrationBuilder.DropTable(
                name: "Events");

            migrationBuilder.DropTable(
                name: "Organizers");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
