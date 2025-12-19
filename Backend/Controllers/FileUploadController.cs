using Microsoft.AspNetCore.Mvc;

namespace Tessera.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileUploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;
        private readonly IConfiguration _configuration;

        public FileUploadController(IWebHostEnvironment environment, IConfiguration configuration)
        {
            _environment = environment;
            _configuration = configuration;
        }

        // POST: api/FileUpload
        [HttpPost]
        public async Task<ActionResult<string>> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "No file uploaded" });
            }

            // Validate file type
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            
            if (!allowedExtensions.Contains(extension))
            {
                return BadRequest(new { message = "Invalid file type. Only images are allowed." });
            }

            // Validate file size (max 5MB)
            if (file.Length > 5 * 1024 * 1024)
            {
                return BadRequest(new { message = "File size cannot exceed 5MB" });
            }

            try
            {
                // Use Cloudinary (free tier) for production
                var cloudinaryUrl = _configuration["Cloudinary:CloudName"];
                var uploadPreset = _configuration["Cloudinary:UploadPreset"];

                if (!string.IsNullOrEmpty(cloudinaryUrl) && !string.IsNullOrEmpty(uploadPreset))
                {
                    // Upload to Cloudinary
                    using var httpClient = new HttpClient();
                    using var content = new MultipartFormDataContent();
                    
                    var fileContent = new StreamContent(file.OpenReadStream());
                    content.Add(fileContent, "file", file.FileName);
                    content.Add(new StringContent(uploadPreset), "upload_preset");
                    
                    var response = await httpClient.PostAsync(
                        $"https://api.cloudinary.com/v1_1/{cloudinaryUrl}/image/upload",
                        content
                    );

                    if (response.IsSuccessStatusCode)
                    {
                        var result = await response.Content.ReadFromJsonAsync<CloudinaryResponse>();
                        return Ok(new { url = result?.SecureUrl });
                    }
                }

                // Fallback: Save locally (for development)
                var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads");
                Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = $"{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var fileUrl = $"/uploads/{uniqueFileName}";
                return Ok(new { url = fileUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error uploading file: {ex.Message}" });
            }
        }
    }

    public class CloudinaryResponse
    {
        public string? SecureUrl { get; set; }
        public string? PublicId { get; set; }
    }
}
