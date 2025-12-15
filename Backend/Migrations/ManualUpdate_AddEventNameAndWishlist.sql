-- Migration: Add Name column to Events table and create Wishlist table
-- Date: December 15, 2025

-- Step 1: Add Name column to Events table
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Events]') AND name = 'Name')
BEGIN
    ALTER TABLE [Events]
    ADD [Name] NVARCHAR(200) NOT NULL DEFAULT '';
END
GO

-- Step 2: Create Wishlists table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Wishlists')
BEGIN
    CREATE TABLE [Wishlists] (
        [ID] INT IDENTITY(1,1) PRIMARY KEY,
        [UserID] INT NOT NULL,
        [EventID] INT NOT NULL,
        [AddedDate] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        
        CONSTRAINT [FK_Wishlists_Buyers_UserID] FOREIGN KEY ([UserID])
            REFERENCES [Buyers] ([UserID]) ON DELETE CASCADE,
        
        CONSTRAINT [FK_Wishlists_Events_EventID] FOREIGN KEY ([EventID])
            REFERENCES [Events] ([Event_ID]) ON DELETE CASCADE,
        
        CONSTRAINT [UQ_Wishlists_UserID_EventID] UNIQUE ([UserID], [EventID])
    );
    
    CREATE INDEX [IX_Wishlists_UserID] ON [Wishlists] ([UserID]);
    CREATE INDEX [IX_Wishlists_EventID] ON [Wishlists] ([EventID]);
END
GO

PRINT 'Migration completed successfully!';
