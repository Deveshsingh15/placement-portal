// utils/seed.js - Seeds sample interview questions into the database
require('dotenv').config();
const mongoose = require('mongoose');
const InterviewQuestion = require('../models/InterviewQuestion');

const sampleQuestions = [
  // HR Questions
  { question: 'Tell me about yourself.', answer: 'Structure: Present – Past – Future. Talk about your current skills, what led you here, and your goals.', category: 'hr', difficulty: 'easy', company: 'General', tags: ['introduction', 'common'] },
  { question: 'What are your strengths and weaknesses?', answer: 'Choose real strengths relevant to the role. For weakness, pick something you are actively improving.', category: 'hr', difficulty: 'easy', company: 'General', tags: ['self-assessment'] },
  { question: 'Where do you see yourself in 5 years?', answer: 'Align your answer with growth in the company and your career aspirations in technology.', category: 'hr', difficulty: 'easy', company: 'General', tags: ['career'] },
  { question: 'Why do you want to join our company?', answer: 'Research the company, mention specific products/values, and align with your career goals.', category: 'hr', difficulty: 'medium', company: 'General', tags: ['company research'] },
  { question: 'Describe a situation where you worked in a team.', answer: 'Use the STAR method: Situation, Task, Action, Result.', category: 'hr', difficulty: 'medium', company: 'General', tags: ['teamwork', 'behavioral'] },

  // Technical Questions
  { question: 'What is the difference between process and thread?', answer: 'A process is an independent program in execution with its own memory space. A thread is a lightweight sub-unit of a process sharing the same memory.', category: 'technical', difficulty: 'medium', company: 'General', tags: ['os', 'concurrency'] },
  { question: 'Explain time complexity of common sorting algorithms.', answer: 'Bubble Sort: O(n²), Merge Sort: O(n log n), Quick Sort: O(n log n) avg, Heap Sort: O(n log n)', category: 'technical', difficulty: 'medium', company: 'General', tags: ['algorithms', 'dsa'] },
  { question: 'What is the difference between stack and heap memory?', answer: 'Stack: automatic, LIFO, stores local variables. Heap: dynamic, stores objects allocated with new/malloc, manually managed.', category: 'technical', difficulty: 'medium', company: 'General', tags: ['memory', 'systems'] },

  // DBMS Questions
  { question: 'What is normalization? Explain 1NF, 2NF, 3NF.', answer: '1NF: Atomic values, no repeating groups. 2NF: 1NF + no partial dependency. 3NF: 2NF + no transitive dependency.', category: 'dbms', difficulty: 'hard', company: 'General', tags: ['normalization', 'sql'] },
  { question: 'What is a transaction? Explain ACID properties.', answer: 'Atomicity: all or nothing. Consistency: valid state. Isolation: concurrent isolation. Durability: permanent on commit.', category: 'dbms', difficulty: 'medium', company: 'General', tags: ['acid', 'transactions'] },
  { question: 'Difference between DELETE, TRUNCATE, DROP.', answer: 'DELETE: removes rows with WHERE, logged. TRUNCATE: removes all rows, faster, not fully logged. DROP: removes entire table structure.', category: 'dbms', difficulty: 'easy', company: 'General', tags: ['sql', 'ddl'] },

  // OS Questions
  { question: 'What is a deadlock? What are the necessary conditions?', answer: 'Deadlock conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait. All four must hold simultaneously.', category: 'os', difficulty: 'hard', company: 'General', tags: ['deadlock', 'concurrency'] },
  { question: 'What is virtual memory?', answer: 'An abstraction that gives each process the illusion of having its own large memory space, using disk as an extension of RAM via paging.', category: 'os', difficulty: 'medium', company: 'General', tags: ['memory management'] },
  { question: 'Explain the differences between paging and segmentation.', answer: 'Paging: fixed-size pages, no external fragmentation. Segmentation: variable-size logical units, supports user view of memory.', category: 'os', difficulty: 'hard', company: 'General', tags: ['memory'] },

  // CN Questions
  { question: 'What is the OSI model? Explain its 7 layers.', answer: 'Physical, Data Link, Network, Transport, Session, Presentation, Application. Each layer has specific responsibilities for network communication.', category: 'cn', difficulty: 'medium', company: 'General', tags: ['osi', 'networking'] },
  { question: 'What is the difference between TCP and UDP?', answer: 'TCP: connection-oriented, reliable, ordered. UDP: connectionless, faster, no guarantee of delivery. TCP for HTTP; UDP for video streaming.', category: 'cn', difficulty: 'easy', company: 'General', tags: ['tcp', 'udp', 'protocols'] },
  { question: 'What is DNS and how does it work?', answer: 'DNS maps domain names to IP addresses. Browser queries local cache → ISP DNS → Root DNS → TLD → Authoritative DNS.', category: 'cn', difficulty: 'medium', company: 'General', tags: ['dns', 'networking'] },

  // OOPs Questions
  { question: 'What are the four pillars of OOP?', answer: 'Encapsulation: data hiding. Abstraction: hiding complexity. Inheritance: reusing parent class. Polymorphism: many forms.', category: 'oops', difficulty: 'easy', company: 'General', tags: ['fundamentals'] },
  { question: 'What is the difference between abstraction and encapsulation?', answer: 'Abstraction hides implementation details (what to do). Encapsulation hides data (how it is stored) using access modifiers.', category: 'oops', difficulty: 'medium', company: 'General', tags: ['abstraction', 'encapsulation'] },
  { question: 'What is polymorphism? Explain compile-time vs runtime.', answer: 'Compile-time (method overloading): resolved at compile time. Runtime (method overriding): resolved at runtime via virtual functions.', category: 'oops', difficulty: 'medium', company: 'General', tags: ['polymorphism'] },

  // Aptitude Questions
  { question: 'A train 150m long passes a pole in 15 seconds. Find its speed in km/h.', answer: 'Speed = 150/15 = 10 m/s = 10 × 18/5 = 36 km/h', category: 'aptitude', difficulty: 'medium', company: 'General', tags: ['speed', 'distance'] },
  { question: 'If 2x + 3y = 12 and 3x + 2y = 13, find x + y.', answer: 'Add equations: 5x + 5y = 25, so x + y = 5', category: 'aptitude', difficulty: 'easy', company: 'General', tags: ['algebra'] },
  { question: 'In how many ways can 5 people be arranged in a row?', answer: '5! = 5 × 4 × 3 × 2 × 1 = 120 ways', category: 'aptitude', difficulty: 'easy', company: 'General', tags: ['permutation', 'combination'] },

  // Company-specific
  { question: 'Describe an algorithm to find the nth Fibonacci number efficiently.', answer: 'Use dynamic programming O(n) or matrix exponentiation O(log n). Naive recursion is O(2^n).', category: 'company', difficulty: 'medium', company: 'TCS', tags: ['fibonacci', 'dp'] },
  { question: 'What is REST API? What are the HTTP methods?', answer: 'REST: architectural style for APIs. Methods: GET (read), POST (create), PUT (update), DELETE (remove), PATCH (partial update).', category: 'company', difficulty: 'easy', company: 'Infosys', tags: ['api', 'web'] },
  { question: 'Explain the concept of microservices architecture.', answer: 'Application broken into small, independently deployable services. Each service has its own database and communicates via APIs. Enables scalability and independent deployment.', category: 'company', difficulty: 'hard', company: 'Amazon', tags: ['architecture', 'microservices'] },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await InterviewQuestion.deleteMany({});
    await InterviewQuestion.insertMany(sampleQuestions);

    console.log(`✅ Seeded ${sampleQuestions.length} interview questions successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDB();
