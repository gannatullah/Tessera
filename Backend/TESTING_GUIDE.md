# Testing Guide: Ticket Limits & Concurrent Purchases

## 🎯 Features to Test

1. **Ticket Limit per Event**: Users can only purchase max 2 tickets per event
2. **Concurrent Purchase Handling**: Multiple simultaneous purchases handled safely
3. **New Endpoint**: Check user ticket count for an event

---

## 📋 Manual API Testing (Postman/cURL)

### Test 1: Normal Ticket Purchase (Should Succeed)

**Request:**
```bash
POST http://localhost:5000/api/Tickets
Content-Type: application/json

{
  "ticketTypeID": 1,
  "eventID": 1,
  "userID": 1,
  "status": "Available"
}
```

**Expected Response (201 Created):**
```json
{
  "ticket_ID": 1,
  "status": "Available",
  "ticketTypeID": 1,
  "eventID": 1,
  "userID": 1,
  ...
}
```

---

### Test 2: Purchase 2nd Ticket (Should Succeed)

**Request:**
```bash
POST http://localhost:5000/api/Tickets
Content-Type: application/json

{
  "ticketTypeID": 1,
  "eventID": 1,
  "userID": 1,
  "status": "Available"
}
```

**Expected Response (201 Created):**
Should create the second ticket successfully.

---

### Test 3: Purchase 3rd Ticket (Should FAIL - Limit Reached)

**Request:**
```bash
POST http://localhost:5000/api/Tickets
Content-Type: application/json

{
  "ticketTypeID": 1,
  "eventID": 1,
  "userID": 1,
  "status": "Available"
}
```

**Expected Response (400 Bad Request):**
```json
{
  "message": "Maximum ticket limit reached. You can only purchase 2 tickets per event."
}
```

---

### Test 4: Check Ticket Count (New Endpoint)

**Request:**
```bash
GET http://localhost:5000/api/Tickets/user/1/event/1/count
```

**Expected Response (200 OK):**
```json
{
  "userId": 1,
  "eventId": 1,
  "ticketCount": 2,
  "remainingAllowed": 0,
  "maxAllowed": 2
}
```

---

### Test 5: Different Event, Same User (Should Succeed)

**Request:**
```bash
POST http://localhost:5000/api/Tickets
Content-Type: application/json

{
  "ticketTypeID": 2,
  "eventID": 2,  // DIFFERENT EVENT
  "userID": 1,
  "status": "Available"
}
```

**Expected Response (201 Created):**
Should succeed because limit is per event, not global.

---

### Test 6: Same Event, Different User (Should Succeed)

**Request:**
```bash
POST http://localhost:5000/api/Tickets
Content-Type: application/json

{
  "ticketTypeID": 1,
  "eventID": 1,
  "userID": 2,  // DIFFERENT USER
  "status": "Available"
}
```

**Expected Response (201 Created):**
Should succeed because limit is per user.

---

## 🔥 Testing Concurrent Purchases (Race Condition Testing)

### Method 1: Using PowerShell (Windows) or Bash (Mac/Linux)

**Bash Script (`test_concurrent.sh`):**
```bash
#!/bin/bash

# Test concurrent ticket purchases
# This simulates 5 users trying to buy tickets at the exact same time

API_URL="http://localhost:5000/api/Tickets"

# Function to create a ticket
purchase_ticket() {
  curl -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d '{
      "ticketTypeID": 1,
      "eventID": 1,
      "userID": 1,
      "status": "Available"
    }' \
    -w "\nHTTP Status: %{http_code}\n" \
    --silent
}

echo "Starting concurrent purchase test..."
echo "Attempting to buy 5 tickets simultaneously (should only allow 2)"

# Run 5 requests in parallel
for i in {1..5}; do
  purchase_ticket &
done

# Wait for all background jobs to complete
wait

echo "Test completed. Check database for results."
```

**PowerShell Script (`test_concurrent.ps1`):**
```powershell
# Test concurrent ticket purchases
$apiUrl = "http://localhost:5000/api/Tickets"

$body = @{
    ticketTypeID = 1
    eventID = 1
    userID = 1
    status = "Available"
} | ConvertTo-Json

Write-Host "Starting concurrent purchase test..."
Write-Host "Attempting to buy 5 tickets simultaneously (should only allow 2)"

# Create 5 parallel jobs
$jobs = 1..5 | ForEach-Object {
    Start-Job -ScriptBlock {
        param($url, $json)
        Invoke-RestMethod -Uri $url -Method Post -Body $json -ContentType "application/json"
    } -ArgumentList $apiUrl, $body
}

# Wait for all jobs and get results
$results = $jobs | Wait-Job | Receive-Job

# Display results
$results | ForEach-Object {
    Write-Host "Response: $_"
}

# Clean up jobs
$jobs | Remove-Job

Write-Host "Test completed."
```

**Run the test:**
```bash
# Make executable (Linux/Mac)
chmod +x test_concurrent.sh
./test_concurrent.sh

# Or PowerShell (Windows)
.\test_concurrent.ps1
```

**Expected Result:**
- Only 2 tickets should be created
- Other 3 requests should fail with "Maximum ticket limit reached" error

