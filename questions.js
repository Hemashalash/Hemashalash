/**
 * Question Bank
 * Each question: { subject, minGrade, maxGrade, difficulty, type, curriculum,
 *   question, options?, answer, explanation? }
 *
 * subject:    "math" | "english" | "science" | "physics" | "chemistry" |
 *             "biology" | "social_studies" | "history" | "geography" |
 *             "computer_science" | "arabic" | "islamic_studies"
 * minGrade / maxGrade: 0 (KG) – 12
 * difficulty: "easy" | "medium" | "hard"
 * type:       "mcq" | "true_false" | "short_answer"
 * curriculum: "all" | "us" | "british" | "uae" | "ib" | "cbse" | "australian"
 * options:    [A, B, C, D]  (MCQ only)
 * answer:     "A"/"B"/"C"/"D" for MCQ, "True"/"False" for T/F, text for short_answer
 */

const QUESTION_BANK = [

  // ═══════════════════════════════════════════════
  //  MATHEMATICS
  // ═══════════════════════════════════════════════

  // Grades 1–3 · Easy
  { subject:"math", minGrade:1, maxGrade:3, difficulty:"easy", type:"mcq", curriculum:"all",
    question:"What is 8 + 5?",
    options:["11","12","13","14"], answer:"C", explanation:"8 + 5 = 13" },

  { subject:"math", minGrade:1, maxGrade:3, difficulty:"easy", type:"mcq", curriculum:"all",
    question:"What is 15 − 7?",
    options:["6","7","8","9"], answer:"C", explanation:"15 − 7 = 8" },

  { subject:"math", minGrade:1, maxGrade:3, difficulty:"easy", type:"true_false", curriculum:"all",
    question:"5 × 3 = 15", answer:"True" },

  { subject:"math", minGrade:1, maxGrade:3, difficulty:"easy", type:"mcq", curriculum:"all",
    question:"How many sides does a triangle have?",
    options:["2","3","4","5"], answer:"B", explanation:"A triangle always has 3 sides." },

  { subject:"math", minGrade:1, maxGrade:3, difficulty:"easy", type:"short_answer", curriculum:"all",
    question:"Write the number that comes after 29.", answer:"30" },

  { subject:"math", minGrade:1, maxGrade:3, difficulty:"medium", type:"mcq", curriculum:"all",
    question:"A shop has 24 apples. If 9 are sold, how many remain?",
    options:["13","14","15","16"], answer:"C", explanation:"24 − 9 = 15" },

  { subject:"math", minGrade:1, maxGrade:3, difficulty:"medium", type:"short_answer", curriculum:"all",
    question:"What is the value of 6 × 7?", answer:"42" },

  // Grades 4–6 · Easy
  { subject:"math", minGrade:4, maxGrade:6, difficulty:"easy", type:"mcq", curriculum:"all",
    question:"What is 144 ÷ 12?",
    options:["10","11","12","13"], answer:"C", explanation:"144 ÷ 12 = 12" },

  { subject:"math", minGrade:4, maxGrade:6, difficulty:"easy", type:"true_false", curriculum:"all",
    question:"The number 37 is a prime number.", answer:"True",
    explanation:"37 has no divisors other than 1 and 37." },

  { subject:"math", minGrade:4, maxGrade:6, difficulty:"easy", type:"mcq", curriculum:"all",
    question:"Which fraction is equivalent to 1/2?",
    options:["2/5","3/6","4/10","3/8"], answer:"B", explanation:"3/6 simplifies to 1/2." },

  { subject:"math", minGrade:4, maxGrade:6, difficulty:"medium", type:"mcq", curriculum:"all",
    question:"What is the area of a rectangle with length 9 cm and width 4 cm?",
    options:["26 cm²","32 cm²","36 cm²","40 cm²"], answer:"C", explanation:"Area = 9 × 4 = 36 cm²" },

  { subject:"math", minGrade:4, maxGrade:6, difficulty:"medium", type:"short_answer", curriculum:"all",
    question:"Convert 3/4 to a decimal.", answer:"0.75" },

  { subject:"math", minGrade:4, maxGrade:6, difficulty:"hard", type:"mcq", curriculum:"all",
    question:"A car travels at 60 km/h. How far does it travel in 2.5 hours?",
    options:["120 km","140 km","150 km","160 km"], answer:"C", explanation:"Distance = 60 × 2.5 = 150 km" },

  // Grades 7–9 · Easy
  { subject:"math", minGrade:7, maxGrade:9, difficulty:"easy", type:"mcq", curriculum:"all",
    question:"What is the value of 3x − 5 when x = 4?",
    options:["5","7","8","12"], answer:"B", explanation:"3(4) − 5 = 12 − 5 = 7" },

  { subject:"math", minGrade:7, maxGrade:9, difficulty:"easy", type:"true_false", curriculum:"all",
    question:"The square root of 81 is 9.", answer:"True" },

  { subject:"math", minGrade:7, maxGrade:9, difficulty:"medium", type:"mcq", curriculum:"all",
    question:"Solve for x: 2x + 6 = 18",
    options:["4","5","6","7"], answer:"C", explanation:"2x = 12, so x = 6" },

  { subject:"math", minGrade:7, maxGrade:9, difficulty:"medium", type:"mcq", curriculum:"all",
    question:"What is the perimeter of a regular hexagon with side length 5 cm?",
    options:["25 cm","30 cm","35 cm","40 cm"], answer:"B", explanation:"Perimeter = 6 × 5 = 30 cm" },

  { subject:"math", minGrade:7, maxGrade:9, difficulty:"hard", type:"short_answer", curriculum:"all",
    question:"Find the slope of a line passing through (2, 3) and (6, 11).", answer:"2",
    explanation:"Slope = (11−3)/(6−2) = 8/4 = 2" },

  { subject:"math", minGrade:7, maxGrade:9, difficulty:"hard", type:"mcq", curriculum:"all",
    question:"What is 15% of 240?",
    options:["30","34","36","40"], answer:"C", explanation:"15% × 240 = 36" },

  // Grades 10–12 · Medium
  { subject:"math", minGrade:10, maxGrade:12, difficulty:"easy", type:"mcq", curriculum:"all",
    question:"What is sin(30°)?",
    options:["0","0.5","√2/2","√3/2"], answer:"B", explanation:"sin(30°) = 1/2 = 0.5" },

  { subject:"math", minGrade:10, maxGrade:12, difficulty:"medium", type:"mcq", curriculum:"all",
    question:"What is the derivative of f(x) = 3x² + 5x − 2?",
    options:["3x + 5","6x + 5","6x − 2","3x² + 5"], answer:"B", explanation:"f'(x) = 6x + 5" },

  { subject:"math", minGrade:10, maxGrade:12, difficulty:"medium", type:"true_false", curriculum:"all",
    question:"The equation x² + 4 = 0 has real solutions.", answer:"False",
    explanation:"x² = −4 has no real solutions; only complex ones." },

  { subject:"math", minGrade:10, maxGrade:12, difficulty:"hard", type:"short_answer", curriculum:"all",
    question:"Evaluate: log₂(64)", answer:"6", explanation:"2⁶ = 64" },

  { subject:"math", minGrade:10, maxGrade:12, difficulty:"hard", type:"mcq", curriculum:"all",
    question:"Which of the following is the expansion of (x + y)²?",
    options:["x² + y²","x² + xy + y²","x² + 2xy + y²","2x + 2y"], answer:"C" },

  // ═══════════════════════════════════════════════
  //  ENGLISH LANGUAGE ARTS
  // ═══════════════════════════════════════════════

  { subject:"english", minGrade:1, maxGrade:3, difficulty:"easy", type:"mcq", curriculum:"all",
    question:"Which word is a noun?",
    options:["Run","Happy","Dog","Quickly"], answer:"C", explanation:"'Dog' is a person, place, or thing — a noun." },

  { subject:"english", minGrade:1, maxGrade:3, difficulty:"easy", type:"true_false", curriculum:"all",
    question:"A sentence always starts with a capital letter.", answer:"True" },

  { subject:"english", minGrade:1, maxGrade:3, difficulty:"easy", type:"mcq", curriculum:"all",
    question:"What is the plural of 'child'?",
    options:["Childs","Childes","Children","Childrens"], answer:"C" },

  { subject:"english", minGrade:1, maxGrade:3, difficulty:"medium", type:"short_answer", curriculum:"all",
    question:"Write the past tense of the verb 'go'.", answer:"went" },

  { subject:"english", minGrade:4, maxGrade:6, difficulty:"easy", type:"mcq", curriculum:"all",
    question:"Which sentence uses correct punctuation?",
    options:["Where are you going","Where are you going?","Where are you, going?","Where are you going!"], answer:"B" },

  { subject:"english", minGrade:4, maxGrade:6, difficulty:"medium", type:"mcq", curriculum:"all",
    question:"What does the word 'benevolent' mean?",
    options:["Cruel","Well-meaning and kind","Angry","Confused"], answer:"B" },

  { subject:"english", minGrade:4, maxGrade:6, difficulty:"medium", type:"true_false", curriculum:"all",
    question:"An adverb modifies a noun.", answer:"False",
    explanation:"An adverb modifies a verb, adjective, or another adverb." },

  { subject:"english", minGrade:4, maxGrade:6, difficulty:"hard", type:"short_answer", curriculum:"all",
    question:"Identify the literary device in: 'The wind whispered through the trees'.", answer:"Personification" },

  { subject:"english", minGrade:7, maxGrade:9, difficulty:"easy", type:"mcq", curriculum:"all",
    question:"Which of the following is an example of a simile?",
    options:["The moon is a silver coin","She ran like the wind","The trees danced","Time is money"], answer:"B" },

  { subject:"english", minGrade:7, maxGrade:9, difficulty:"medium", type:"mcq", curriculum:"all",
    question:"What is the theme of a story?",
    options:["The setting of the story","The main character's name","The central message or lesson","The plot summary"], answer:"C" },

  { subject:"english", minGrade:7, maxGrade:9, difficulty:"hard", type:"short_answer", curriculum:"all",
    question:"Explain the difference between 'affect' and 'effect'.",
    answer:"'Affect' is usually a verb meaning to influence; 'effect' is usually a noun meaning a result." },

  { subject:"english", minGrade:10, maxGrade:12, difficulty:"medium", type:"mcq", curriculum:"all",
    question:"Which rhetorical device involves asking a question that doesn't require an answer?",
    options:["Anaphora","Hyperbole","Rhetorical question","Alliteration"], answer:"C" },

  { subject:"english", minGrade:10, maxGrade:12, difficulty:"hard", type:"short_answer", curriculum:"all",
    question:"What is the difference between a foil character and an antagonist?",
    answer:"A foil contrasts with the protagonist to highlight their traits; an antagonist actively opposes the protagonist." },

  // ═══════════════════════════════════════════════
  //  GENERAL SCIENCE
  // ═══════════════════════════════════════════════

  { subject:"science", minGrade:1, maxGrade:3, difficulty:"easy", type:"mcq", curriculum:"all",
    question:"Which of these is a living thing?",
    options:["Rock","Water","Tree","Air"], answer:"C" },

  { subject:"science", minGrade:1, maxGrade:3, difficulty:"easy", type:"true_false", curriculum:"all",
    question:"The Sun is a star.", answer:"True" },

  { subject:"science", minGrade:1, maxGrade:3, difficulty:"easy", type:"mcq", curriculum:"all",
    question:"What do plants need to make their own food?",
    options:["Darkness and water","Sunlight, water, and carbon dioxide","Oxygen only","Soil only"], answer:"B" },

  { subject:"science", minGrade:1, maxGrade:3, difficulty:"medium", type:"short_answer", curriculum:"all",
    question:"Name the three states of matter.", answer:"Solid, liquid, and gas" },

  { subject:"science", minGrade:4, maxGrade:6, difficulty:"easy", type:"mcq", curriculum:"all",
    question:"What is the process by which water vapor turns into liquid water called?",
    options:["Evaporation","Condensation","Precipitation","Transpiration"], answer:"B" },

  { subject:"science", minGrade:4, maxGrade:6, difficulty:"easy", type:"true_false", curriculum:"all",
    question:"The Earth revolves around the Moon.", answer:"False",
    explanation:"The Moon revolves around the Earth, and the Earth revolves around the Sun." },

  { subject:"science", minGrade:4, maxGrade:6, difficulty:"medium", type:"mcq", curriculum:"all",
    question:"Which organ pumps blood around the body?",
    options:["Lungs","Brain","Heart","Liver"], answer:"C" },

  { subject:"science", minGrade:4, maxGrade:6, difficulty:"medium", type:"mcq", curriculum:"all",
    question:"What type of rock is formed from cooled lava?",
    options:["Sedimentary","Metamorphic","Igneous","Fossil"], answer:"C" },

  { subject:"science", minGrade:4, maxGrade:6, difficulty:"hard", type:"short_answer", curriculum:"all",
    question:"Explain why the sky appears blue.", answer:"Sunlight is scattered by gas molecules in the atmosphere; blue light scatters more than other colors due to its shorter wavelength." },

  { subject:"science", minGrade:7, maxGrade:9, difficulty:"easy", type:"mcq", curriculum:"all",
    question:"What is the chemical symbol for water?",
    options:["WO","H₂O","HO₂","W₂O"], answer:"B" },

  { subject:"science", minGrade:7, maxGrade:9, difficulty:"medium", type:"mcq", curriculum:"all",
    question:"Which part of the cell controls its activities and contains DNA?",
    options:["Cell membrane","Mitochondria","Nucleus","Ribosome"], answer:"C" },

  { subject:"science", minGrade:7, maxGrade:9, difficulty:"medium", type:"true_false", curriculum:"all",
    question:"Photosynthesis produces oxygen as a by-product.", answer:"True" },

  { subject:"science", minGrade:7, maxGrade:9, difficulty:"hard", type:"short_answer", curriculum:"all",
    question:"What is the difference between an element and a compound?",
    answer:"An element contains only one type of atom; a compound contains two or more different elements chemically bonded together." },

  // ═══════════════════════════════════════════════
  //  PHYSICS
  // ═══════════════════════════════════════════════

  { subject:"physics", minGrade:9, maxGrade:12, difficulty:"easy", type:"mcq", curriculum:"all",
    question:"What is the SI unit of force?",
    options:["Joule","Watt","Newton","Pascal"], answer:"C" },

  { subject:"physics", minGrade:9, maxGrade:12, difficulty:"easy", type:"true_false", curriculum:"all",
    question:"Speed is a scalar quantity.", answer:"True",
    explanation:"Speed has magnitude but no direction; velocity is the vector version." },

  { subject:"physics", minGrade:9, maxGrade:12, difficulty:"medium", type:"mcq", curriculum:"all",
    question:"Newton's Second Law states that F = ma. If a 5 kg object accelerates at 3 m/s², what is the force?",
    options:["8 N","12 N","15 N","18 N"], answer:"C", explanation:"F = 5 × 3 = 15 N" },

  { subject:"physics", minGrade:9, maxGrade:12, difficulty:"medium", type:"mcq", curriculum:"all",
    question:"What type of wave is a sound wave?",
    options:["Transverse","Electromagnetic","Longitudinal","Surface"], answer:"C" },

  { subject:"physics", minGrade:9, maxGrade:12, difficulty:"hard", type:"short_answer", curriculum:"all",
    question:"A ball is dropped from a height of 20 m. How long does it take to reach the ground? (g = 10 m/s²)",
    answer:"2 seconds", explanation:"h = ½gt², 20 = ½(10)t², t² = 4, t = 2 s" },

  { subject:"physics", minGrade:9, maxGrade:12, difficulty:"hard", type:"mcq", curriculum:"all",
    question:"Which law of thermodynamics states that energy cannot be created or destroyed?",
    options:["Zeroth Law","First Law","Second Law","Third Law"], answer:"B" },

  { subject:"physics", minGrade:9, maxGrade:12, difficulty:"medium", type:"true_false", curriculum:"all",
    question:"The speed of light in a vacuum is approximately 3 × 10⁸ m/s.", answer:"True" },

  // ═══════════════════════════════════════════════
  //  CHEMISTRY
  // ═══════════════════════════════════════════════

  { subject:"chemistry", minGrade:9, maxGrade:12, difficulty:"easy", type:"mcq", curriculum:"all",
    question:"What is the atomic number of Carbon?",
    options:["4","6","8","12"], answer:"B" },

  { subject:"chemistry", minGrade:9, maxGrade:12, difficulty:"easy", type:"true_false", curriculum:"all",
    question:"An atom with more electrons than protons is called a cation.", answer:"False",
    explanation:"An atom with more electrons than protons is an anion (negatively charged)." },

  { subject:"chemistry", minGrade:9, maxGrade:12, difficulty:"medium", type:"mcq", curriculum:"all",
    question:"What type of bond involves the sharing of electrons?",
    options:["Ionic bond","Covalent bond","Metallic bond","Hydrogen bond"], answer:"B" },

  { subject:"chemistry", minGrade:9, maxGrade:12, difficulty:"medium", type:"mcq", curriculum:"all",
    question:"Which indicator turns red in acidic solutions?",
    options:["Phenolphthalein","Litmus","Methyl orange","All of the above"], answer:"B" },

  { subject:"chemistry", minGrade:9, maxGrade:12, difficulty:"hard", type:"short_answer", curriculum:"all",
    question:"Balance the equation: H₂ + O₂ → H₂O", answer:"2H₂ + O₂ → 2H₂O" },

  { subject:"chemistry", minGrade:9, maxGrade:12, difficulty:"hard", type:"mcq", curriculum:"all",
    question:"What is the pH of a neutral solution at 25°C?",
    options:["0","5","7","14"], answer:"C" },

  // ═══════════════════════════════════════════════
  //  BIOLOGY
  // ═══════════════════════════════════════════════

  { subject:"biology", minGrade:7, maxGrade:12, difficulty:"easy", type:"mcq", curriculum:"all",
    question:"What is the powerhouse of the cell?",
    options:["Nucleus","Ribosome","Mitochondria","Golgi apparatus"], answer:"C" },

  { subject:"biology", minGrade:7, maxGrade:12, difficulty:"easy", type:"true_false", curriculum:"all",
    question:"DNA stands for Deoxyribonucleic Acid.", answer:"True" },

  { subject:"biology", minGrade:7, maxGrade:12, difficulty:"medium", type:"mcq", curriculum:"all",
    question:"Which blood type is the universal donor?",
    options:["A","B","AB","O negative"], answer:"D", explanation:"O negative can donate to all blood types." },

  { subject:"biology", minGrade:7, maxGrade:12, difficulty:"medium", type:"mcq", curriculum:"all",
    question:"What process do plants use to convert sunlight into food?",
    options:["Respiration","Fermentation","Photosynthesis","Digestion"], answer:"C" },

  { subject:"biology", minGrade:7, maxGrade:12, difficulty:"hard", type:"short_answer", curriculum:"all",
    question:"Explain the difference between mitosis and meiosis.",
    answer:"Mitosis produces 2 identical diploid daughter cells (for growth/repair); meiosis produces 4 genetically diverse haploid cells (for reproduction)." },

  { subject:"biology", minGrade:9, maxGrade:12, difficulty:"hard", type:"mcq", curriculum:"all",
    question:"Which part of the brain controls balance and coordination?",
    options:["Cerebrum","Cerebellum","Brain stem","Hippocampus"], answer:"B" },

  // ═══════════════════════════════════════════════
  //  SOCIAL STUDIES
  // ═══════════════════════════════════════════════

  { subject:"social_studies", minGrade:1, maxGrade:5, difficulty:"easy", type:"mcq", curriculum:"all",
    question:"What do we call a person who makes laws for a country?",
    options:["Teacher","Doctor","Politician / Lawmaker","Farmer"], answer:"C" },

  { subject:"social_studies", minGrade:1, maxGrade:5, difficulty:"easy", type:"true_false", curriculum:"all",
    question:"A map is a drawing that shows us what a place looks like from above.", answer:"True" },

  { subject:"social_studies", minGrade:1, maxGrade:5, difficulty:"medium", type:"mcq", curriculum:"all",
    question:"Which of these is an example of a natural resource?",
    options:["Plastic bottle","Solar panel","Fresh water","Smartphone"], answer:"C" },

  { subject:"social_studies", minGrade:4, maxGrade:8, difficulty:"medium", type:"mcq", curriculum:"all",
    question:"What is the capital city of the United Arab Emirates?",
    options:["Dubai","Sharjah","Abu Dhabi","Ajman"], answer:"C" },

  { subject:"social_studies", minGrade:4, maxGrade:8, difficulty:"medium", type:"mcq", curriculum:"all",
    question:"Which organization works to maintain international peace and security?",
    options:["World Bank","NATO","United Nations","WTO"], answer:"C" },

  { subject:"social_studies", minGrade:4, maxGrade:8, difficulty:"hard", type:"short_answer", curriculum:"all",
    question:"What is the difference between a democracy and a monarchy?",
    answer:"In a democracy, the government is elected by the people; in a monarchy, power is held by a king or queen, often by inheritance." },

  // ═══════════════════════════════════════════════
  //  HISTORY
  // ═══════════════════════════════════════════════

  { subject:"history", minGrade:5, maxGrade:8, difficulty:"easy", type:"mcq", curriculum:"all",
    question:"In which year did World War II end?",
    options:["1939","1942","1945","1950"], answer:"C" },

  { subject:"history", minGrade:5, maxGrade:8, difficulty:"easy", type:"true_false", curriculum:"all",
    question:"The ancient Egyptians built the pyramids.", answer:"True" },

  { subject:"history", minGrade:5, maxGrade:8, difficulty:"medium", type:"mcq", curriculum:"all",
    question:"Who was the first President of the United States?",
    options:["Thomas Jefferson","Abraham Lincoln","George Washington","Benjamin Franklin"], answer:"C" },

  { subject:"history", minGrade:5, maxGrade:8, difficulty:"medium", type:"mcq", curriculum:"all",
    question:"Which empire was the largest in ancient history?",
    options:["Roman Empire","British Empire","Mongol Empire","Ottoman Empire"], answer:"C",
    explanation:"At its peak, the Mongol Empire was the largest contiguous land empire in history." },

  { subject:"history", minGrade:9, maxGrade:12, difficulty:"medium", type:"mcq", curriculum:"all",
    question:"What event triggered World War I?",
    options:["The bombing of Pearl Harbor","The assassination of Archduke Franz Ferdinand","The invasion of Poland","The sinking of the Titanic"], answer:"B" },

  { subject:"history", minGrade:9, maxGrade:12, difficulty:"hard", type:"short_answer", curriculum:"all",
    question:"Explain two causes of the French Revolution.",
    answer:"Causes include: financial crisis (France was nearly bankrupt), social inequality (the Estates system), Enlightenment ideas challenging monarchy, and food shortages affecting the poor." },

  { subject:"history", minGrade:9, maxGrade:12, difficulty:"hard", type:"mcq", curriculum:"all",
    question:"The Cold War was primarily a conflict between which two superpowers?",
    options:["USA and China","USA and USSR","UK and USSR","UK and Germany"], answer:"B" },

  // UAE-specific History
  { subject:"history", minGrade:5, maxGrade:12, difficulty:"easy", type:"mcq", curriculum:"uae",
    question:"In which year was the United Arab Emirates founded?",
    options:["1961","1968","1971","1975"], answer:"C", explanation:"The UAE was founded on December 2, 1971." },

  { subject:"history", minGrade:5, maxGrade:12, difficulty:"medium", type:"mcq", curriculum:"uae",
    question:"Who is considered the founding father of the UAE?",
    options:["Sheikh Zayed bin Sultan Al Nahyan","Sheikh Rashid bin Saeed Al Maktoum","Sheikh Khalifa bin Zayed","Sheikh Mohammed bin Rashid"], answer:"A" },

  // ═══════════════════════════════════════════════
  //  GEOGRAPHY
  // ═══════════════════════════════════════════════

  { subject:"geography", minGrade:3, maxGrade:6, difficulty:"easy", type:"mcq", curriculum:"all",
    question:"Which is the largest continent?",
    options:["Africa","North America","Asia","Europe"], answer:"C" },

  { subject:"geography", minGrade:3, maxGrade:6, difficulty:"easy", type:"true_false", curriculum:"all",
    question:"The Amazon River is located in South America.", answer:"True" },

  { subject:"geography", minGrade:3, maxGrade:6, difficulty:"medium", type:"mcq", curriculum:"all",
    question:"What is the longest river in the world?",
    options:["Amazon","Nile","Yangtze","Mississippi"], answer:"B" },

  { subject:"geography", minGrade:5, maxGrade:9, difficulty:"medium", type:"mcq", curriculum:"all",
    question:"Which ocean is the largest?",
    options:["Atlantic Ocean","Indian Ocean","Arctic Ocean","Pacific Ocean"], answer:"D" },

  { subject:"geography", minGrade:5, maxGrade:9, difficulty:"medium", type:"mcq", curriculum:"all",
    question:"What is the capital of Australia?",
    options:["Sydney","Melbourne","Canberra","Brisbane"], answer:"C" },

  { subject:"geography", minGrade:7, maxGrade:12, difficulty:"hard", type:"short_answer", curriculum:"all",
    question:"What is the difference between weather and climate?",
    answer:"Weather is the short-term atmospheric conditions in a specific place (e.g., today's rain); climate is the long-term average weather patterns of a region over decades." },

  { subject:"geography", minGrade:7, maxGrade:12, difficulty:"hard", type:"mcq", curriculum:"all",
    question:"Which type of plate boundary causes earthquakes and volcanoes due to plates sliding past each other?",
    options:["Convergent","Divergent","Transform","Subduction"], answer:"C" },

  // ═══════════════════════════════════════════════
  //  COMPUTER SCIENCE
  // ═══════════════════════════════════════════════

  { subject:"computer_science", minGrade:5, maxGrade:8, difficulty:"easy", type:"mcq", curriculum:"all",
    question:"What does CPU stand for?",
    options:["Central Processing Unit","Computer Power Unit","Central Program Utility","Core Processing Unit"], answer:"A" },

  { subject:"computer_science", minGrade:5, maxGrade:8, difficulty:"easy", type:"true_false", curriculum:"all",
    question:"A byte consists of 8 bits.", answer:"True" },

  { subject:"computer_science", minGrade:5, maxGrade:8, difficulty:"medium", type:"mcq", curriculum:"all",
    question:"What is an algorithm?",
    options:["A programming language","A step-by-step set of instructions to solve a problem","A type of computer hardware","A storage device"], answer:"B" },

  { subject:"computer_science", minGrade:8, maxGrade:12, difficulty:"medium", type:"mcq", curriculum:"all",
    question:"What does HTML stand for?",
    options:["Hyper Transfer Markup Language","HyperText Markup Language","High Text Machine Language","HyperText Machine Logic"], answer:"B" },

  { subject:"computer_science", minGrade:8, maxGrade:12, difficulty:"medium", type:"true_false", curriculum:"all",
    question:"An array in programming stores elements of different data types only.", answer:"False",
    explanation:"Arrays typically store elements of the same data type." },

  { subject:"computer_science", minGrade:8, maxGrade:12, difficulty:"hard", type:"short_answer", curriculum:"all",
    question:"What is the time complexity of a binary search algorithm?",
    answer:"O(log n)" },

  { subject:"computer_science", minGrade:9, maxGrade:12, difficulty:"hard", type:"mcq", curriculum:"all",
    question:"Which data structure uses LIFO (Last In, First Out) order?",
    options:["Queue","Array","Stack","Linked List"], answer:"C" },

  // ═══════════════════════════════════════════════
  //  ARABIC LANGUAGE
  // ═══════════════════════════════════════════════

  { subject:"arabic", minGrade:1, maxGrade:4, difficulty:"easy", type:"mcq", curriculum:"uae",
    question:"كم عدد حروف الهجاء العربية؟",
    options:["24","26","28","30"], answer:"C", explanation:"يتكون الأبجدية العربية من 28 حرفاً." },

  { subject:"arabic", minGrade:1, maxGrade:4, difficulty:"easy", type:"true_false", curriculum:"uae",
    question:"الفاعل في الجملة الفعلية يأتي مرفوعاً دائماً.", answer:"True" },

  { subject:"arabic", minGrade:4, maxGrade:8, difficulty:"medium", type:"mcq", curriculum:"uae",
    question:"ما جمع كلمة 'كتاب'؟",
    options:["كتابات","كتابون","كُتُب","أكتاب"], answer:"C" },

  { subject:"arabic", minGrade:4, maxGrade:8, difficulty:"medium", type:"short_answer", curriculum:"uae",
    question:"أعرب الكلمة التي تحتها خط: 'قرأَ الطالبُ الكتابَ'  — (الطالبُ)", answer:"الطالبُ: فاعل مرفوع وعلامة رفعه الضمة الظاهرة على آخره." },

  { subject:"arabic", minGrade:7, maxGrade:12, difficulty:"hard", type:"mcq", curriculum:"uae",
    question:"أي من الأساليب الآتية يُعدّ أسلوب استفهام؟",
    options:["ما أجمل الربيع!","أين ذهبت؟","سافر أحمد.","قرأت الكتاب."], answer:"B" },

  // ═══════════════════════════════════════════════
  //  ISLAMIC STUDIES
  // ═══════════════════════════════════════════════

  { subject:"islamic_studies", minGrade:1, maxGrade:4, difficulty:"easy", type:"mcq", curriculum:"uae",
    question:"كم عدد أركان الإسلام؟",
    options:["3","4","5","6"], answer:"C" },

  { subject:"islamic_studies", minGrade:1, maxGrade:4, difficulty:"easy", type:"true_false", curriculum:"uae",
    question:"الصلاة ركن من أركان الإسلام.", answer:"True" },

  { subject:"islamic_studies", minGrade:4, maxGrade:8, difficulty:"medium", type:"mcq", curriculum:"uae",
    question:"في أي شهر أُنزل القرآن الكريم؟",
    options:["رجب","شعبان","رمضان","ذو الحجة"], answer:"C" },

  { subject:"islamic_studies", minGrade:4, maxGrade:8, difficulty:"medium", type:"mcq", curriculum:"uae",
    question:"ما عدد أركان الإيمان؟",
    options:["4","5","6","7"], answer:"C", explanation:"الإيمان بالله، الملائكة، الكتب، الرسل، اليوم الآخر، القضاء والقدر." },

  { subject:"islamic_studies", minGrade:7, maxGrade:12, difficulty:"hard", type:"short_answer", curriculum:"uae",
    question:"اذكر ثلاثة من مقاصد الشريعة الإسلامية.",
    answer:"من مقاصد الشريعة: حفظ الدين، حفظ النفس، حفظ العقل، حفظ النسل، حفظ المال." },

  // ═══════════════════════════════════════════════
  //  Additional cross-curriculum questions
  // ═══════════════════════════════════════════════

  // Math extras
  { subject:"math", minGrade:6, maxGrade:9, difficulty:"medium", type:"mcq", curriculum:"all",
    question:"What is the probability of rolling an even number on a standard 6-sided die?",
    options:["1/6","1/3","1/2","2/3"], answer:"C", explanation:"Even numbers: 2,4,6 → 3 out of 6 = 1/2" },

  { subject:"math", minGrade:5, maxGrade:8, difficulty:"medium", type:"true_false", curriculum:"all",
    question:"A negative number multiplied by a negative number gives a positive result.", answer:"True" },

  { subject:"math", minGrade:8, maxGrade:12, difficulty:"hard", type:"mcq", curriculum:"all",
    question:"Which of the following is a geometric sequence?",
    options:["1, 3, 5, 7, 9","2, 4, 8, 16, 32","1, 4, 9, 16, 25","0, 1, 1, 2, 3"], answer:"B",
    explanation:"Each term is multiplied by 2 (common ratio = 2)." },

  // Science extras
  { subject:"science", minGrade:5, maxGrade:9, difficulty:"medium", type:"mcq", curriculum:"all",
    question:"Which planet is known as the Red Planet?",
    options:["Venus","Jupiter","Mars","Saturn"], answer:"C" },

  { subject:"science", minGrade:6, maxGrade:10, difficulty:"hard", type:"short_answer", curriculum:"all",
    question:"What is Newton's Third Law of Motion?",
    answer:"For every action there is an equal and opposite reaction." },

  // English extras
  { subject:"english", minGrade:5, maxGrade:9, difficulty:"medium", type:"mcq", curriculum:"all",
    question:"Which sentence is written in the passive voice?",
    options:["The chef cooked the meal.","The meal was cooked by the chef.","She reads books every day.","He runs fast."], answer:"B" },

  { subject:"english", minGrade:6, maxGrade:10, difficulty:"hard", type:"mcq", curriculum:"all",
    question:"Which of the following is NOT a feature of an argumentative essay?",
    options:["A clear thesis statement","Evidence and examples","Personal diary entries","A counter-argument"], answer:"C" },

  // Computer Science extras
  { subject:"computer_science", minGrade:9, maxGrade:12, difficulty:"medium", type:"mcq", curriculum:"all",
    question:"What is the output of: print(2 ** 3) in Python?",
    options:["5","6","8","9"], answer:"C", explanation:"** is the exponentiation operator; 2³ = 8" },

  { subject:"computer_science", minGrade:9, maxGrade:12, difficulty:"hard", type:"true_false", curriculum:"all",
    question:"In object-oriented programming, encapsulation means hiding internal implementation details.", answer:"True" },

  // Geography extras
  { subject:"geography", minGrade:7, maxGrade:12, difficulty:"medium", type:"mcq", curriculum:"all",
    question:"Which country has the largest population in the world?",
    options:["USA","Russia","India","China"], answer:"C",
    explanation:"As of 2023, India surpassed China as the world's most populous country." },

  { subject:"geography", minGrade:9, maxGrade:12, difficulty:"hard", type:"mcq", curriculum:"all",
    question:"What is the Coriolis effect?",
    options:["The rise and fall of ocean tides","The deflection of winds due to Earth's rotation","The warming of the Pacific Ocean","The melting of polar ice caps"], answer:"B" },

  // History extras
  { subject:"history", minGrade:7, maxGrade:12, difficulty:"medium", type:"mcq", curriculum:"all",
    question:"Who invented the printing press?",
    options:["Leonardo da Vinci","Johannes Gutenberg","Isaac Newton","Galileo Galilei"], answer:"B" },

  { subject:"history", minGrade:9, maxGrade:12, difficulty:"hard", type:"short_answer", curriculum:"all",
    question:"What were the main causes of World War I? Name at least three.",
    answer:"Militarism, Alliance systems, Imperialism, Nationalism (MAIN), plus the immediate trigger of Archduke Franz Ferdinand's assassination." },

  // Biology extras
  { subject:"biology", minGrade:9, maxGrade:12, difficulty:"medium", type:"mcq", curriculum:"all",
    question:"What is osmosis?",
    options:["Movement of solute from high to low concentration","Movement of water through a semi-permeable membrane from low to high solute concentration","Active transport of glucose into cells","Breakdown of glucose for energy"], answer:"B" },

  { subject:"biology", minGrade:9, maxGrade:12, difficulty:"hard", type:"mcq", curriculum:"all",
    question:"Which process breaks down glucose to release energy in the absence of oxygen?",
    options:["Aerobic respiration","Photosynthesis","Anaerobic respiration","Transpiration"], answer:"C" },

  // Chemistry extras
  { subject:"chemistry", minGrade:9, maxGrade:12, difficulty:"medium", type:"true_false", curriculum:"all",
    question:"All metals are solids at room temperature.", answer:"False",
    explanation:"Mercury (Hg) is a metal that is liquid at room temperature." },

  { subject:"chemistry", minGrade:10, maxGrade:12, difficulty:"hard", type:"short_answer", curriculum:"all",
    question:"What is Avogadro's number and what does it represent?",
    answer:"6.022 × 10²³; it represents the number of atoms, molecules, or particles in one mole of a substance." },

  // Physics extras
  { subject:"physics", minGrade:10, maxGrade:12, difficulty:"hard", type:"mcq", curriculum:"all",
    question:"What is the unit of electrical resistance?",
    options:["Ampere","Volt","Ohm","Watt"], answer:"C" },

  { subject:"physics", minGrade:10, maxGrade:12, difficulty:"hard", type:"short_answer", curriculum:"all",
    question:"State Ohm's Law.", answer:"V = IR; voltage equals current multiplied by resistance." },

];

/**
 * Filter questions by subject, grade, difficulty, curriculum, and type.
 * Returns a shuffled subset of `count` questions.
 */
function getQuestions({ subject, grade, difficulty, curriculum, type, count }) {
  const gradeNum = parseInt(grade, 10);

  let pool = QUESTION_BANK.filter(q => {
    if (q.subject !== subject) return false;
    if (gradeNum < q.minGrade || gradeNum > q.maxGrade) return false;

    // difficulty filter
    if (difficulty !== "mixed" && q.difficulty !== difficulty) return false;

    // curriculum filter (questions tagged "all" match any curriculum)
    if (q.curriculum !== "all" && curriculum && q.curriculum !== curriculum) return false;

    // type filter
    if (type !== "all" && q.type !== type) return false;

    return true;
  });

  // Shuffle
  pool = pool.sort(() => Math.random() - 0.5);

  return pool.slice(0, Math.min(count, pool.length));
}
