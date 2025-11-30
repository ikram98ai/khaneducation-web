# Khan Education: A Modern E-Learning Platform

Khan Education is a feature-rich, open-source e-learning platform built with a modern tech stack. It's designed to provide an engaging and interactive learning experience for students, with powerful administrative tools for educators. This project showcases a full-stack application architecture, from a dynamic React frontend to infrastructure managed by Terraform.

### ✨ Live Demo
**[Link to Live Demo](https://khaneducation.ai)**

---

### 📸 Screenshots

Here’s a glimpse of the platform's user interface:

| Main Dashboard | Subject View |
| :---: | :---: |
| ![Main Dashboard](./public/main-sc.png) | ![Subject View](./public/subject-sc.png) |
| **A personalized dashboard for students to track their learning journey.** | **Detailed subject pages with organized lessons.** |
| **Lesson & Quiz** | **Interactive Quiz** |
| ![Lesson & Quiz](./public/lesson-sc.png) | ![Interactive Quiz](./public/quiz-sc.png) |
| **Engaging lessons with tasks and integrated quizzes.** | **AI-powered quizzes to test understanding and provide feedback.** |


---

### 🚀 Key Features

- **🤖 AI-Powered Assistance:** Integrated AI Tutor for interactive quizzes and a helpful AI Assistant for guided learning.
- **📚 Rich Content Delivery:** Supports lessons with Markdown for formatted text, images, and code blocks.
- **🧠 Interactive Quizzing:** Dynamic quizzes to test knowledge and provide instant feedback.
- **📊 Personalized Dashboards:** User-specific dashboards to view enrolled subjects and track overall progress.
- **⚙️ Comprehensive Admin Panel:** A full suite of tools for administrators to manage users, subjects, and lessons.
- **📈 Progress Analytics:** Visualize learning progress and quiz performance with insightful charts.
- **🔍 Smart Search:** Quickly find subjects and lessons across the platform.
- **📱 Responsive Design:** A fully responsive layout for a seamless experience on desktops, tablets, and mobile devices.

---

### 💻 Tech Stack

This project is built with a modern and robust technology stack:

- **Frontend:** [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **[Backend](https://github.com/ikram98ai/khaneducation-api.git)**   Python, FastAPI, Pydantic, Pynamodb   

- **UI Framework:** [Tailwind CSS](https://tailwindcss.com/), [Shadcn/UI](https://ui.shadcn.com/)
- **Routing:** [React Router](https://reactrouter.com/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Fetching:** [TanStack Query](https://tanstack.com/query/latest)
- **Forms:** [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
- **Animation:** [Framer Motion](https://www.framer.com/motion/)
- **Charts:** [Recharts](https://recharts.org/)
- **Infrastructure:** [Terraform](https://www.terraform.io/), [AWS (S3, CloudFront)](https://aws.amazon.com/)

---

### 🛠️ Getting Started

Follow these instructions to get the project up and running on your local machine.

**Prerequisites:**
- [Node.js](https://nodejs.org/en) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [AWS CLI](https://aws.amazon.com/cli/) configured with your credentials (for deployment)
- [Terraform](https://developer.hashicorp.com/terraform/downloads) (for deployment)

**Installation:**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/khaneducation-web.git
   cd khaneducation-web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root of the project and add any necessary environment variables (e.g., API keys for AI services).
   ```bash
   touch .env
   ```
   Example:
   ```
   VITE_API_BASE_URL=http://localhost:8000/api
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   The application should now be running at `http://localhost:5173`.

---

### 📜 Available Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run type-check`: Performs a static type check using TypeScript.
- `npm run deploy`: Executes the full deployment pipeline (build, upload to S3, invalidate CloudFront).

---

### 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or want to fix a bug, please feel free to open an issue or submit a pull request.

---

### 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
