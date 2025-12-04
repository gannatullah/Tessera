## 🔧 Technical Implementation Details

This section provides a comprehensive, line-by-line explanation of the Profile Component's implementation.

### **1. TypeScript Component (profile.component.ts)**

#### **Imports Section**
```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
```

**Explanation:**
- `Component`: Core Angular decorator that defines this as an Angular component
- `CommonModule`: Provides common directives like `*ngIf`, `*ngFor` used in the template
- `FormsModule`: Enables two-way data binding with `[(ngModel)]` for form inputs
- `Router`: Angular's navigation service to programmatically navigate between pages

#### **Component Decorator**
```typescript
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
```

**Explanation:**
- `selector: 'app-profile'`: HTML tag name to use this component (`<app-profile>`)
- `standalone: true`: This is a standalone component (doesn't need NgModule)
- `imports`: Declares which Angular modules this component uses
- `templateUrl`: Points to the HTML template file
- `styleUrl`: Points to the CSS stylesheet file

#### **Class Properties**

##### **Constructor**
```typescript
constructor(private router: Router) {}
```

**Explanation:**
- Injects Angular's Router service into the component
- `private router`: Creates a private property accessible throughout the class
- Router is needed to navigate to other pages programmatically

##### **Edit State Flag**
```typescript
isEditing = false;
```

**Explanation:**
- Boolean flag that tracks whether the user is currently in edit mode
- `false` by default = view mode
- `true` = edit mode (form inputs become visible)

##### **Profile Data Object**
```typescript
profile = {
  name: 'Sabrina Carpenter',
  email: 'sabrinacarpet@gmail.com',
  phone: '+1 (123) 456-7890',
  location: 'New York, USA',
  birthday: 'May 11, 1999',
  interests: 'Music, Theater, Sports',
  bio: 'Passionate about events and connecting people through amazing experiences. Love discovering new events and meeting like-minded individuals.',
  profilePicture: 'pp.jpg'
};
```

**Explanation:**
- Main data object storing all user profile information
- Contains 8 properties representing different profile fields
- This is the "source of truth" - the saved/committed data
- In a real application, this would be fetched from a backend API
- `profilePicture`: Stores the image path/URL

##### **Edit Profile Copy**
```typescript
editProfile = { ...this.profile };
```

**Explanation:**
- Creates a shallow copy of the profile object using spread operator `{...}`
- This temporary copy holds changes while editing
- Prevents modifying the original `profile` until user clicks "Save"
- If user cancels, we discard `editProfile` and keep original `profile`

##### **File Upload Properties**
```typescript
selectedFile: File | null = null;
imagePreview: string | null = null;
```

**Explanation:**
- `selectedFile`: Stores the actual File object when user selects an image
  - Type `File | null` means it can be a File object or null (when no file selected)
- `imagePreview`: Stores a data URL string for previewing the selected image
  - `string | null` type allows it to be a string or null
  - Data URL is a base64-encoded representation of the image

#### **Methods**

##### **toggleEditMode()**
```typescript
toggleEditMode() {
  if (this.isEditing) {
    // Cancel editing - reset changes
    this.editProfile = { ...this.profile };
    this.selectedFile = null;
    this.imagePreview = null;
  }
  this.isEditing = !this.isEditing;
}
```

**Explanation:**
- Toggles between view mode and edit mode
- **If currently editing** (`this.isEditing === true`):
  - Resets `editProfile` to match original `profile` (discards unsaved changes)
  - Clears any selected file
  - Clears the image preview
- **Then toggles the flag**: `!this.isEditing` flips true→false or false→true
- This method is called when user clicks "Edit Profile" button

##### **saveProfile()**
```typescript
saveProfile() {
  // Save the edited data
  this.profile = { ...this.editProfile };

  // If a new image was selected, update the profile picture
  if (this.selectedFile) {
    // In a real app, you would upload the file to a server here
    // For now, we'll create a data URL for preview
    const reader = new FileReader();
    reader.onload = (e => {
      this.profile.profilePicture = e.target?.result as string;
    });
    reader.readAsDataURL(this.selectedFile);
  }

  this.isEditing = false;
  this.selectedFile = null;
  this.imagePreview = null;

  // Here you would typically make an API call to save to backend
  console.log('Profile saved:', this.profile);
}
```

**Explanation:**
- **Line 1-2**: Commits the changes by copying `editProfile` back to `profile`
- **Line 5**: Checks if user selected a new profile picture
- **Line 8**: Creates a `FileReader` object to read the file
- **Line 9-11**: `onload` callback executes when file is read
  - `e.target?.result` contains the data URL of the image
  - `as string` is a TypeScript type assertion
  - Updates `profile.profilePicture` with the new image data URL
- **Line 13**: `readAsDataURL()` starts reading the file as a base64 string
- **Line 16-18**: Exits edit mode and cleans up temporary data
- **Line 21**: Logs to console (in production, this would be an API call)

##### **cancelEdit()**
```typescript
cancelEdit() {
  this.editProfile = { ...this.profile };
  this.selectedFile = null;
  this.imagePreview = null;
  this.isEditing = false;
}
```

**Explanation:**
- Discards all unsaved changes and returns to view mode
- Resets `editProfile` to match original `profile`
- Clears file selection and preview
- Sets `isEditing` to false
- Similar to `toggleEditMode()` but doesn't toggle - always exits edit mode

##### **onFileSelected()**
```typescript
onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB.');
      return;
    }

    this.selectedFile = file;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}
```

**Explanation:**
- **Parameter `event: any`**: The DOM event from the file input
- **Line 2**: Extracts the first selected file from the input
  - `event.target.files` is a FileList array
  - `[0]` gets the first file (we only allow one)
- **Line 5-8**: Validates file is an image
  - `file.type` contains MIME type (e.g., "image/jpeg")
  - `.startsWith('image/')` checks if it's any image type
  - Shows alert and exits if invalid
- **Line 11-14**: Validates file size
  - `file.size` is in bytes
  - `5 * 1024 * 1024` = 5MB in bytes
  - Shows alert and exits if too large
- **Line 16**: Stores the valid file
- **Line 19-23**: Creates instant preview
  - `FileReader` reads the file
  - `onload` callback fires when reading completes
  - Stores data URL in `imagePreview` for display
  - `readAsDataURL()` starts the reading process

##### **viewAllBookings()**
```typescript
viewAllBookings() {
  this.router.navigate(['/mybookings']);
}
```

**Explanation:**
- Navigates user to the my bookings page
- `router.navigate()` is Angular's programmatic navigation method
- `['/mybookings']` is the route path (defined in app.routes.ts)
- Called when user clicks "View All Bookings" button

### **2. HTML Template (profile.component.html)**

#### **Section Container**
```html
<section class="profile-section">
    <div class="container py-5">
```

**Explanation:**
- `<section>`: Semantic HTML5 element for a distinct section of content
- `class="profile-section"`: CSS class for background image and styling
- `<div class="container py-5">`: Bootstrap container with padding (py-5 = padding-y: 5 units)

#### **Profile Picture Section**
```html
<div class="profile-pic-wrapper">
    <!-- View Mode -->
    <img *ngIf="!isEditing" [src]="profile.profilePicture" alt="Profile Picture" class="profile-pic">

    <!-- Edit Mode -->
    <div *ngIf="isEditing" class="profile-pic-edit">
        <img [src]="imagePreview || profile.profilePicture" alt="Profile Picture" class="profile-pic">
        <div class="upload-overlay">
            <label for="profilePictureInput" class="upload-btn">
                <i class="fas fa-camera"></i>
                <span>Change Photo</span>
            </label>
            <input
                type="file"
                id="profilePictureInput"
                accept="image/*"
                (change)="onFileSelected($event)"
                style="display: none;">
        </div>
    </div>
</div>
```

**Explanation:**

**View Mode Image:**
- `*ngIf="!isEditing"`: Only shows when NOT editing (Angular structural directive)
- `[src]="profile.profilePicture"`: Property binding - dynamically sets image source
- Angular's `[]` syntax binds to component properties

**Edit Mode Section:**
- `*ngIf="isEditing"`: Only shows when editing
- `class="profile-pic-edit"`: CSS class for positioning overlay

**Preview Image:**
- `[src]="imagePreview || profile.profilePicture"`: Uses OR operator
  - If `imagePreview` exists (user selected new image), show it
  - Otherwise, show current `profile.profilePicture`

**Upload Overlay:**
- `<label for="profilePictureInput">`: Links to hidden file input
- Clicking label triggers the file input (standard HTML behavior)
- `<i class="fas fa-camera">`: FontAwesome camera icon
- `<span>Change Photo</span>`: Visible text prompt

**Hidden File Input:**
- `type="file"`: Standard HTML file input
- `id="profilePictureInput"`: Links to label via "for" attribute
- `accept="image/*"`: Browser filter to only show image files
- `(change)="onFileSelected($event)"`: Event binding - calls method when file selected
  - Angular's `()` syntax for event binding
  - `$event` passes the DOM event object
- `style="display: none"`: Hides the ugly default file input

#### **Profile Name Section**
```html
<!-- View Mode -->
<h1 *ngIf="!isEditing" class="profile-name mt-4">{{ profile.name }}</h1>

<!-- Edit Mode -->
<div *ngIf="isEditing" class="mt-4">
    <input type="text" class="form-control form-control-lg text-center mx-auto" 
           style="max-width: 400px;" 
           [(ngModel)]="editProfile.name" 
           placeholder="Enter your name">
</div>
```

**Explanation:**

**View Mode:**
- `{{ profile.name }}`: Interpolation binding - displays the name value
- Angular's `{{}}` syntax outputs component properties as text

**Edit Mode:**
- `<input type="text">`: Standard text input field
- `class="form-control form-control-lg text-center mx-auto"`: Bootstrap classes
  - `form-control`: Bootstrap input styling
  - `form-control-lg`: Large size
  - `text-center`: Centers text inside input
  - `mx-auto`: Horizontal margin auto (centers the element)
- `style="max-width: 400px"`: Inline CSS limits input width
- `[(ngModel)]="editProfile.name"`: **Two-way data binding**
  - `[()]` is Angular's "banana in a box" syntax
  - Binds input value to `editProfile.name`
  - Changes in input update the property
  - Changes in property update the input
  - This is why FormsModule is imported
- `placeholder`: Shows hint text when empty

#### **About Me Card**
```html
<div class="col-md-6">
    <div class="profile-card">
        <div class="card-header">
            <h3><i class="fas fa-user me-2"></i>About Me</h3>
        </div>
        <div class="card-body">
            <!-- View Mode -->
            <div *ngIf="!isEditing">
                <div class="info-item">
                    <i class="fas fa-envelope"></i>
                    <span>{{ profile.email }}</span>
                </div>
                <!-- ...more info-items... -->
            </div>

            <!-- Edit Mode -->
            <div *ngIf="isEditing">
                <div class="mb-3">
                    <label class="form-label text-muted">Email</label>
                    <input type="email" class="form-control" [(ngModel)]="editProfile.email">
                </div>
                <!-- ...more form fields... -->
            </div>
        </div>
    </div>
</div>
```

**Explanation:**

**Bootstrap Grid:**
- `class="col-md-6"`: Takes 6 columns (50% width) on medium+ screens
- Responsive: Stacks to full width on small screens

**Card Structure:**
- `profile-card`: Custom CSS class for styling
- `card-header`: Bootstrap card header section
- `card-body`: Bootstrap card content section

**View Mode Info Items:**
- `class="info-item"`: Custom CSS for icon + text layout
- `<i class="fas fa-envelope">`: FontAwesome email icon
  - `me-2`: Bootstrap margin-end 2 units (spacing after icon)
- `{{ profile.email }}`: Displays the email value

**Edit Mode Form:**
- `class="mb-3"`: Bootstrap margin-bottom 3 units (spacing between fields)
- `<label class="form-label">`: Bootstrap form label styling
  - `text-muted`: Bootstrap class for gray color
- `<input type="email">`: Email input with browser validation
- `[(ngModel)]="editProfile.email"`: Two-way binding to edit copy
  - Note: Binds to `editProfile`, not `profile`
  - Changes don't affect `profile` until "Save" is clicked

**Pattern Repeated:**
- Same structure used for phone, location, birthday, interests
- Each field has view mode (span) and edit mode (input)

#### **Bio Card**
```html
<div class="col-md-6">
    <div class="profile-card">
        <div class="card-header">
            <h3><i class="fas fa-quote-left me-2"></i>Bio</h3>
        </div>
        <div class="card-body">
            <!-- View Mode -->
            <p *ngIf="!isEditing" class="bio-text">{{ profile.bio }}</p>

            <!-- Edit Mode -->
            <div *ngIf="isEditing">
                <textarea class="form-control" rows="4" 
                          [(ngModel)]="editProfile.bio" 
                          placeholder="Tell us about yourself...">
                </textarea>
            </div>
        </div>
    </div>
</div>
```

**Explanation:**
- Similar structure to About Me card
- **View Mode**: Simple paragraph displaying bio text
- **Edit Mode**: 
  - `<textarea>`: Multi-line text input
  - `rows="4"`: Sets visible height to 4 lines
  - `[(ngModel)]="editProfile.bio"`: Two-way binding to bio field
  - `placeholder`: Hint text for empty textarea

#### **Action Buttons**
```html
<div class="text-center mt-5">
    <button *ngIf="!isEditing" class="profile-btn primary-btn me-3" (click)="toggleEditMode()">
        <i class="fas fa-edit me-2"></i>Edit Profile
    </button>
    <button *ngIf="isEditing" class="profile-btn primary-btn me-3" (click)="saveProfile()">
        <i class="fas fa-save me-2"></i>Save Changes
    </button>
    <button *ngIf="isEditing" class="profile-btn secondary-btn me-3" (click)="cancelEdit()">
        <i class="fas fa-times me-2"></i>Cancel
    </button>
    <button class="profile-btn secondary-btn" (click)="viewAllBookings()">
        <i class="fas fa-calendar-alt me-2"></i>View All Bookings
    </button>
</div>
```

**Explanation:**

**Container:**
- `text-center`: Bootstrap class centers content
- `mt-5`: Bootstrap margin-top 5 units

**Edit Profile Button:**
- `*ngIf="!isEditing"`: Only shows in view mode
- `(click)="toggleEditMode()"`: Event binding calls method on click
- `class="profile-btn primary-btn me-3"`: Custom + Bootstrap classes
  - `me-3`: Margin-end 3 units (spacing to next button)
- Icon + text pattern for better UX

**Save Changes Button:**
- `*ngIf="isEditing"`: Only shows in edit mode
- `(click)="saveProfile()"`: Calls save method
- Yellow/gold styling (primary-btn class)

**Cancel Button:**
- `*ngIf="isEditing"`: Only shows in edit mode
- `(click)="cancelEdit()"`: Calls cancel method
- Secondary styling for less emphasis

**View All Bookings Button:**
- Always visible (no `*ngIf`)
- `(click)="viewAllBookings()"`: Navigates to bookings page
- Secondary styling

### **3. CSS Stylesheet (profile.component.css)**

#### **Background Section**
```css
.profile-section {
  position: relative;
  min-height: 100vh;
  padding: 80px 0;
}

.profile-section::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(125, 4, 4, 0.3), rgba(125, 4, 4, 0.3)), url('/curtain.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  filter: blur(3px);
  z-index: -1;
}
```

**Explanation:**

**Main Section:**
- `position: relative`: Creates positioning context for absolute children
- `min-height: 100vh`: Minimum height = 100% of viewport height (full screen)
- `padding: 80px 0`: Vertical padding (top/bottom), no horizontal padding

**Pseudo-Element Background:**
- `::before`: CSS pseudo-element created before the content
- `content: ''`: Required for pseudo-elements (empty content)
- `position: fixed`: Stays in place when scrolling
- `top: 0; left: 0; width: 100%; height: 100%`: Covers entire viewport
- `background`: Combines gradient overlay + image
  - `linear-gradient(rgba(125, 4, 4, 0.3), ...)`: Red overlay at 30% opacity
  - `url('/curtain.jpg')`: Background image
- `background-size: cover`: Image covers entire area
- `background-position: center`: Centers the image
- `background-repeat: no-repeat`: Image doesn't tile
- `background-attachment: fixed`: Parallax effect (image stays put when scrolling)
- **`filter: blur(3px)`**: Blurs ONLY the background image
- **`z-index: -1`**: Positions behind content

**Why This Approach?**
- Using `::before` with `blur()` blurs only the background, not the content
- If blur was on `.profile-section`, all content would be blurry
- This creates depth: sharp content over blurred background

#### **Profile Picture Styles**
```css
.profile-pic-wrapper {
  display: inline-block;
  position: relative;
}

.profile-pic {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid #ffffff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s ease;
}

.profile-pic:hover {
  transform: scale(1.05);
}
```

**Explanation:**

**Wrapper:**
- `display: inline-block`: Allows centering while containing only the image
- `position: relative`: Context for absolutely positioned overlay

**Image:**
- `width: 180px; height: 180px`: Fixed square dimensions
- `border-radius: 50%`: Makes square into circle (50% = half the width/height)
- `object-fit: cover`: Crops image to fit container while maintaining aspect ratio
- `border: 5px solid #ffffff`: White border around image
- `box-shadow`: Adds depth with shadow
  - `0 8px`: No horizontal offset, 8px vertical
  - `24px`: Blur radius
  - `rgba(0, 0, 0, 0.4)`: Black at 40% opacity
- `transition`: Smooth animation over 0.3 seconds using "ease" timing

**Hover Effect:**
- `transform: scale(1.05)`: Enlarges to 105% on hover
- Smooth transition due to `transition` property above

#### **Upload Overlay**
```css
.profile-pic-edit {
  position: relative;
  display: inline-block;
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;
}

.profile-pic-edit:hover .upload-overlay {
  opacity: 1;
}
```

**Explanation:**

**Upload Overlay:**
- `position: absolute`: Positioned relative to `.profile-pic-edit`
- `top: 0; left: 0; right: 0; bottom: 0`: Covers entire parent
- `background: rgba(0, 0, 0, 0.5)`: Semi-transparent black (50% opacity)
- `border-radius: 50%`: Matches circular image shape
- `display: flex`: Enables flexbox for centering
- `align-items: center`: Vertical centering
- `justify-content: center`: Horizontal centering
- **`opacity: 0`**: Invisible by default
- `transition`: Smooth fade in/out
- `cursor: pointer`: Shows hand cursor on hover

**Hover Reveal:**
- `.profile-pic-edit:hover .upload-overlay`: When hovering parent, affect overlay
- `opacity: 1`: Makes overlay fully visible
- Creates a "reveal on hover" effect

#### **Upload Button**
```css
.upload-btn {
  color: white;
  text-align: center;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.upload-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.upload-btn i {
  display: block;
  font-size: 1.5rem;
  margin-bottom: 5px;
}

.upload-btn span {
  font-size: 0.8rem;
  font-weight: 500;
}
```

**Explanation:**

**Button Styling:**
- `color: white`: White text
- `text-align: center`: Centers text
- `cursor: pointer`: Hand cursor
- `padding: 10px`: Clickable area
- `border-radius: 8px`: Rounded corners
- `transition`: Smooth background change

**Hover Effect:**
- `background-color: rgba(255, 255, 255, 0.2)`: Light white background at 20% opacity
- Creates subtle highlight on hover

**Icon Styling:**
- `.upload-btn i`: Targets FontAwesome icon
- `display: block`: Icon on its own line
- `font-size: 1.5rem`: Larger icon
- `margin-bottom: 5px`: Space between icon and text

**Text Styling:**
- `.upload-btn span`: Targets "Change Photo" text
- `font-size: 0.8rem`: Smaller text
- `font-weight: 500`: Medium weight

#### **Profile Name**
```css
.profile-name {
  font-size: 3rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.6);
  margin-bottom: 0;
}
```

**Explanation:**
- `font-size: 3rem`: Large text (3× root font size, typically 48px)
- `font-weight: 700`: Bold
- `color: #fff`: White text
- `text-shadow`: Makes text readable over background
  - `2px 2px`: Horizontal and vertical offset
  - `8px`: Blur radius
  - `rgba(0, 0, 0, 0.6)`: Black shadow at 60% opacity
- `margin-bottom: 0`: Removes default heading margin

#### **Profile Cards**
```css
.profile-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
}

.profile-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
}
```

**Explanation:**

**Card Base:**
- `background: rgba(255, 255, 255, 0.95)`: Almost-opaque white (95% opacity)
  - Slight transparency creates glass-morphism effect
- `border-radius: 15px`: Rounded corners
- `overflow: hidden`: Clips content to rounded corners
- `box-shadow`: Elevation shadow
- `transition`: Smooth animations for transform and shadow
- `height: 100%`: Cards in same row have equal height

**Hover Effect:**
- `transform: translateY(-5px)`: Lifts card up 5px
- `box-shadow`: Larger, darker shadow (stronger elevation effect)
- Creates "lifting off page" interaction

#### **Card Header**
```css
.card-header {
  background: linear-gradient(135deg, #7d0404 0%, #a00505 100%);
  padding: 20px;
  border-bottom: 3px solid #ffc908;
}

.card-header h3 {
  color: #fff;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}
```

**Explanation:**

**Header Background:**
- `background: linear-gradient(...)`: Gradient from dark red to lighter red
  - `135deg`: Diagonal direction (top-left to bottom-right)
  - `#7d0404 0%`: Start color at 0%
  - `#a00505 100%`: End color at 100%
- `padding: 20px`: Internal spacing
- `border-bottom: 3px solid #ffc908`: Gold accent line

**Heading:**
- `color: #fff`: White text
- `margin: 0`: Removes default heading margin
- `font-size: 1.5rem`: Medium-large size
- `font-weight: 600`: Semi-bold

#### **Info Items (View Mode)**
```css
.info-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  transition: background-color 0.3s ease;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item:hover {
  background-color: #f8f9fa;
  padding-left: 10px;
  border-radius: 8px;
}
```

**Explanation:**

**Flex Layout:**
- `display: flex`: Horizontal layout
- `align-items: center`: Vertically centers icon and text
- `padding: 12px 0`: Vertical padding
- `border-bottom: 1px solid #eee`: Subtle separator line
- `transition`: Smooth hover effect

**Last Item:**
- `:last-child`: Targets last info-item
- `border-bottom: none`: No border on last item (avoids double border)

**Hover Effect:**
- `background-color: #f8f9fa`: Light gray background
- `padding-left: 10px`: Slight indent
- `border-radius: 8px`: Rounded corners
- Creates subtle highlight on hover

#### **Info Item Icons and Text**
```css
.info-item i {
  color: #ffc908;
  font-size: 1.2rem;
  width: 30px;
  margin-right: 15px;
}

.info-item span {
  color: #333;
  font-size: 1rem;
}
```

**Explanation:**

**Icon Styling:**
- `color: #ffc908`: Gold/yellow color (accent color)
- `font-size: 1.2rem`: Slightly larger than text
- `width: 30px`: Fixed width aligns all icons
- `margin-right: 15px`: Space between icon and text

**Text Styling:**
- `color: #333`: Dark gray (readable)
- `font-size: 1rem`: Standard text size

#### **Form Controls (Edit Mode)**
```css
.form-control {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(255, 201, 8, 0.3);
  border-radius: 8px;
  color: #333;
  padding: 0.75rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  background: rgba(255, 255, 255, 1);
  border-color: #ffc908;
  box-shadow: 0 0 0 0.2rem rgba(255, 201, 8, 0.25);
  color: #333;
}

.form-control::placeholder {
  color: #999;
}
```

**Explanation:**

**Base Input Styling:**
- `background: rgba(255, 255, 255, 0.9)`: Slightly transparent white
- `border: 2px solid rgba(255, 201, 8, 0.3)`: Gold border at 30% opacity
- `border-radius: 8px`: Rounded corners
- `color: #333`: Dark gray text
- `padding: 0.75rem`: Internal spacing
- `transition`: Smooth state changes

**Focus State:**
- `:focus`: When input is clicked/active
- `background`: Fully opaque white
- `border-color: #ffc908`: Solid gold border
- `box-shadow`: Glowing effect
  - `0 0 0 0.2rem`: No offset, 0.2rem spread
  - `rgba(255, 201, 8, 0.25)`: Gold at 25% opacity
- Creates clear "active" indicator

**Placeholder:**
- `::placeholder`: Targets placeholder text
- `color: #999`: Medium gray (less prominent)

#### **Buttons**
```css
.profile-btn {
  padding: 14px 32px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 30px;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.primary-btn {
  background: linear-gradient(135deg, #ffc908 0%, #ffb700 100%);
  color: #333;
}

.primary-btn:hover {
  background: linear-gradient(135deg, #ffb700 0%, #ffa600 100%);
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(255, 201, 8, 0.4);
}

.secondary-btn {
  background: transparent;
  color: #fff;
  border: 2px solid #fff;
}

.secondary-btn:hover {
  background: #fff;
  color: #333;
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.3);
}
```

**Explanation:**

**Base Button:**
- `padding: 14px 32px`: Horizontal and vertical padding
- `font-size: 1rem`: Standard text size
- `font-weight: 600`: Semi-bold
- `border: none`: Removes default button border
- `border-radius: 30px`: Pill-shaped (fully rounded)
- `text-transform: uppercase`: ALL CAPS
- `letter-spacing: 1px`: Slightly wider letter spacing
- `cursor: pointer`: Hand cursor
- `transition`: Smooth all property changes
- `box-shadow`: Elevation effect

**Primary Button (Yellow/Gold):**
- `background: linear-gradient(...)`: Gold gradient
- `color: #333`: Dark text on light background

**Primary Hover:**
- Darker gold gradient
- `transform: translateY(-3px)`: Lifts up 3px
- Stronger, colored shadow
- Creates "button popping up" effect

**Secondary Button (Outline):**
- `background: transparent`: No fill
- `color: #fff`: White text
- `border: 2px solid #fff`: White outline

**Secondary Hover:**
- `background: #fff`: Fills with white
- `color: #333`: Text becomes dark
- Same lift effect as primary
- Creates "fill on hover" effect

#### **Responsive Design**
```css
@media (max-width: 768px) {
  .profile-name {
    font-size: 2rem;
  }

  .profile-stats {
    gap: 20px;
  }

  .stat-number {
    font-size: 1.5rem;
  }

  .bookings-grid {
    grid-template-columns: 1fr;
  }

  .profile-btn {
    width: 100%;
    margin: 10px 0 !important;
  }
}
```

**Explanation:**
- `@media (max-width: 768px)`: Applies styles only on screens ≤768px wide (tablets/phones)
- `.profile-name { font-size: 2rem; }`: Smaller name on mobile (2rem vs 3rem)
- `.profile-btn { width: 100%; }`: Buttons take full width on mobile
  - `margin: 10px 0 !important`: Vertical spacing, overrides other margins
- Other adjustments reduce sizes and stack layouts for mobile

## **Key Concepts Summary**

### **Angular Concepts Used:**

1. **Data Binding:**
   - `{{ value }}`: Interpolation (one-way, display data)
   - `[property]="value"`: Property binding (one-way, set attributes)
   - `(event)="method()"`: Event binding (one-way, respond to events)
   - `[(ngModel)]="value"`: Two-way binding (data ↔ view sync)

2. **Structural Directives:**
   - `*ngIf`: Conditionally show/hide elements
   - Works like if/else in JavaScript

3. **Component Architecture:**
   - Separation of concerns: TypeScript (logic), HTML (view), CSS (style)
   - Reactive state management with properties
   - Method encapsulation

4. **Dependency Injection:**
   - Router injected via constructor
   - Angular provides instance automatically

### **JavaScript/TypeScript Concepts:**

1. **Spread Operator (`{...obj}`):**
   - Creates shallow copy of objects
   - Prevents unwanted mutations

2. **FileReader API:**
   - Browser API to read file contents
   - Converts images to base64 data URLs
   - Asynchronous with callback functions

3. **Optional Chaining (`?.`):**
   - Safely accesses nested properties
   - Returns undefined if property doesn't exist
   - Prevents "cannot read property of undefined" errors

4. **Type Assertions (`as string`):**
   - TypeScript feature to tell compiler the type
   - Used when you know more than TypeScript does

### **CSS Concepts:**

1. **Flexbox:**
   - Modern layout system
   - Easy centering and alignment

2. **Pseudo-elements (`::before`):**
   - Creates additional elements via CSS
   - Used for background blur effect

3. **Transitions & Transforms:**
   - Smooth animations
   - Hover effects and state changes

4. **RGBA Colors:**
   - Red, Green, Blue, Alpha (transparency)
   - Creates glass-morphism and overlays

5. **Media Queries:**
   - Responsive design
   - Different styles for different screen sizes

---

For questions or support, please refer to the main application documentation or contact the development team.