
import { BlogPost, Category } from "../types/blog";

export const categories: Category[] = [
  {
    id: "1",
    name: "Freelancing",
    slug: "freelancing",
  },
  {
    id: "2",
    name: "Web Development",
    slug: "web-development",
  },
  {
    id: "3",
    name: "Career",
    slug: "career",
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "10 Essential Tools Every Freelancer Should Use",
    slug: "essential-tools-for-freelancers",
    excerpt: "Discover the must-have tools that will streamline your freelance workflow and boost your productivity.",
    content: `
      <h2>Introduction</h2>
      <p>As a freelancer, having the right tools at your disposal can make a world of difference in your productivity and overall success. In this post, we'll explore 10 essential tools that every freelancer should consider adding to their toolkit.</p>
      
      <h2>1. Time Tracking Software</h2>
      <p>Keeping track of your time is crucial for billing clients accurately and understanding how you spend your working hours. Tools like Toggl, Harvest, or Clockify can help you monitor time spent on different projects.</p>
      
      <h2>2. Project Management Tools</h2>
      <p>Staying organized is key to freelance success. Platforms like Trello, Asana, or ClickUp can help you manage tasks, deadlines, and client communications in one place.</p>
      
      <h2>3. Invoicing and Accounting Software</h2>
      <p>Managing your finances effectively is essential. Tools like FreshBooks, QuickBooks, or Wave can simplify invoicing, expense tracking, and tax preparation.</p>
      
      <h2>4. Communication Tools</h2>
      <p>Clear communication with clients is vital. Slack, Zoom, and email clients with scheduling features can help you stay connected and maintain professional relationships.</p>
      
      <h2>5. Cloud Storage Solutions</h2>
      <p>Keeping your work secure and accessible is important. Services like Google Drive, Dropbox, or Microsoft OneDrive offer reliable cloud storage options.</p>
      
      <h2>Conclusion</h2>
      <p>Investing time in setting up the right tools can save you countless hours and help you deliver better results to your clients. What tools do you find essential for your freelance business?</p>
    `,
    featuredImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
    category: "freelancing",
    tags: ["productivity", "tools", "freelancing-tips"],
    author: "Alex Morgan",
    publishedDate: "2023-06-15",
    comments: [
      {
        id: "c1",
        name: "Sarah J.",
        content: "Great list! I would also add Notion to this - it's been a game-changer for my documentation needs.",
        date: "2023-06-16"
      },
      {
        id: "c2",
        name: "Mark T.",
        content: "I've been using most of these tools for years and can confirm they're essential. Especially the invoicing software!",
        date: "2023-06-17"
      }
    ],
    reactions: {
      like: 24,
      love: 12,
      clap: 8
    }
  },
  {
    id: "2",
    title: "How to Build a Strong Web Developer Portfolio",
    slug: "building-strong-web-developer-portfolio",
    excerpt: "Learn how to create a portfolio that showcases your skills and attracts potential clients or employers.",
    content: `
      <h2>Introduction</h2>
      <p>Your portfolio is often the first impression potential clients or employers have of your work. In this guide, we'll cover everything you need to create a standout web developer portfolio.</p>
      
      <h2>Choose Your Best Work</h2>
      <p>Quality trumps quantity. Select 4-6 of your best projects that demonstrate your range of skills and problem-solving abilities. For each project, include:</p>
      <ul>
        <li>A brief description of the project's purpose</li>
        <li>The technologies and tools you used</li>
        <li>Your specific role and contributions</li>
        <li>Challenges you overcame during development</li>
        <li>Results or impact of the project</li>
      </ul>
      
      <h2>Design Matters</h2>
      <p>Your portfolio's design reflects your attention to detail and aesthetic sensibilities. Ensure it's:</p>
      <ul>
        <li>Clean and intuitive to navigate</li>
        <li>Mobile-responsive</li>
        <li>Fast-loading</li>
        <li>Consistent with your personal brand</li>
      </ul>
      
      <h2>Include a Strong About Section</h2>
      <p>Don't skip the about page! This is your chance to share your journey, values, and what makes you unique as a developer. Be authentic and let your personality shine through.</p>
      
      <h2>Conclusion</h2>
      <p>A well-crafted portfolio takes time to build, but the investment is worth it. Remember to update it regularly as you complete new projects and develop new skills.</p>
    `,
    featuredImage: "https://images.unsplash.com/photo-1523800503107-5bc3ba2a6f81",
    category: "web-development",
    tags: ["portfolio", "career-advice", "web-design"],
    author: "Jamie Zhang",
    publishedDate: "2023-07-22",
    comments: [
      {
        id: "c3",
        name: "Dev123",
        content: "This is exactly what I needed! Just starting to put together my portfolio and wasn't sure what to include.",
        date: "2023-07-23"
      }
    ],
    reactions: {
      like: 42,
      love: 21,
      clap: 15
    }
  },
  {
    id: "3",
    title: "Navigating Career Transitions in Tech",
    slug: "navigating-career-transitions-tech",
    excerpt: "Practical advice for making successful career transitions within the tech industry.",
    content: `
      <h2>Introduction</h2>
      <p>The tech industry moves quickly, and career transitions are common. Whether you're moving from one specialization to another or joining tech from a different field, this guide will help you navigate the change.</p>
      
      <h2>Assess Your Transferable Skills</h2>
      <p>Start by identifying the skills from your current role that will transfer to your target position. These might include:</p>
      <ul>
        <li>Problem-solving abilities</li>
        <li>Project management experience</li>
        <li>Communication skills</li>
        <li>Leadership capacity</li>
        <li>Analytical thinking</li>
      </ul>
      
      <h2>Fill the Knowledge Gaps</h2>
      <p>Identify what skills you're missing for your desired role and create a learning plan. Options include:</p>
      <ul>
        <li>Online courses and tutorials</li>
        <li>Bootcamps</li>
        <li>Open-source contributions</li>
        <li>Personal projects</li>
        <li>Mentorship</li>
      </ul>
      
      <h2>Leverage Your Network</h2>
      <p>Your professional network can be invaluable during a career transition. Don't be afraid to reach out to contacts in your target field for advice, introductions, or mentorship.</p>
      
      <h2>Conclusion</h2>
      <p>Career transitions take time and persistence. Be patient with yourself during the learning process and celebrate small wins along the way.</p>
    `,
    featuredImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
    category: "career",
    tags: ["career-change", "professional-development", "tech-industry"],
    author: "Jordan Rivera",
    publishedDate: "2023-08-10",
    comments: [
      {
        id: "c4",
        name: "Career Changer",
        content: "Thank you for this article! I'm currently transitioning from marketing to UX design and finding the journey challenging but rewarding.",
        date: "2023-08-11"
      },
      {
        id: "c5",
        name: "TechMentor",
        content: "Great points about transferable skills. I always tell my mentees to start there when making a career pivot.",
        date: "2023-08-12"
      }
    ],
    reactions: {
      like: 35,
      love: 18,
      clap: 10
    }
  }
];