---

### Method 2: Using Apache Bench (ab)

```bash
# Install apache bench if not installed
# Mac: brew install httpd
# Ubuntu: apt-get install apache2-utils

# Create a POST data file
cat > post_data.json << EOF
{
  "ticketTypeID": 1,
  "eventID": 1,
  "userID": 3,
  "status": "Available"
}
EOF

# Send 10 concurrent requests
ab -n 10 -c 10 -p post_data.json -T application/json \
  http://localhost:5000/api/Tickets
```

---

### Method 3: Using Postman (Collection Runner)

1. Create a POST request in Postman
2. Go to **Runner** tab
3. Set **Iterations** to 10
4. Set **Delay** to 0ms
5. Run the collection
6. Check how many succeeded vs failed

---

## 🧪 Integration Tests (C# - xUnit)

### Create Test Project

```bash
cd Backend
dotnet new xunit -n Tessera.Tests
cd Tessera.Tests
dotnet add reference ../Tessera.API.csproj
dotnet add package Microsoft.EntityFrameworkCore.InMemory
dotnet add package Microsoft.AspNetCore.Mvc.Testing
```

### Test File: `TicketsControllerTests.cs`

```csharp
using Microsoft.EntityFrameworkCore;
using Tessera.API.Controllers;
using Tessera.API.Data;
using Tessera.API.DTOs;
using Tessera.API.Models;
using Xunit;

namespace Tessera.Tests
{
    public class TicketsControllerTests
    {
        private ApplicationDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            var context = new ApplicationDbContext(options);

            // Seed test data
            var testEvent = new Event
            {
                Event_ID = 1,
                Name = "Test Event",
                Category = "Test",
                Date = DateTime.Now.AddDays(30),
                City = "Test City",
                Location = "Test Location",
                Capacity = 100,
                OrganizerID = 1
            };

            var testTicketType = new TicketType
            {
                ID = 1,
                Name = "General Admission",
                Price = 50.00m,
                Quantity_Total = 10,
                Quantity_Sold = 0,
                Event_ID = 1
            };

            context.Events.Add(testEvent);
            context.TicketTypes.Add(testTicketType);
            context.SaveChanges();

            return context;
        }

        [Fact]
        public async Task CreateTicket_FirstTicket_ShouldSucceed()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var controller = new TicketsController(context);
            var createDto = new CreateTicketDto
            {
                TicketTypeID = 1,
                EventID = 1,
                UserID = 1,
                Status = "Available"
            };

            // Act
            var result = await controller.CreateTicket(createDto);

            // Assert
            Assert.NotNull(result);
            var createdResult = Assert.IsType<Microsoft.AspNetCore.Mvc.CreatedAtActionResult>(result.Result);
            var ticketDto = Assert.IsType<TicketDto>(createdResult.Value);
            Assert.Equal(1, ticketDto.UserID);
        }

        [Fact]
        public async Task CreateTicket_SecondTicket_ShouldSucceed()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var controller = new TicketsController(context);

            // Create first ticket
            await controller.CreateTicket(new CreateTicketDto
            {
                TicketTypeID = 1,
                EventID = 1,
                UserID = 1,
                Status = "Available"
            });

            // Act - Create second ticket
            var result = await controller.CreateTicket(new CreateTicketDto
            {
                TicketTypeID = 1,
                EventID = 1,
                UserID = 1,
                Status = "Available"
            });

            // Assert
            Assert.NotNull(result);
            var createdResult = Assert.IsType<Microsoft.AspNetCore.Mvc.CreatedAtActionResult>(result.Result);
            Assert.NotNull(createdResult);
        }

        [Fact]
        public async Task CreateTicket_ThirdTicket_ShouldFail()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var controller = new TicketsController(context);

            // Create two tickets first
            await controller.CreateTicket(new CreateTicketDto
            {
                TicketTypeID = 1,
                EventID = 1,
                UserID = 1,
                Status = "Available"
            });

            await controller.CreateTicket(new CreateTicketDto
            {
                TicketTypeID = 1,
                EventID = 1,
                UserID = 1,
                Status = "Available"
            });

            // Act - Try to create third ticket
            var result = await controller.CreateTicket(new CreateTicketDto
            {
                TicketTypeID = 1,
                EventID = 1,
                UserID = 1,
                Status = "Available"
            });

            // Assert
            var badRequestResult = Assert.IsType<Microsoft.AspNetCore.Mvc.BadRequestObjectResult>(result.Result);
            var errorMessage = badRequestResult.Value?.GetType().GetProperty("message")?.GetValue(badRequestResult.Value);
            Assert.Equal("Maximum ticket limit reached. You can only purchase 2 tickets per event.", errorMessage);
        }

        [Fact]
        public async Task CreateTicket_DifferentEvent_ShouldSucceed()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            
            // Add second event and ticket type
            var event2 = new Event
            {
                Event_ID = 2,
                Name = "Test Event 2",
                Category = "Test",
                Date = DateTime.Now.AddDays(30),
                City = "Test City",
                Location = "Test Location",
                Capacity = 100,
                OrganizerID = 1
            };
            
            var ticketType2 = new TicketType
            {
                ID = 2,
                Name = "VIP",
                Price = 100.00m,
                Quantity_Total = 10,
                Quantity_Sold = 0,
                Event_ID = 2
            };
            
            context.Events.Add(event2);
            context.TicketTypes.Add(ticketType2);
            await context.SaveChangesAsync();

            var controller = new TicketsController(context);

            // Create 2 tickets for event 1
            await controller.CreateTicket(new CreateTicketDto
            {
                TicketTypeID = 1,
                EventID = 1,
                UserID = 1
            });

            await controller.CreateTicket(new CreateTicketDto
            {
                TicketTypeID = 1,
                EventID = 1,
                UserID = 1
            });

            // Act - Create ticket for event 2
            var result = await controller.CreateTicket(new CreateTicketDto
            {
                TicketTypeID = 2,
                EventID = 2,
                UserID = 1
            });

            // Assert
            var createdResult = Assert.IsType<Microsoft.AspNetCore.Mvc.CreatedAtActionResult>(result.Result);
            Assert.NotNull(createdResult);
        }

        [Fact]
        public async Task GetUserTicketCountForEvent_ShouldReturnCorrectCount()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var controller = new TicketsController(context);

            // Create 2 tickets
            await controller.CreateTicket(new CreateTicketDto
            {
                TicketTypeID = 1,
                EventID = 1,
                UserID = 1
            });

            await controller.CreateTicket(new CreateTicketDto
            {
                TicketTypeID = 1,
                EventID = 1,
                UserID = 1
            });

            // Act
            var result = await controller.GetUserTicketCountForEvent(1, 1);

            // Assert
            var okResult = Assert.IsType<Microsoft.AspNetCore.Mvc.OkObjectResult>(result.Result);
            dynamic value = okResult.Value!;
            Assert.Equal(2, (int)value.GetType().GetProperty("ticketCount")!.GetValue(value)!);
            Assert.Equal(0, (int)value.GetType().GetProperty("remainingAllowed")!.GetValue(value)!);
            Assert.Equal(2, (int)value.GetType().GetProperty("maxAllowed")!.GetValue(value)!);
        }
    }
}
```

