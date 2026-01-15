# Email Personalization Guide

## 🎯 Current Personalization Features

### Dynamic Variables Available:
- `${firstName}` - User's first name
- `${lastName}` - User's last name  
- `${email}` - User's email address
- `${roleType}` - Student/Entrepreneur (auto-formatted)
- `${country}` - User's country
- `${educationLevel}` - Education level (optional)
- `${fieldOfStudy}` - Field of study (optional)
- `${careerStage}` - Career stage (optional)

### Where Personalization Appears:
1. **Email Subject**: `Welcome to Global Bridge Initiative 2026, ${firstName}!`
2. **Greeting**: `Congratulations, ${firstName}!`
3. **Welcome Message**: Mentions user's country and field of study
4. **Registration Details**: Shows all available user information

## 🔧 How to Customize Further

### 1. Add New Personalization Variables

**Step 1: Update the interface** (`/src/lib/email.ts`)
```typescript
export interface WelcomeEmailData {
  firstName: string
  lastName: string
  email: string
  roleType: string
  country: string
  educationLevel?: string
  fieldOfStudy?: string
  careerStage?: string
  // Add new fields here:
  university?: string
  company?: string
  linkedinProfile?: string
}
```

**Step 2: Update the API call** (`/src/app/api/registration/success/route.ts`)
```typescript
const emailResult = await sendWelcomeEmail({
  firstName: user.first_name,
  lastName: user.last_name,
  email: user.email,
  roleType: user.role_type,
  country: user.country,
  educationLevel: user.education_level,
  fieldOfStudy: user.field_of_study,
  careerStage: user.career_stage,
  // Add new fields here:
  university: user.university,
  company: user.company,
  linkedinProfile: user.linkedin_profile
})
```

**Step 3: Use in email template**
```html
${university ? `<p>University: ${university}</p>` : ''}
${company ? `<p>Company: ${company}</p>` : ''}
```

### 2. Conditional Content Based on User Type

**For Students:**
```html
${roleType === 'student' ? `
  <div class="student-section">
    <h3>🎓 Student Resources</h3>
    <p>As a student, you'll have access to...</p>
  </div>
` : ''}
```

**For Entrepreneurs:**
```html
${roleType === 'entrepreneur' ? `
  <div class="entrepreneur-section">
    <h3>💼 Entrepreneur Benefits</h3>
    <p>As an entrepreneur, you'll connect with...</p>
  </div>
` : ''}
```

### 3. Country-Specific Content

```html
${country === 'Kenya' ? `
  <p>Welcome from Kenya! We have several Kenyan delegates attending this year.</p>
` : ''}

${country === 'Nigeria' ? `
  <p>Welcome from Nigeria! Join our growing Nigerian delegation.</p>
` : ''}
```

### 4. Field of Study Customization

```html
${fieldOfStudy?.toLowerCase().includes('computer') ? `
  <p>Great to have a tech enthusiast! Our digital innovation track will be perfect for you.</p>
` : ''}

${fieldOfStudy?.toLowerCase().includes('business') ? `
  <p>Your business background will be valuable in our entrepreneurship workshops.</p>
` : ''}
```

### 5. Personalized Next Steps

```html
${roleType === 'student' ? `
  <div class="step">
    <div class="step-number">1</div>
    <div class="step-content">
      <strong>Upload Student Documents</strong>
      <p>Please provide your student ID and academic transcripts.</p>
    </div>
  </div>
` : `
  <div class="step">
    <div class="step-number">1</div>
    <div class="step-content">
      <strong>Upload Business Documents</strong>
      <p>Please provide your business registration and portfolio.</p>
    </div>
  </div>
`}
```

## 🎨 Design Customization

### Change Colors/Scheme:
```css
:root {
  --primary-color: #4f46e5;  /* Change this */
  --secondary-color: #667eea; /* Change this */
}
```

### Add Personalized Images:
```html
${roleType === 'student' ? `
  <img src="https://your-domain.com/student-welcome.jpg" alt="Student Welcome">
` : `
  <img src="https://your-domain.com/entrepreneur-welcome.jpg" alt="Entrepreneur Welcome">
`}
```

## 📊 Advanced Personalization Ideas

### 1. Dynamic Content Based on Registration Date
```html
<p>You're the ${userNumber}th person to register from ${country}!</p>
```

### 2. Personalized Statistics
```html
<p>Join ${totalDelegates} other delegates from ${delegateCountries} countries.</p>
```

### 3. Role-Specific Benefits
```html
${roleType === 'student' ? `
  <ul>
    <li>Access to student mentorship program</li>
    <li>Specialized academic workshops</li>
    <li>Networking with industry leaders</li>
  </ul>
` : `
  <ul>
    <li>B2B networking opportunities</li>
    <li>Investor pitch sessions</li>
    <li>Business expansion workshops</li>
  </ul>
`}
```

## 🧪 Testing Personalization

### Test with Different User Types:
1. Student from Kenya with Computer Science background
2. Entrepreneur from Nigeria with Business background
3. Student from USA with Engineering background

### Check Email Rendering:
- Test in different email clients (Gmail, Outlook, etc.)
- Check mobile responsiveness
- Verify all variables populate correctly

## 📝 Best Practices

1. **Always provide fallbacks** for optional fields
2. **Use conditional rendering** for optional content
3. **Keep personalization relevant** and not creepy
4. **Test thoroughly** with different user profiles
5. **Respect privacy** - don't include sensitive information
