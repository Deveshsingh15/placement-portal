// data/dsaSheet.js - Striver A2Z DSA Sheet (curated subset)
export const DSA_TOPICS = [
  'Arrays', 'Strings', 'Linked List', 'Stack & Queue', 'Binary Search',
  'Sorting', 'Recursion', 'Trees', 'Graphs', 'Dynamic Programming',
  'Greedy', 'Tries', 'Backtracking', 'Heap', 'Bit Manipulation'
];

export const DSA_QUESTIONS = [
  // Arrays
  { id: 'arr-1', title: 'Set Matrix Zeroes', topic: 'Arrays', difficulty: 'medium', link: 'https://leetcode.com/problems/set-matrix-zeroes/' },
  { id: 'arr-2', title: 'Pascal\'s Triangle', topic: 'Arrays', difficulty: 'easy', link: 'https://leetcode.com/problems/pascals-triangle/' },
  { id: 'arr-3', title: 'Next Permutation', topic: 'Arrays', difficulty: 'medium', link: 'https://leetcode.com/problems/next-permutation/' },
  { id: 'arr-4', title: 'Kadane\'s Algorithm (Max Subarray)', topic: 'Arrays', difficulty: 'medium', link: 'https://leetcode.com/problems/maximum-subarray/' },
  { id: 'arr-5', title: 'Sort Colors (Dutch National Flag)', topic: 'Arrays', difficulty: 'medium', link: 'https://leetcode.com/problems/sort-colors/' },
  { id: 'arr-6', title: 'Best Time to Buy and Sell Stock', topic: 'Arrays', difficulty: 'easy', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
  { id: 'arr-7', title: 'Rotate Matrix by 90 degrees', topic: 'Arrays', difficulty: 'medium', link: 'https://leetcode.com/problems/rotate-image/' },
  { id: 'arr-8', title: 'Merge Overlapping Intervals', topic: 'Arrays', difficulty: 'medium', link: 'https://leetcode.com/problems/merge-intervals/' },
  { id: 'arr-9', title: 'Find the Duplicate Number', topic: 'Arrays', difficulty: 'medium', link: 'https://leetcode.com/problems/find-the-duplicate-number/' },
  { id: 'arr-10', title: 'Count Inversions (Merge Sort)', topic: 'Arrays', difficulty: 'hard', link: 'https://practice.geeksforgeeks.org/problems/inversion-of-array-1587115620/1' },

  // Strings
  { id: 'str-1', title: 'Reverse Words in a String', topic: 'Strings', difficulty: 'medium', link: 'https://leetcode.com/problems/reverse-words-in-a-string/' },
  { id: 'str-2', title: 'Longest Palindromic Substring', topic: 'Strings', difficulty: 'medium', link: 'https://leetcode.com/problems/longest-palindromic-substring/' },
  { id: 'str-3', title: 'Roman to Integer', topic: 'Strings', difficulty: 'easy', link: 'https://leetcode.com/problems/roman-to-integer/' },
  { id: 'str-4', title: 'Valid Anagram', topic: 'Strings', difficulty: 'easy', link: 'https://leetcode.com/problems/valid-anagram/' },
  { id: 'str-5', title: 'Count and Say', topic: 'Strings', difficulty: 'medium', link: 'https://leetcode.com/problems/count-and-say/' },
  { id: 'str-6', title: 'Rabin-Karp / KMP Algorithm', topic: 'Strings', difficulty: 'hard', link: 'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/' },
  { id: 'str-7', title: 'Minimum Window Substring', topic: 'Strings', difficulty: 'hard', link: 'https://leetcode.com/problems/minimum-window-substring/' },
  { id: 'str-8', title: 'Longest Common Prefix', topic: 'Strings', difficulty: 'easy', link: 'https://leetcode.com/problems/longest-common-prefix/' },

  // Linked List
  { id: 'll-1', title: 'Reverse a Linked List', topic: 'Linked List', difficulty: 'easy', link: 'https://leetcode.com/problems/reverse-linked-list/' },
  { id: 'll-2', title: 'Find Middle of Linked List', topic: 'Linked List', difficulty: 'easy', link: 'https://leetcode.com/problems/middle-of-the-linked-list/' },
  { id: 'll-3', title: 'Merge Two Sorted Lists', topic: 'Linked List', difficulty: 'easy', link: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
  { id: 'll-4', title: 'Detect Cycle in Linked List', topic: 'Linked List', difficulty: 'medium', link: 'https://leetcode.com/problems/linked-list-cycle/' },
  { id: 'll-5', title: 'Remove Nth Node From End', topic: 'Linked List', difficulty: 'medium', link: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' },
  { id: 'll-6', title: 'LRU Cache', topic: 'Linked List', difficulty: 'hard', link: 'https://leetcode.com/problems/lru-cache/' },

  // Stack & Queue
  { id: 'sq-1', title: 'Valid Parentheses', topic: 'Stack & Queue', difficulty: 'easy', link: 'https://leetcode.com/problems/valid-parentheses/' },
  { id: 'sq-2', title: 'Next Greater Element', topic: 'Stack & Queue', difficulty: 'easy', link: 'https://leetcode.com/problems/next-greater-element-i/' },
  { id: 'sq-3', title: 'Largest Rectangle in Histogram', topic: 'Stack & Queue', difficulty: 'hard', link: 'https://leetcode.com/problems/largest-rectangle-in-histogram/' },
  { id: 'sq-4', title: 'Sliding Window Maximum', topic: 'Stack & Queue', difficulty: 'hard', link: 'https://leetcode.com/problems/sliding-window-maximum/' },
  { id: 'sq-5', title: 'Min Stack', topic: 'Stack & Queue', difficulty: 'medium', link: 'https://leetcode.com/problems/min-stack/' },

  // Binary Search
  { id: 'bs-1', title: 'Binary Search', topic: 'Binary Search', difficulty: 'easy', link: 'https://leetcode.com/problems/binary-search/' },
  { id: 'bs-2', title: 'Search in Rotated Sorted Array', topic: 'Binary Search', difficulty: 'medium', link: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
  { id: 'bs-3', title: 'Find Minimum in Rotated Sorted Array', topic: 'Binary Search', difficulty: 'medium', link: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' },
  { id: 'bs-4', title: 'Kth Element of Two Sorted Arrays', topic: 'Binary Search', difficulty: 'hard', link: 'https://leetcode.com/problems/median-of-two-sorted-arrays/' },
  { id: 'bs-5', title: 'Aggressive Cows (Binary Search on Answer)', topic: 'Binary Search', difficulty: 'hard', link: 'https://practice.geeksforgeeks.org/problems/aggressive-cows/0' },

  // Sorting
  { id: 'sort-1', title: 'Bubble Sort', topic: 'Sorting', difficulty: 'easy', link: 'https://practice.geeksforgeeks.org/problems/bubble-sort/1' },
  { id: 'sort-2', title: 'Merge Sort', topic: 'Sorting', difficulty: 'medium', link: 'https://practice.geeksforgeeks.org/problems/merge-sort/1' },
  { id: 'sort-3', title: 'Quick Sort', topic: 'Sorting', difficulty: 'medium', link: 'https://practice.geeksforgeeks.org/problems/quick-sort/1' },
  { id: 'sort-4', title: 'Kth Largest Element in Array', topic: 'Sorting', difficulty: 'medium', link: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },

  // Recursion
  { id: 'rec-1', title: 'Subsets (Power Set)', topic: 'Recursion', difficulty: 'medium', link: 'https://leetcode.com/problems/subsets/' },
  { id: 'rec-2', title: 'Combination Sum', topic: 'Recursion', difficulty: 'medium', link: 'https://leetcode.com/problems/combination-sum/' },
  { id: 'rec-3', title: 'Permutations', topic: 'Recursion', difficulty: 'medium', link: 'https://leetcode.com/problems/permutations/' },
  { id: 'rec-4', title: 'N-Queens Problem', topic: 'Recursion', difficulty: 'hard', link: 'https://leetcode.com/problems/n-queens/' },

  // Trees
  { id: 'tree-1', title: 'Inorder, Preorder, Postorder Traversal', topic: 'Trees', difficulty: 'easy', link: 'https://leetcode.com/problems/binary-tree-inorder-traversal/' },
  { id: 'tree-2', title: 'Height of Binary Tree', topic: 'Trees', difficulty: 'easy', link: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
  { id: 'tree-3', title: 'Diameter of Binary Tree', topic: 'Trees', difficulty: 'easy', link: 'https://leetcode.com/problems/diameter-of-binary-tree/' },
  { id: 'tree-4', title: 'Lowest Common Ancestor', topic: 'Trees', difficulty: 'medium', link: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/' },
  { id: 'tree-5', title: 'Binary Tree Level Order Traversal', topic: 'Trees', difficulty: 'medium', link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
  { id: 'tree-6', title: 'Construct BT from Inorder & Preorder', topic: 'Trees', difficulty: 'hard', link: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/' },
  { id: 'tree-7', title: 'Serialize and Deserialize Binary Tree', topic: 'Trees', difficulty: 'hard', link: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/' },

  // Graphs
  { id: 'graph-1', title: 'BFS and DFS of Graph', topic: 'Graphs', difficulty: 'easy', link: 'https://practice.geeksforgeeks.org/problems/bfs-traversal-of-graph/1' },
  { id: 'graph-2', title: 'Number of Islands', topic: 'Graphs', difficulty: 'medium', link: 'https://leetcode.com/problems/number-of-islands/' },
  { id: 'graph-3', title: 'Detect Cycle in Directed Graph', topic: 'Graphs', difficulty: 'medium', link: 'https://practice.geeksforgeeks.org/problems/detect-cycle-in-a-directed-graph/1' },
  { id: 'graph-4', title: 'Topological Sort', topic: 'Graphs', difficulty: 'medium', link: 'https://practice.geeksforgeeks.org/problems/topological-sort/1' },
  { id: 'graph-5', title: 'Dijkstra\'s Algorithm', topic: 'Graphs', difficulty: 'medium', link: 'https://practice.geeksforgeeks.org/problems/implementing-dijkstra-set-1-adjacency-matrix/1' },
  { id: 'graph-6', title: 'Kruskal\'s / Prim\'s MST', topic: 'Graphs', difficulty: 'hard', link: 'https://practice.geeksforgeeks.org/problems/minimum-spanning-tree/1' },
  { id: 'graph-7', title: 'Strongly Connected Components (Kosaraju)', topic: 'Graphs', difficulty: 'hard', link: 'https://practice.geeksforgeeks.org/problems/strongly-connected-components-kosarajus-algo/1' },

  // Dynamic Programming
  { id: 'dp-1', title: 'Climbing Stairs', topic: 'Dynamic Programming', difficulty: 'easy', link: 'https://leetcode.com/problems/climbing-stairs/' },
  { id: 'dp-2', title: 'Fibonacci Number (DP)', topic: 'Dynamic Programming', difficulty: 'easy', link: 'https://leetcode.com/problems/fibonacci-number/' },
  { id: 'dp-3', title: '0/1 Knapsack Problem', topic: 'Dynamic Programming', difficulty: 'medium', link: 'https://practice.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1' },
  { id: 'dp-4', title: 'Longest Common Subsequence', topic: 'Dynamic Programming', difficulty: 'medium', link: 'https://leetcode.com/problems/longest-common-subsequence/' },
  { id: 'dp-5', title: 'Coin Change', topic: 'Dynamic Programming', difficulty: 'medium', link: 'https://leetcode.com/problems/coin-change/' },
  { id: 'dp-6', title: 'Longest Increasing Subsequence', topic: 'Dynamic Programming', difficulty: 'medium', link: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
  { id: 'dp-7', title: 'Edit Distance', topic: 'Dynamic Programming', difficulty: 'hard', link: 'https://leetcode.com/problems/edit-distance/' },
  { id: 'dp-8', title: 'Matrix Chain Multiplication', topic: 'Dynamic Programming', difficulty: 'hard', link: 'https://practice.geeksforgeeks.org/problems/matrix-chain-multiplication0303/1' },

  // Greedy
  { id: 'greed-1', title: 'Activity Selection Problem', topic: 'Greedy', difficulty: 'medium', link: 'https://practice.geeksforgeeks.org/problems/activity-selection-1587115620/1' },
  { id: 'greed-2', title: 'Fractional Knapsack', topic: 'Greedy', difficulty: 'medium', link: 'https://practice.geeksforgeeks.org/problems/fractional-knapsack-1587115620/1' },
  { id: 'greed-3', title: 'Jump Game', topic: 'Greedy', difficulty: 'medium', link: 'https://leetcode.com/problems/jump-game/' },

  // Tries
  { id: 'trie-1', title: 'Implement Trie (Prefix Tree)', topic: 'Tries', difficulty: 'medium', link: 'https://leetcode.com/problems/implement-trie-prefix-tree/' },
  { id: 'trie-2', title: 'Word Search II', topic: 'Tries', difficulty: 'hard', link: 'https://leetcode.com/problems/word-search-ii/' },

  // Heap
  { id: 'heap-1', title: 'Kth Largest in Stream', topic: 'Heap', difficulty: 'easy', link: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/' },
  { id: 'heap-2', title: 'Top K Frequent Elements', topic: 'Heap', difficulty: 'medium', link: 'https://leetcode.com/problems/top-k-frequent-elements/' },
  { id: 'heap-3', title: 'Merge K Sorted Lists', topic: 'Heap', difficulty: 'hard', link: 'https://leetcode.com/problems/merge-k-sorted-lists/' },

  // Bit Manipulation
  { id: 'bit-1', title: 'Single Number', topic: 'Bit Manipulation', difficulty: 'easy', link: 'https://leetcode.com/problems/single-number/' },
  { id: 'bit-2', title: 'Power Set using Bit Masking', topic: 'Bit Manipulation', difficulty: 'medium', link: 'https://leetcode.com/problems/subsets/' },
  { id: 'bit-3', title: 'Count Set Bits', topic: 'Bit Manipulation', difficulty: 'easy', link: 'https://leetcode.com/problems/number-of-1-bits/' },
];

export const TOTAL_QUESTIONS = DSA_QUESTIONS.length;
