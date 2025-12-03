-- Add Event_ID foreign key to TicketTypes table
ALTER TABLE TicketTypes 
ADD COLUMN Event_ID INT NOT NULL;

-- Add foreign key constraint
ALTER TABLE TicketTypes
ADD CONSTRAINT FK_TicketTypes_Events_Event_ID 
FOREIGN KEY (Event_ID) REFERENCES Events(Event_ID) ON DELETE CASCADE;

-- Add index on Event_ID
CREATE INDEX IX_TicketTypes_Event_ID ON TicketTypes(Event_ID);

-- Add UserID foreign key to Tickets table
ALTER TABLE Tickets
ADD COLUMN UserID INT NULL;

-- Add foreign key constraint to Buyers table
ALTER TABLE Tickets
ADD CONSTRAINT FK_Tickets_Buyers_UserID
FOREIGN KEY (UserID) REFERENCES Buyers(UserID) ON DELETE SET NULL;

-- Add index on UserID
CREATE INDEX IX_Tickets_UserID ON Tickets(UserID);

-- Remove Countdown column from Events table
ALTER TABLE Events
DROP COLUMN Countdown;