### Run Tests

```bash
cd Tessera.Tests
dotnet test
```

---

## 🔍 Database Verification

### Check Ticket Count Manually

```sql
-- Count tickets per user per event
SELECT 
    UserID,
    EventID,
    COUNT(*) as TicketCount
FROM Tickets
GROUP BY UserID, EventID;

-- Check if any user has more than 2 tickets for same event
SELECT 
    UserID,
    EventID,
    COUNT(*) as TicketCount
FROM Tickets
GROUP BY UserID, EventID
HAVING COUNT(*) > 2;
```

---

## ✅ Test Checklist

- [ ] **Test 1**: User can purchase first ticket (SUCCESS)
- [ ] **Test 2**: User can purchase second ticket for same event (SUCCESS)
- [ ] **Test 3**: User CANNOT purchase third ticket for same event (FAIL with error)
- [ ] **Test 4**: New endpoint returns correct ticket count
- [ ] **Test 5**: User can purchase tickets for different event (SUCCESS)
- [ ] **Test 6**: Different user can purchase tickets for same event (SUCCESS)
- [ ] **Test 7**: Concurrent purchases respect limit (stress test)
- [ ] **Test 8**: Transaction rollback on error (no partial data)
- [ ] **Test 9**: Inventory doesn't oversell during concurrent purchases
- [ ] **Test 10**: Error messages are clear and helpful

---

## 🚀 Performance Testing

### Load Test with Apache Bench

```bash
# Test endpoint performance
ab -n 1000 -c 50 http://localhost:5000/api/Tickets/user/1/event/1/count
```

**Expected**: Response time < 100ms for count endpoint

---

## 🐛 Common Issues & Solutions

### Issue: All concurrent requests succeed
**Cause**: Database transaction isolation level too low
**Solution**: Verify transaction is properly committed/rolled back

### Issue: Deadlocks during concurrent tests
**Cause**: Multiple transactions locking same rows
**Solution**: Expected behavior; transactions will retry. Check logs.

### Issue: Count endpoint returns wrong number
**Cause**: Cache issue or database not updated
**Solution**: Verify `SaveChangesAsync()` is called

---

## 📊 Expected Test Results Summary

| Test Scenario | Expected Result | HTTP Status |
|--------------|----------------|-------------|
| 1st ticket purchase | ✅ Success | 201 |
| 2nd ticket purchase | ✅ Success | 201 |
| 3rd ticket purchase | ❌ Fail | 400 |
| Different event | ✅ Success | 201 |
| Different user | ✅ Success | 201 |
| Check count | ✅ Returns 2 | 200 |
| 5 concurrent requests | 2 succeed, 3 fail | 201/400 |

---

## 🎬 Quick Start Testing

1. **Start your backend**: `dotnet run`
2. **Use Postman or cURL** to test the scenarios above
3. **Run concurrent test script** to verify race condition handling
4. **Check database** to confirm only 2 tickets exist per user per event

Done! 🎉

