export const MOCK_TOPICS = {
  recursion: {
    title: "Recursion in Programming",
    category: "Programming",
    icon: "code",
    color: "from-blue-500 to-indigo-600",
    remember: "Recursion = A function calling itself with a stopping condition (base case).",
    code: `def countdown(n):
    if n == 0:  # Base Case: Stop here!
        return
    print(n)
    countdown(n - 1)  # Recursive Call: Do it again!`,
    ageContent: {
      child: "Imagine you have a stack of Russian Nesting Dolls. To find the secret treasure in the middle, you have to open the big doll, then open the smaller doll inside, and keep doing the same thing until you find the tiny solid doll at the center that cannot be opened. In code, recursion is when a helper instruction calls itself to do a smaller version of the same job until it reaches the stop signal!",
      teen: "Recursion is like the movie *Inception* for code—it's a function that calls itself to solve a smaller piece of a problem. Instead of using normal loops like 'for' or 'while', the function breaks the task down and calls a new copy of itself. It keeps diving deeper until it reaches a 'stop' command called the base case, and then climbs back out.",
      college: "Recursion is a fundamental programming paradigm where a function calls itself directly or indirectly. It divides a complex problem into sub-problems of the same form (divide-and-conquer). Each recursive call is pushed onto the system call stack. Crucially, a base case must be defined to wind down the stack and prevent a stack overflow error.",
      adult: "In software engineering, recursion is a design pattern where a method calls itself to process hierarchical structures, like directory trees or organization charts. It allows for clean, readable code by replacing complex loop states, though it requires consideration of call stack overhead and space complexity (O(N) stack frames)."
    },
    styleContent: {
      "Simple Explanation": "Recursion is when a function solves a problem by calling a smaller copy of itself. It requires a starting input, a recursive step to shrink the input, and a base case to know when to stop.",
      "Examples": "Let's trace countdown(3):\n- countdown(3) prints 3, then calls countdown(2)\n- countdown(2) prints 2, then calls countdown(1)\n- countdown(1) prints 1, then calls countdown(0)\n- countdown(0) hits the base case (n == 0) and stops! Output: 3, 2, 1.",
      "Step-by-Step": "1. **Define the Base Case**: Set the boundary condition where recursion stops.\n2. **Create the Recursive Step**: Write the function to perform its task and call itself.\n3. **Reduce Input Size**: Ensure each call moves closer to the base case to avoid crashing your memory.",
      "Visual / Diagram": "countdown(3)\n └── Prints 3, calls countdown(2)\n      └── Prints 2, calls countdown(1)\n           └── Prints 1, calls countdown(0)\n                └── Base case (0 == 0) reached! Winding down...",
      "Story-based": "Imagine you are lost in a maze and find a series of locked wooden boxes. A note says 'The key is in the smallest box.' You open Box 1, find Box 2 inside. Open Box 2, find Box 3 inside. You repeat this opening process (recursive step) until you reach Box 10, which contains the key (base case). You take the key and walk all the way back out!",
      "Interactive Practice": "We have loaded a series of interactive practice challenges below to help you master base cases and stack frames!"
    },
    analogy: {
      child: "It's like standing between two mirrors and seeing infinite smaller reflections of yourself fading into the distance.",
      teen: "It's like Googling the word 'recursion'—Google asks, 'Did you mean: *recursion*?' and clicking it just reloads the same search!",
      college: "It is analogous to mathematical induction, where you establish a base case for n=0, and then prove the inductive step for n from n-1.",
      adult: "Think of it like files in nested folders. To search the entire drive, you open a folder, search it, and for every folder inside, you repeat the exact same search process."
    },
    practice: [
      {
        question: "What happens when a recursive function reaches its base condition?",
        options: [
          "It throws a stack overflow error",
          "It stops calling itself and returns",
          "It resets the function variables to zero",
          "It loops back to the main method"
        ],
        correct: 1,
        explanation: "The base case is the stopping condition. When hit, the function ceases calling itself and returns execution back through the call stack."
      },
      {
        question: "What error occurs if a recursive function has no base case or never reaches it?",
        options: [
          "Syntax Error",
          "Null Pointer Exception",
          "Stack Overflow Error",
          "Index Out Of Bounds"
        ],
        correct: 2,
        explanation: "Without a base case, the function calls itself indefinitely, exhausting the call stack memory limit and throwing a Stack Overflow error."
      }
    ]
  },
  photosynthesis: {
    title: "Photosynthesis",
    category: "Science",
    icon: "droplet",
    color: "from-green-500 to-emerald-600",
    remember: "Photosynthesis: Sunlight + Carbon Dioxide + Water ──> Glucose (energy) + Oxygen (byproduct).",
    code: `6CO2 + 6H2O + Light Energy ──> C6H12O6 + 6O2`,
    ageContent: {
      child: "Photosynthesis is how plants cook their own food! Instead of using a kitchen stove, they use warm sunlight. They take water from the soil, air from around them, and sunbeams from the sky to bake sweet sugar cookies for energy, then breathe out clean oxygen for us to breathe!",
      teen: "Photosynthesis is the chemical process plants use to convert sunlight, carbon dioxide, and water into glucose (sugar) which they use for growth and energy. Oxygen is released as a waste product. This entire operation occurs inside green cellular structures called chloroplasts.",
      college: "Photosynthesis is a multi-stage biochemical process. In the Light-Dependent Reactions, chlorophyll pigments absorb photons, splitting water (photolysis) to generate ATP, NADPH, and O2. In the Light-Independent Reactions (Calvin Cycle), ATP and NADPH are consumed to fix CO2 into G3P (sugars).",
      adult: "Photosynthesis is the primary solar-to-chemical energy conversion process sustaining the biosphere. It captures atmospheric carbon dioxide and transforms it into organic biomass, serving as the basis of the global food web and driving the carbon-oxygen cycle."
    },
    styleContent: {
      "Simple Explanation": "Plants absorb light energy from the sun, carbon dioxide from the air, and water from the soil. They convert these into glucose (energy) and release oxygen as a byproduct.",
      "Examples": "Think of a houseplant. Without sunlight or water, it cannot perform photosynthesis, meaning it cannot produce glucose and will eventually wither, regardless of how much soil nutrients are present.",
      "Step-by-Step": "1. **Light Capture**: Chlorophyll pigments in leaves absorb solar light.\n2. **Water Photolysis**: Roots draw water, which light splits into hydrogen and oxygen.\n3. **Carbon Fixation**: The leaf absorbs carbon dioxide through tiny pores called stomata.\n4. **Sugar Production**: Plant uses chemical energy to synthesize glucose, storing it as starch.",
      "Visual / Diagram": "Sunlight (Energy) + 6 CO2 (Air) + 6 H2O (Water)\n       ↓ (Reaction in Chloroplasts)\n C6H12O6 (Sugar Energy) + 6 O2 (Fresh Oxygen)",
      "Story-based": "Imagine a leaf is a solar-powered bakery. The sun acts as electricity for the oven. Water acts as milk pumped from the ground pipes. Carbon dioxide is the flour gathered from the air. The bakers (chlorophyll) mix them together to bake sweet energy bread, throwing the leftover baking papers (oxygen) out the windows!",
      "Interactive Practice": "Let's review plant cellular anatomy and test your knowledge of light reactions!"
    },
    analogy: {
      child: "It's like plants having natural solar panels on their leaves that cook lunch!",
      teen: "It is like charging a battery. Sunlight is the electricity, the leaf is the charging cable, and glucose is the stored power in the battery.",
      college: "It functions like an organic solar-powered fuel cell, converting photon energy into chemical potential stored within molecular bonds.",
      adult: "Think of it as nature's carbon capture technology, pulling carbon emissions out of the atmosphere and converting them into organic building blocks."
    },
    practice: [
      {
        question: "Which green pigment in plants is responsible for absorbing sunlight?",
        options: [
          "Carotenoid",
          "Chlorophyll",
          "Hemoglobin",
          "Melanin"
        ],
        correct: 1,
        explanation: "Chlorophyll is the primary pigment in chloroplasts that absorbs red and blue light waves to drive photosynthesis."
      },
      {
        question: "What gas is released as a byproduct during photosynthesis?",
        options: [
          "Carbon Dioxide",
          "Nitrogen",
          "Hydrogen",
          "Oxygen"
        ],
        correct: 3,
        explanation: "Oxygen is produced when water molecules are split in the light reactions, and it is released through stomata."
      }
    ]
  },
  binary: {
    title: "Binary Number System",
    category: "Mathematics",
    icon: "hash",
    color: "from-amber-500 to-orange-600",
    remember: "Binary is Base-2, meaning columns represent powers of 2 (1, 2, 4, 8, 16...) instead of 10.",
    code: `Decimal 9 = 8 + 1 = (1 * 8) + (0 * 4) + (0 * 2) + (1 * 1) = 1001 in Binary`,
    ageContent: {
      child: "Computers do not understand letters or normal numbers. They can only read two things: ON or OFF! We write ON as 1 and OFF as 0. By switching these 0s and 1s very fast, computers can show pictures, play videos, and do math. It's like writing secret messages using a flashlight!",
      teen: "Binary is a base-2 number system that uses only two digits: 0 and 1. While we count in base-10 (0 to 9), computers count in base-2. In binary, column values double as you go left (1s, 2s, 4s, 8s, 16s, etc.). So binary '1010' is one 8, zero 4s, one 2, and zero 1s, which equals 10 in our normal system.",
      college: "Binary is a positional numeral system using a radix of 2. It is implemented in computer hardware via transistors operating as digital switches (logic high for 1, logic low for 0). Numbers, characters, and instructions are encoded as strings of bits, which logic gates manipulate according to Boolean algebra.",
      adult: "Binary is the foundation of digital architecture. All software compiles down to machine code represented in bits. Understanding binary is crucial for low-level systems programming, network subnetting, cryptography, and optimizing data structures for memory efficiency."
    },
    styleContent: {
      "Simple Explanation": "Binary is a base-2 counting system using only 0 and 1. Each column from right to left represents a power of two: 1, 2, 4, 8, 16, 32, etc.",
      "Examples": "To write the number 13 in binary:\n- We need: one 8, one 4, zero 2s, and one 1 (8 + 4 + 0 + 1 = 13).\n- That corresponds to: [8s: 1] [4s: 1] [2s: 0] [1s: 1].\n- So 13 is written as 1101.",
      "Step-by-Step": "1. **List Powers of 2**: Write columns from right to left: 16, 8, 4, 2, 1.\n2. **Compare**: Find the largest power of 2 less than or equal to your decimal number.\n3. **Place a '1'**: Put a 1 in that column and subtract the value from your number.\n4. **Repeat**: Move to the next column. If the remaining number fits, write 1 and subtract; otherwise, write 0. Repeat until finished.",
      "Visual / Diagram": "Decimal 6 in Binary:\nColumns:  8   4   2   1\nBits:     0   1   1   0  ===> 4 + 2 = 6\nBinary Code: 0110 (or 110)",
      "Story-based": "Imagine a bakery that only packages donuts in boxes of 1, 2, 4, 8, and 16. If a customer orders 11 donuts, the baker works backwards: he grabs one 8-box, cannot fit a 4-box (too large), grabs one 2-box (leaving 1), and grabs one 1-box. He writes the box checklist as: 1 (eight), 0 (four), 1 (two), 1 (one) — resulting in code 1011!",
      "Interactive Practice": "We have loaded decimal-to-binary flashcard matching games below!"
    },
    analogy: {
      child: "It's like a row of lightbulbs. Each bulb can only be on or off, and together they write a secret message.",
      teen: "It is like Morse code, but instead of dots and dashes, you are only allowed to use switch flips (up or down).",
      college: "It represents coordinates in a hypercube space, where each vertex corresponds to a specific binary vector.",
      adult: "Think of it like a series of locks along a canal. Each lock is either open (1) or closed (0), regulating the downstream flow of information."
    },
    practice: [
      {
        question: "What decimal value corresponds to the binary number 1011?",
        options: [
          "9",
          "11",
          "13",
          "15"
        ],
        correct: 1,
        explanation: "1011 is: (1 * 8) + (0 * 4) + (1 * 2) + (1 * 1) = 8 + 0 + 2 + 1 = 11."
      },
      {
        question: "What is the binary representation of decimal 4?",
        options: [
          "010",
          "100",
          "110",
          "101"
        ],
        correct: 1,
        explanation: "Decimal 4 matches the 4s column exactly, meaning one 4, zero 2s, and zero 1s, which is written as 100."
      }
    ]
  }
};

