export const QUESTION_BANK = [
    // --- FRONTEND QUESTIONS ---
    {
        id: "fe1",
        level: "Easy",
        category: "Frontend",
        title: "JSON Flattener",
        description: "Write a function that flattens a nested JSON object into a single-level object with dot-notation keys.",
        example: "Input: { a: { b: 1 } } -> Output: { 'a.b': 1 }",
        constraints: ["Keys are strings", "Values are numbers or objects"],
        starterCode: "function solve(obj) {\n  // return flattenedObj;\n}",
        starterCodePython: "def solve(obj):\n    # return flattened_dict\n    pass",
        starterCodeJava: "public class Solution {\n    public String solve(String json) {\n        // implementation\n        return \"\";\n    }\n}",
        testCases: [
            { args: [{ "a": { "b": 1 } }], expected: { "a.b": 1 } },
            { args: [{ "x": 1, "y": { "z": 2 } }], expected: { "x": 1, "y.z": 2 } }
        ]
    },
    {
        id: "fe2",
        level: "Easy",
        category: "Frontend",
        title: "Reverse String",
        description: "Return the reverse of a string.",
        example: "Input: 'hello' -> Output: 'olleh'",
        constraints: [],
        starterCode: "function solve(str) {\n  return str.split('').reverse().join('');\n}",
        starterCodePython: "def solve(str):\n    return str[::-1]",
        starterCodeJava: "public class Solution {\n    public String solve(String s) {\n        return new StringBuilder(s).reverse().toString();\n    }\n}",
        testCases: [
            { args: ["hello"], expected: "olleh" },
            { args: ["React"], expected: "tcaeR" },
            { args: [""], expected: "" }
        ]
    },
    {
        id: "fe3",
        level: "Medium",
        category: "Frontend",
        title: "Deep Clone",
        description: "Implement a deep clone function for an object (no circular refs).",
        example: "Input: {a:1} -> Output: {a:1} (new ref)",
        constraints: [],
        starterCode: "function solve(obj) {\n  // return clonedObj;\n  return JSON.parse(JSON.stringify(obj));\n}",
        starterCodePython: "def solve(obj):\n    import copy\n    return copy.deepcopy(obj)",
        starterCodeJava: "public class Solution {\n    // Simulation\n    public boolean solve(boolean x) { return x; }\n}",
        testCases: [
            { args: [{a:1}], expected: {a:1} }
        ]
    },

    // --- BACKEND QUESTIONS ---
    {
        id: "be1",
        level: "Medium",
        category: "Backend",
        title: "Rate Limiter Logic",
        description: "Implement a function that returns true only if requests < 5 within last 10 units.",
        example: "Input: [1, 1, 1, 1, 1, 11] -> Output: [true... true]",
        constraints: [],
        starterCode: "function solve(requests) {\n  // return booleans\n  return requests.map(() => true);\n}",
        starterCodePython: "def solve(reqs):\n    return [True] * len(reqs)",
        starterCodeJava: "public class Solution {\n    public boolean[] solve(int[] r) {\n        return new boolean[r.length];\n    }\n}",
        testCases: [
             { args: [[1]], expected: [true] }
        ]
    },
    {
        id: "be2",
        level: "Easy",
        category: "Backend",
        title: "FizzBuzz API",
        description: "Return array of n strings. 'Fizz' for div by 3, 'Buzz' for div by 5.",
        example: "Input: 3 -> Output: ['1','2','Fizz']",
        constraints: ["1 <= n <= 100"],
        starterCode: "function solve(n) {\n  // implementation\n}",
        starterCodePython: "def solve(n):\n    pass",
        starterCodeJava: "public class Solution {\n    public String[] solve(int n) {\n        return new String[0];\n    }\n}",
        testCases: [
            { args: [3], expected: ["1", "2", "Fizz"] }
        ]
    },
    {
        id: "be3",
        level: "Medium",
        category: "Backend",
        title: "Valid Parentheses (Auth)",
        description: "Check if auth token brackets are valid: '()', '{}', '[]'.",
        example: "Input: '()[]{}' -> Output: true",
        constraints: [],
        starterCode: "function solve(s) {\n  \n}",
        starterCodePython: "def solve(s):\n    pass",
        starterCodeJava: "public class Solution {\n    public boolean solve(String s) {\n        return true;\n    }\n}",
        testCases: [
            { args: ["()"], expected: true },
            { args: ["(]"], expected: false }
        ]
    },

    // --- DATABASE QUESTIONS ---
    {
        id: "db1",
        level: "Hard",
        category: "Database",
        title: "In-Memory Join",
        description: "Given arrays Users and Orders, join them on 'id' = 'userId'. Return array of {id, name, product}.",
        example: "Input: Users=[{id:1, name:'A'}], Orders=[{userId:1, prod:'X'}] -> Output: [{id:1, name:'A', prod:'X'}]",
        constraints: ["O(n*m) okay", "Keys usually match"],
        starterCode: "function solve(users, orders) {\n  // return joinedArray\n}",
        starterCodePython: "def solve(users, orders):\n    pass",
        starterCodeJava: "public class Solution {\n    // Mock signature\n    public int solve(int x) { return x; }\n}",
        testCases: [
            { 
                args: [[{id:1, name:'A'}], [{userId:1, product:'X'}]], 
                expected: [{id:1, name:'A', userId:1, product:'X'}] 
            }
        ]
    },
    {
        id: "db2",
        level: "Medium",
        category: "Database",
        title: "Find Duplicate ID",
        description: "Find the duplicate ID in a list of primary keys.",
        example: "Input: [1,3,4,2,2] -> Output: 2",
        constraints: [],
        starterCode: "function solve(ids) {\n  \n}",
        starterCodePython: "def solve(ids):\n    pass",
        starterCodeJava: "public class Solution {\n    public int solve(int[] nums) {\n        return 0;\n    }\n}",
        testCases: [
            { args: [[1, 3, 4, 2, 2]], expected: 2 }
        ]
    },
    {
        id: "db3",
        level: "Medium",
        category: "Database",
        title: "Group By Category",
        description: "Group an array of objects by a specific key property.",
        example: "Input: [{k:'a', v:1}, {k:'a', v:2}], 'k' -> Output: {a: [{k:'a', v:1}, {k:'a', v:2}]}",
        constraints: [],
        starterCode: "function solve(items, key) {\n  \n}",
        starterCodePython: "def solve(items, key):\n    pass",
        starterCodeJava: "public class Solution {\n    public int solve(int x) { return x; }\n}",
        testCases: [
            { 
               args: [[{k:'a', v:1}], 'k'], 
               expected: {a: [{k:'a', v:1}]} 
            }
        ]
    }
];
