// README.md
# AI Course Generator

A professional web application that generates comprehensive course materials using AI. Perfect for educators, trainers, and instructional designers who need to quickly create high-quality training content.

## Features

- 🚀 **One-click course generation** - Create complete course materials instantly
- 🎯 **Customizable parameters** - Adjust for audience, duration, and delivery format
- 📚 **Comprehensive content** - Modules, activities, assessments, and learning objectives
- 📄 **Export options** - Generate PDF, DOCX, and PowerPoint presentations
- 💾 **Course history** - Save and revisit previously generated courses
- 🎨 **Beautiful UI** - Modern, responsive design with elegant animations

## Tech Stack

- **Frontend**: React, Tailwind CSS, React Icons
- **Backend**: Node.js, Express (or serverless functions)
- **AI Integration**: Claude API
- **Document Generation**: jsPDF, docx.js, pptxgenjs
- **Deployment**: Netlify or Vercel

## Getting Started

### Prerequisites

- Node.js v14+ and npm
- Claude API key from Anthropic

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-course-generator.git
cd ai-course-generator
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` and add your Claude API key:
```
CLAUDE_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
# Terminal 1 - Frontend
npm start

# Terminal 2 - Backend
cd backend
node server.js
```

### Building for Production

```bash
npm run build
```

### Deployment

#### Netlify

1. Connect your GitHub repository to Netlify
2. Add environment variable: `CLAUDE_API_KEY`
3. Deploy!

#### Vercel

1. Import your GitHub repository to Vercel
2. Add environment variable: `CLAUDE_API_KEY`
3. Deploy!

## Usage

1. **Enter Course Topic**: Type in the subject matter you want to create a course about
2. **Select Parameters**: Choose your target audience, session length, and delivery format
3. **Generate**: Click the "Generate Course" button and wait for AI to create the materials
4. **Review & Export**: Review the generated content and export in your preferred format
5. **History**: Access previously generated courses from the history section

## Cost Considerations

The application uses Claude API, which has usage-based pricing:
- Estimated cost per course generation: $0.25-$0.50
- Based on model: Claude 3.7 Sonnet
- Depends on prompt complexity and response length

## License

MIT License

## Support

For support, please open an issue in the GitHub repository.

## Acknowledgments

- Built with Claude AI
- Inspired by the need for efficient educational content creation