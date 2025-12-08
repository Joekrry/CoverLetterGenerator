# Cover Letter Generator

A modern, AI-powered cover letter generator built with React and Vite. This application helps users create professional, tailored cover letters quickly and efficiently.

## Features

- **AI-Powered Generation**: Leverages LLM technology to create personalized cover letters
- **Professional Templates**: Industry-standard formatting and structure
- **Real-time Preview**: See your cover letter as it's being created
- **Easy Customization**: Edit and refine generated content
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Export Options**: Copy, print, or download your cover letter

## Project Structure

```
CLG/
├── src/
│   ├── components/         # React components
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── Features.jsx
│   │   ├── CoverLetterForm.jsx
│   │   ├── Preview.jsx
│   │   └── Footer.jsx
│   ├── hooks/             # Custom React hooks
│   │   └── useCoverLetter.js
│   ├── services/          # API service layer
│   │   └── coverLetterService.js
│   ├── utils/             # Utility functions
│   ├── assets/            # Static assets
│   ├── App.jsx            # Main application component
│   ├── App.css            # Application styles
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── public/                # Public assets
├── package.json
├── vite.config.js
└── eslint.config.js
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Backend Integration

The application is designed to work with a backend API that provides LLM-based cover letter generation. 

### API Configuration

Configure the API endpoint in your environment:

1. Create a `.env` file in the root directory
2. Add your API base URL:
   ```
   VITE_API_BASE_URL=http://your-backend-url/api
   ```

### Expected API Endpoint

The application expects a POST endpoint at `/generate-cover-letter` that accepts:

```json
{
  "personalInfo": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "address": "string"
  },
  "jobDetails": {
    "jobTitle": "string",
    "companyName": "string",
    "hiringManager": "string"
  },
  "context": {
    "skills": "string",
    "experience": "string",
    "motivation": "string",
    "jobDescription": "string"
  }
}
```

And returns:

```json
{
  "coverLetter": "string (generated cover letter content)",
  "metadata": {}
}
```

## Components

### Header
Navigation component with branding and menu links.

### Hero
Landing section with call-to-action buttons.

### Features
Showcases key features and "How It Works" section.

### CoverLetterForm
Main form for collecting user information and job details.

### Preview
Displays the generated cover letter with print/copy functionality.

### Footer
Footer with links and social media icons.

## Custom Hooks

### useCoverLetter
Manages cover letter generation state, including:
- Cover letter data
- Loading states
- Error handling
- API communication

## Services

### coverLetterService
Handles all API communication:
- `generateCoverLetterAPI()` - Calls the backend to generate cover letters
- `validateFormData()` - Validates user input
- `formatCoverLetterContent()` - Formats content for display

## Build for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## Linting

```bash
npm run lint
```

## Technologies Used

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **ESLint** - Code linting
- **CSS3** - Styling

## Best Practices Implemented

- **Component Separation**: Each component is self-contained with its own styles
- **Custom Hooks**: Business logic separated into reusable hooks
- **Service Layer**: API calls abstracted into dedicated service files
- **Error Handling**: Comprehensive error handling throughout
- **Accessibility**: Semantic HTML and ARIA labels
- **Responsive Design**: Mobile-first approach with media queries
- **Code Organization**: Clear folder structure and file naming conventions

## Future Enhancements

- Multiple template options
- Save/load draft functionality
- Export to PDF
- User accounts and history
- Additional language support
- More customization options

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
