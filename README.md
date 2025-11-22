# Doctor AI - Health Document Analysis Platform

An intelligent healthcare analytics application that uses Google's Gemini AI to analyze health documents and blood test results, providing personalized health insights and a calculated Life Score (0-100).
**try it out** - 🔗 docai-og4i.onrender.com

## Features

✨ **AI-Powered Analysis** - Upload health documents (PDF or images) for instant analysis  
📊 **Life Score Calculation** - Get a 0-100 health score based on biomarkers  
💡 **Health Insights** - Receive key findings from your health data  
🎯 **Personalized Recommendations** - Get lifestyle suggestions for diet, exercise, sleep, and stress management  
📈 **Report History** - Track your health reports and analysis over time  
🎨 **Modern UI** - Clean, professional medical-themed interface with dark mode support  

## Tech Stack

- **Frontend**: React + TypeScript, Vite, Tailwind CSS, Shadcn UI
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (Neon)
- **AI**: Google Gemini API
- **Deployment**: Replit

## Getting Started

### Prerequisites

- Google Gemini API key (free tier available at https://aistudio.google.com/apikey)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/suryauthkarsha/docai.git
   cd docai
   npm install
   ```

2. **Set up environment variables**
   - Add `GOOGLE_API_KEY` to your Replit Secrets (or `.env` file)
   - Database URL is automatically configured in Replit

3. **Start the application**
   ```bash
   npm run dev
   ```
   The app will run on http://localhost:5000

## How to Use

1. **Upload a Health Document**
   - Go to the home page
   - Drag and drop or click to select a PDF or image of your health report
   - Supported formats: PDF, JPEG, PNG (max 10MB)

2. **Get AI Analysis**
   - Wait for the Gemini AI to analyze your document
   - The analysis typically takes a few seconds

3. **View Results**
   - See your Life Score and health metrics
   - Read personalized health insights
   - Get lifestyle recommendations
   - Track previous reports in the history page

## Project Structure

```
├── client/src/
│   ├── pages/           # React pages (Upload, Dashboard, Report Detail, History)
│   ├── components/      # Reusable UI components
│   └── lib/            # Utilities and query client
├── server/
│   ├── routes.ts       # API endpoints
│   ├── storage.ts      # Database operations
│   ├── gemini.ts       # AI analysis integration
│   └── index-dev.ts    # Express server setup
├── shared/
│   └── schema.ts       # Database schema and types
└── migrations/         # Database migrations
```

## API Endpoints

- `POST /api/reports/upload` - Upload a health document
- `GET /api/reports` - List all reports with analysis
- `GET /api/reports/:id` - Get specific report with analysis details

## Environment Variables

- `GOOGLE_API_KEY` - Your Google Gemini API key (required)
- `DATABASE_URL` - PostgreSQL connection string (auto-configured in Replit)

## Database Schema

- **health_reports** - Stores uploaded documents metadata
- **health_analyses** - Stores AI analysis results with Life Score, metrics, insights, and recommendations

## Features Implemented

✅ File upload with drag-and-drop support  
✅ AI-powered health document analysis  
✅ Life Score calculation (0-100)  
✅ Health metrics extraction and categorization  
✅ Personalized health insights  
✅ Lifestyle recommendations by category  
✅ Report history and tracking  
✅ Responsive design with dark mode  
✅ Real-time analysis status polling  
✅ Error handling with fallback analysis  

## Future Enhancements

- Export reports as PDF
- Trend analysis over time
- Share reports with healthcare providers
- Integration with health tracking apps
- Multi-language support
- Advanced visualization of health trends

## License

MIT

## Support

For issues or questions, please open an issue on GitHub or contact support.

---

Built with ❤️ using React, Node.js, and Google Gemini AI
