# 📝 Project Portfolio CMS

A modern content management system built with Next.js, featuring custom component integration and a professional rich text editor.

## 🎯 Features

### **Enhanced Markdown System**
- Custom React components in markdown content
- Syntax: `<ProjectDemo projectSlug="your-project" />`
- Real-time component rendering
- Bootstrap-styled output

### **Professional Rich Text Editor**
- Custom toolbar with formatting options
- Built-in custom component insertion
- Source mode for advanced editing
- Keyboard shortcuts (Ctrl+B, Ctrl+I)
- No licensing requirements

### **Custom Components Available**
- `<ProjectDemo />` - Interactive project demonstrations
- `<CodeSnippet />` - Syntax-highlighted code blocks
- `<RacingBarChart />` - Data visualizations
- `<PlayerFormation />` - Football formations
- `<Bracket />` - Tournament brackets

### **CMS Backend**
- Firebase/Firestore integration
- REST API endpoints
- Admin authentication
- Draft/publish workflow
- SEO metadata management

## 🚀 Quick Start

### **Prerequisites**
```bash
Node.js 18+
npm or yarn
```

### **Installation**
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### **Environment Setup**
1. Copy `.env.local.template` to `.env.local`
2. Add your Firebase configuration
3. Set admin email addresses

## 📂 Project Structure

```
├── pages/
│   ├── api/                    # API endpoints
│   │   ├── auth/              # NextAuth configuration
│   │   └── posts/             # Posts CRUD operations
│   ├── admin/                 # Admin interface
│   │   ├── index.tsx          # Dashboard
│   │   ├── login.tsx          # Admin login
│   │   └── posts/             # Post management
│   └── project/[slug].tsx     # Dynamic project pages
├── app/
│   ├── components/
│   │   ├── admin/             # Admin interface components
│   │   └── enhanced/          # Enhanced markdown renderer
│   ├── types/                 # TypeScript definitions
│   ├── store/                 # Zustand state management
│   └── widgets/               # Reusable UI components
├── lib/                       # Server-side utilities
├── utils/                     # Client/server utilities
│   └── markdown/              # Markdown processing
└── public/                    # Static assets
```

## 🎨 Custom Components

### **Adding New Components**

1. **Create the component** in `app/widgets/`
2. **Register it** in `utils/markdown/registry.tsx`
3. **Use in content** with `<ComponentName prop="value" />`

Example:
```typescript
// In utils/markdown/registry.tsx
'MyComponent': MyReactComponent,

// In content
<MyComponent title="Hello" color="blue" />
```

### **Component Props**
All custom components receive props as strings from markdown. Handle type conversion within components:

```typescript
interface MyComponentProps {
  title: string;
  count: string; // Will be "5", convert with parseInt()
  enabled: string; // Will be "true", convert with === 'true'
}
```

## 🔐 Authentication

### **Admin Access**
- Magic link authentication via email
- Admin emails configured in environment variables
- Session-based access control

### **Protected Routes**
- `/admin/*` - Requires admin authentication
- `/api/posts` POST/PUT/DELETE - Requires admin auth
- `/api/posts` GET - Public (for rendering)

## 🗃️ Database Schema

### **Posts Collection**
```typescript
{
  id: string;
  title: string;
  slug: string;
  content: string;         // Markdown with custom components
  excerpt: string;
  projectSlug?: string;    // Link to project
  tags: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  seoTitle?: string;
  seoDescription?: string;
}
```

## 🛠️ Development

### **Available Scripts**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### **Key Technologies**
- **Next.js 13** - React framework with Pages Router
- **TypeScript** - Type safety
- **Bootstrap 5** - UI framework
- **Zustand** - State management
- **Firebase** - Backend services
- **NextAuth** - Authentication
- **React Markdown** - Markdown rendering

## 📝 Content Creation

### **Using the Admin Interface**
1. Visit `/admin` and login
2. Navigate to "Manage Posts"
3. Click "New Post"
4. Use the rich text editor or source mode
5. Insert custom components via toolbar buttons
6. Preview and publish

### **Content Best Practices**
- Use semantic headings (H1, H2, H3)
- Add alt text for accessibility
- Include SEO metadata
- Test custom components before publishing
- Use excerpts for better previews

## 🚀 Deployment

### **Environment Variables**
```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

# NextAuth
NEXTAUTH_URL=
NEXTAUTH_SECRET=

# Email
EMAIL_SERVER_HOST=
EMAIL_SERVER_PORT=
EMAIL_SERVER_USER=
EMAIL_SERVER_PASSWORD=
EMAIL_FROM=

# Admin Access
ADMIN_EMAILS=admin@example.com
```

### **Build and Deploy**
```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 🔧 Customization

### **Styling**
- Bootstrap 5 classes available throughout
- Custom CSS in `/style` directory
- Component-specific styling in individual files

### **Adding Features**
- Extend API routes in `/pages/api`
- Add new admin pages in `/pages/admin`
- Create custom widgets in `/app/widgets`
- Enhance markdown processing in `/utils/markdown`

## 📚 API Reference

### **Posts API**
```
GET    /api/posts              # List published posts
POST   /api/posts              # Create new post (admin)
GET    /api/posts/[id]         # Get specific post
PUT    /api/posts/[id]         # Update post (admin)
DELETE /api/posts/[id]         # Delete post (admin)
GET    /api/posts/slug/[slug]  # Get post by slug
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for modern content management**