// Fallback dynamic explanation generator for search terms not preloaded
export function generateDynamicExplanation(question, prefs) {
  const query = question.trim().replace(/[?.]/g, '');
  const title = query.charAt(0).toUpperCase() + query.slice(1);
  const words = query.split(" ");
  const keyword = words[words.length - 1] || "concept";

  return {
    title: title,
    category: "General Knowledge",
    icon: "help-circle",
    color: "from-violet-500 to-purple-600",
    remember: `Remember: ${title} is governed by basic principles adapted to your ${prefs.difficulty} level.`,
    code: `# Conceptual overview of ${title}\nprint("${title} explained for a ${prefs.ageGroup} level")`,
    ageContent: {
      child: `Let's talk about ${title}! Imagine you are playing on a giant playground. ${title} is just like a slide or a swing where things work by simple rules. Basically, it means that ${keyword} is doing a special helper job to make everything go smoothly!`,
      teen: `So, you've probably wondered about ${title}. It's actually a pretty cool concept. Think of ${title} like a game controller or a social app feed—it acts behind the scenes using basic instructions. Essentially, ${keyword} works by organizing small inputs to produce a steady outcome.`,
      college: `${title} is a system studied in academics. Under analysis, ${title} operates on principles of variable inputs and predictable cycles. At its core, the dynamics of ${keyword} represent a structured framework where individual components interact to maintain equilibrium.`,
      adult: `From a practical perspective, understanding ${title} is crucial for navigating modern operational systems. Whether analyzing market cycles or workflow structures, ${title} demonstrates how key drivers influence the behavior of ${keyword} to optimize performance and yield efficiency.`
    },
    styleContent: {
      "Simple Explanation": `In simple terms, ${title} is a process where inputs are processed systematically to achieve a stable explanation of ${keyword}.`,
      "Examples": `For example, think about how you interact with ${keyword} daily. If you adjust one component, the overall state shifts accordingly to balance the equation.`,
      "Step-by-Step": `1. **Initiate**: The system registers a change in ${keyword}.\n2. **Process**: Components filter the inputs.\n3. **Stabilize**: The outputs balance out into a final state.`,
      "Visual / Diagram": `[Initial Input] ──> (System Filters: ${keyword}) ──> [Resulting State/Output]`,
      "Story-based": `Once upon a time in a busy little town, there was a chef named ${keyword}. Every day, he cooked a special recipe. He gathered fresh ingredients from neighbors, mixed them in a large pot, and made a delicious soup that kept the town happy. That pot-mixing is exactly how ${title} works!`,
      "Interactive Practice": "We've generated custom quiz questions below to test your command of this subject."
    },
    analogy: {
      child: `It is like a puzzle where pieces lock together perfectly to create a beautiful image.`,
      teen: `It's like sorting your Spotify playlist—putting similar tracks together so the vibe flows naturally.`,
      college: `It is analogous to a feedback loop in a cybernetic circuit, adjusting state based on error signals.`,
      adult: `Think of it like project management: allocating tasks to specific channels to meet a unified objective.`
    },
    practice: [
      {
        question: `Which statement best describes the core mechanic of ${title}?`,
        options: [
          "It operates at random without inputs",
          "It processes inputs in a structured cycle",
          "It only works in digital software systems",
          "It has no real-world application"
        ],
        correct: 1,
        explanation: `As explained in the ${prefs.learningLevel} level overview, ${title} is a structured cycle that processes inputs predictably.`
      },
      {
        question: `Why is understanding ${keyword} important in this context?`,
        options: [
          "It is not important at all",
          "It forms the basis of the system's inputs",
          "It replaces the need for electricity",
          "It deletes all variables automatically"
        ],
        correct: 1,
        explanation: `${keyword.toUpperCase()} is the key component being adjusted, making it the foundation of the system's inputs.`
      }
    ]
  };
}
