// ===== NAVBAR SCROLL =====
var navbar = document.getElementById("navbar");
window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

// ===== MOBILE MENU =====
var mobileToggle = document.getElementById("mobileToggle");
var navLinks = document.querySelector(".nav-links");
mobileToggle.addEventListener("click", function () {
    if (navLinks.style.display === "flex") {
        navLinks.style.display = "none";
    } else {
        navLinks.style.display = "flex";
        navLinks.style.flexDirection = "column";
        navLinks.style.position = "absolute";
        navLinks.style.top = "70px";
        navLinks.style.left = "0";
        navLinks.style.right = "0";
        navLinks.style.background = "rgba(6,6,15,0.95)";
        navLinks.style.padding = "20px";
        navLinks.style.borderBottom = "1px solid rgba(255,255,255,0.08)";
    }
});

// ===== IELTS SPEAKING TEST DEMO =====
var ieltsQuestions = {
    british: {
        part1: [
            "Good afternoon. My name is Dr. Harrison. Could you tell me your full name, please?",
            "Thank you. Now, let's talk about your hometown. Where are you from originally?",
            "What do you like most about living there?",
            "Do you think your city has changed much in recent years?",
            "Let's move on. Do you enjoy reading? What kind of books do you prefer?"
        ],
        part2: [
            "Right, I'm going to give you a topic. I'd like you to describe a skill you learned that you found difficult at first. You should say: what the skill was, when you learned it, how you learned it, and explain why it was difficult initially. You have one minute to prepare, then please speak for up to two minutes."
        ],
        part3: [
            "Interesting. Now, let's consider this more broadly. Do you think some skills are inherently more difficult to learn than others?",
            "How important is it for adults to continue learning new skills throughout their lives?",
            "Some people believe that technology has made learning easier. Would you agree with that view?"
        ]
    },
    american: {
        part1: [
            "Hi there! I'm Professor Miller. Can you start by telling me your full name?",
            "Great, thanks. So, tell me about where you live. Do you like your neighborhood?",
            "What's your favorite thing to do on weekends?",
            "Do you prefer spending time indoors or outdoors? Why?",
            "Let's talk about food. What's your favorite dish to cook or eat?"
        ],
        part2: [
            "Alright, here's your topic. I want you to describe a memorable trip you took. You should mention: where you went, who you were with, what you did there, and explain why it was memorable. Take a minute to think, then talk for about two minutes."
        ],
        part3: [
            "That's cool! So thinking bigger picture — do you think travel is important for personal growth?",
            "How has social media changed the way people travel these days?",
            "Do you think eco-tourism is just a trend, or is it here to stay?"
        ]
    },
    australian: {
        part1: [
            "G'day! I'm your examiner today, Dr. Cooper. Could you tell me your full name?",
            "Thanks, mate. So, what do you do — are you working or studying at the moment?",
            "Do you enjoy what you're doing? What's the best part about it?",
            "Let's chat about music. Do you listen to music often?",
            "Has your taste in music changed over the years?"
        ],
        part2: [
            "Right-o, here's your topic card. I'd like you to describe a person who has had a big influence on your life. You should say: who this person is, how you know them, what they've done that influenced you, and explain why their influence has been important. You've got a minute to prepare."
        ],
        part3: [
            "Brilliant. Now, thinking more generally — do you reckon role models are important for young people?",
            "How do you think the concept of leadership has changed in modern society?",
            "Some say that celebrities have too much influence on young people. What's your take on that?"
        ]
    }
};

var currentAccent = "british";
var testRunning = false;
var currentQuestionIndex = 0;
var allQuestions = [];
var userAnswers = [];
var timerInterval = null;
var timeLeft = 900; // 15 minutes

// Accent selector
var accentButtons = document.querySelectorAll(".accent-btn");
for (var i = 0; i < accentButtons.length; i++) {
    accentButtons[i].addEventListener("click", function () {
        if (testRunning) return;
        for (var j = 0; j < accentButtons.length; j++) {
            accentButtons[j].classList.remove("active");
        }
        this.classList.add("active");
        currentAccent = this.getAttribute("data-accent");
        var labels = { british: "British Accent", american: "American Accent", australian: "Australian Accent" };
        document.getElementById("accentLabel").textContent = labels[currentAccent];
    });
}

// Start test
document.getElementById("startTestBtn").addEventListener("click", function () {
    testRunning = true;
    currentQuestionIndex = 0;
    userAnswers = [];

    var qs = ieltsQuestions[currentAccent];
    allQuestions = [];
    for (var a = 0; a < qs.part1.length; a++) { allQuestions.push(qs.part1[a]); }
    for (var b = 0; b < qs.part2.length; b++) { allQuestions.push(qs.part2[b]); }
    for (var c = 0; c < qs.part3.length; c++) { allQuestions.push(qs.part3[c]); }

    document.getElementById("startTestBtn").classList.add("hidden");
    document.getElementById("userInput").disabled = false;
    document.getElementById("sendBtn").disabled = false;
    document.getElementById("scorePanel").classList.add("hidden");

    var chatArea = document.getElementById("chatArea");
    chatArea.innerHTML = "";

    addChatMessage("ai", allQuestions[0]);
    startTimer();
});

// Send answer
document.getElementById("sendBtn").addEventListener("click", sendAnswer);
document.getElementById("userInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter") sendAnswer();
});

function sendAnswer() {
    var input = document.getElementById("userInput");
    var text = input.value.trim();
    if (text === "") return;

    addChatMessage("user", text);
    userAnswers.push(text);
    input.value = "";

    currentQuestionIndex++;
    if (currentQuestionIndex < allQuestions.length) {
        setTimeout(function () {
            addChatMessage("ai", allQuestions[currentQuestionIndex]);
        }, 800);
    } else {
        setTimeout(function () {
            addChatMessage("ai", "Thank you very much. That concludes your speaking test. Let me prepare your results...");
            setTimeout(showScore, 1500);
        }, 800);
    }
}

function addChatMessage(role, text) {
    var chatArea = document.getElementById("chatArea");
    var div = document.createElement("div");
    div.className = "chat-message " + role;
    var sender = role === "ai" ? "AI Examiner" : "You";
    div.innerHTML = '<span class="chat-sender">' + sender + '</span><p>' + text + '</p>';
    chatArea.appendChild(div);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function startTimer() {
    timeLeft = 900;
    updateTimerDisplay();
    timerInterval = setInterval(function () {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            showScore();
        }
    }, 1000);
}

function updateTimerDisplay() {
    var mins = Math.floor(timeLeft / 60);
    var secs = timeLeft % 60;
    var display = (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "") + secs;
    document.getElementById("timerValue").textContent = display;
}

function showScore() {
    clearInterval(timerInterval);
    testRunning = false;
    document.getElementById("userInput").disabled = true;
    document.getElementById("sendBtn").disabled = true;

    // Calculate simulated scores based on answer content
    var totalWords = 0;
    var totalLength = 0;
    for (var i = 0; i < userAnswers.length; i++) {
        var words = userAnswers[i].split(" ");
        totalWords = totalWords + words.length;
        totalLength = totalLength + userAnswers[i].length;
    }

    var avgWords = userAnswers.length > 0 ? totalWords / userAnswers.length : 0;

    // Score based on verbosity and response count
    var fluency = Math.min(9, Math.max(4, 5 + (avgWords - 10) / 8));
    var lexical = Math.min(9, Math.max(4, 4.5 + (avgWords - 8) / 7));
    var grammar = Math.min(9, Math.max(4, 5 + (totalWords - 50) / 60));
    var pronun = Math.min(9, Math.max(4, 5.5 + (userAnswers.length - 3) / 5));

    fluency = Math.round(fluency * 2) / 2;
    lexical = Math.round(lexical * 2) / 2;
    grammar = Math.round(grammar * 2) / 2;
    pronun = Math.round(pronun * 2) / 2;

    var overall = Math.round(((fluency + lexical + grammar + pronun) / 4) * 2) / 2;

    document.getElementById("bandScore").textContent = overall.toFixed(1);
    document.getElementById("fluencyVal").textContent = fluency.toFixed(1);
    document.getElementById("lexicalVal").textContent = lexical.toFixed(1);
    document.getElementById("grammarVal").textContent = grammar.toFixed(1);
    document.getElementById("pronunVal").textContent = pronun.toFixed(1);

    document.getElementById("fluencyBar").style.width = (fluency / 9 * 100) + "%";
    document.getElementById("lexicalBar").style.width = (lexical / 9 * 100) + "%";
    document.getElementById("grammarBar").style.width = (grammar / 9 * 100) + "%";
    document.getElementById("pronunBar").style.width = (pronun / 9 * 100) + "%";

    var feedbackArea = document.getElementById("feedbackArea");
    feedbackArea.innerHTML = "";

    var feedbacks = [
        "💡 <strong>Fluency:</strong> Try to elaborate more on your answers. Use linking words like 'however', 'moreover', and 'in addition' to connect your ideas.",
        "📝 <strong>Vocabulary:</strong> Use more topic-specific vocabulary. Instead of saying 'good', try 'beneficial', 'advantageous', or 'rewarding'.",
        "🔧 <strong>Grammar:</strong> Pay attention to complex sentence structures. Mix simple and compound-complex sentences for a higher score."
    ];

    for (var f = 0; f < feedbacks.length; f++) {
        var p = document.createElement("p");
        p.innerHTML = feedbacks[f];
        feedbackArea.appendChild(p);
    }

    document.getElementById("scorePanel").classList.remove("hidden");
    document.getElementById("startTestBtn").classList.remove("hidden");
    document.getElementById("startTestBtn").innerHTML = '<span class="btn-icon">🔄</span> Retake Test';
}

// Retake button
document.getElementById("retakeBtn").addEventListener("click", function () {
    document.getElementById("scorePanel").classList.add("hidden");
    document.getElementById("startTestBtn").click();
});


// ===== EDUQUEST GAME =====
var gameQuestions = {
    english: [
        { q: "What is the past tense of 'go'?", a: ["Went", "Goed", "Gone", "Going"], correct: 0 },
        { q: "Which word is a synonym for 'happy'?", a: ["Sad", "Elated", "Angry", "Tired"], correct: 1 },
        { q: "Choose the correct sentence:", a: ["She don't like it", "She doesn't likes it", "She doesn't like it", "She not like it"], correct: 2 },
        { q: "What is the plural of 'child'?", a: ["Childs", "Childrens", "Children", "Childes"], correct: 2 },
        { q: "Fill in: 'I ___ studying when he called.'", a: ["am", "was", "were", "is"], correct: 1 },
        { q: "Which is a conjunction?", a: ["Quickly", "Beautiful", "Although", "Running"], correct: 2 },
        { q: "'Benevolent' most closely means:", a: ["Cruel", "Kind", "Lazy", "Smart"], correct: 1 },
        { q: "Identify the adverb: 'She sings beautifully.'", a: ["She", "sings", "beautifully", "None"], correct: 2 },
        { q: "What does 'ubiquitous' mean?", a: ["Rare", "Found everywhere", "Expensive", "Tiny"], correct: 1 },
        { q: "Choose the correct spelling:", a: ["Accomodate", "Accommodate", "Acomodate", "Acommodate"], correct: 1 }
    ],
    math: [
        { q: "What is 15% of 200?", a: ["25", "30", "35", "20"], correct: 1 },
        { q: "Solve: 3x + 7 = 22", a: ["x = 3", "x = 5", "x = 7", "x = 4"], correct: 1 },
        { q: "What is the square root of 144?", a: ["11", "12", "13", "14"], correct: 1 },
        { q: "What is 7! (7 factorial)?", a: ["720", "5040", "2520", "840"], correct: 1 },
        { q: "If a triangle has angles 45° and 90°, what is the third?", a: ["55°", "45°", "35°", "60°"], correct: 1 },
        { q: "What is the area of a circle with radius 5?", a: ["25π", "10π", "50π", "15π"], correct: 0 },
        { q: "Simplify: (2³)²", a: ["32", "64", "16", "128"], correct: 1 },
        { q: "What is log₁₀(1000)?", a: ["2", "3", "4", "10"], correct: 1 },
        { q: "Solve: |x - 3| = 7", a: ["x=10 or x=-4", "x=10 or x=4", "x=4 only", "x=-10 or x=4"], correct: 0 },
        { q: "What is the derivative of x³?", a: ["x²", "3x²", "3x", "3x³"], correct: 1 }
    ],
    science: [
        { q: "What is the chemical symbol for gold?", a: ["Go", "Gd", "Au", "Ag"], correct: 2 },
        { q: "What organelle is the 'powerhouse' of the cell?", a: ["Nucleus", "Ribosome", "Mitochondria", "Golgi"], correct: 2 },
        { q: "What planet is known as the Red Planet?", a: ["Venus", "Mars", "Jupiter", "Saturn"], correct: 1 },
        { q: "What is Newton's Second Law?", a: ["F = ma", "E = mc²", "V = IR", "PV = nRT"], correct: 0 },
        { q: "What gas do plants absorb from the atmosphere?", a: ["Oxygen", "Nitrogen", "CO₂", "Hydrogen"], correct: 2 },
        { q: "What is the speed of light (approx)?", a: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "1,000,000 km/s"], correct: 0 },
        { q: "DNA stands for:", a: ["Deoxy Nucleic Acid", "Deoxyribonucleic Acid", "Di-Nucleic Acid", "Deoxy Natal Acid"], correct: 1 },
        { q: "What is the atomic number of Carbon?", a: ["4", "6", "8", "12"], correct: 1 },
        { q: "Which force keeps planets in orbit?", a: ["Friction", "Magnetism", "Gravity", "Tension"], correct: 2 },
        { q: "Water boils at what temperature (°C)?", a: ["90°C", "100°C", "110°C", "120°C"], correct: 1 }
    ]
};

var currentSubject = "english";
var currentGameQ = 0;
var gameScore = 0;
var gameLives = 3;
var gameLevel = 1;
var gameStreak = 0;
var gameCorrectCount = 0;
var shuffledQuestions = [];

// Subject selector
var subjectBtns = document.querySelectorAll(".subject-btn");
for (var s = 0; s < subjectBtns.length; s++) {
    subjectBtns[s].addEventListener("click", function () {
        for (var k = 0; k < subjectBtns.length; k++) {
            subjectBtns[k].classList.remove("active");
        }
        this.classList.add("active");
        currentSubject = this.getAttribute("data-subject");
    });
}

// Start game
document.getElementById("startGameBtn").addEventListener("click", function () {
    gameScore = 0;
    gameLives = 3;
    gameLevel = 1;
    gameStreak = 0;
    gameCorrectCount = 0;
    currentGameQ = 0;
    updateHUD();

    // Shuffle questions
    shuffledQuestions = gameQuestions[currentSubject].slice();
    for (var x = shuffledQuestions.length - 1; x > 0; x--) {
        var rand = Math.floor(Math.random() * (x + 1));
        var temp = shuffledQuestions[x];
        shuffledQuestions[x] = shuffledQuestions[rand];
        shuffledQuestions[rand] = temp;
    }

    document.getElementById("gameStartScreen").classList.add("hidden");
    document.getElementById("gameResultScreen").classList.add("hidden");
    document.getElementById("gameQuestionScreen").classList.remove("hidden");

    showGameQuestion();
});

function showGameQuestion() {
    if (currentGameQ >= shuffledQuestions.length || gameLives <= 0) {
        showGameResult();
        return;
    }

    var q = shuffledQuestions[currentGameQ];
    var badges = { english: "📖 English", math: "🔢 Math", science: "🔬 Science" };

    document.getElementById("questionBadge").textContent = badges[currentSubject];
    document.getElementById("questionText").textContent = q.q;
    document.getElementById("questionCounter").textContent = (currentGameQ + 1) + " / " + shuffledQuestions.length;
    document.getElementById("questionProgress").style.width = ((currentGameQ + 1) / shuffledQuestions.length * 100) + "%";
    document.getElementById("questionFeedback").classList.add("hidden");

    var grid = document.getElementById("answersGrid");
    grid.innerHTML = "";

    for (var a = 0; a < q.a.length; a++) {
        var btn = document.createElement("button");
        btn.className = "answer-btn";
        btn.textContent = q.a[a];
        btn.setAttribute("data-index", a);
        btn.addEventListener("click", handleAnswer);
        grid.appendChild(btn);
    }
}

function handleAnswer(e) {
    var selected = parseInt(e.target.getAttribute("data-index"));
    var q = shuffledQuestions[currentGameQ];
    var allBtns = document.querySelectorAll(".answer-btn");
    var feedback = document.getElementById("questionFeedback");

    // Disable all buttons
    for (var d = 0; d < allBtns.length; d++) {
        allBtns[d].style.pointerEvents = "none";
    }

    if (selected === q.correct) {
        e.target.classList.add("correct");
        gameScore = gameScore + 10 + (gameStreak * 2);
        gameStreak++;
        gameCorrectCount++;
        if (gameStreak > 0 && gameStreak % 3 === 0) {
            gameLevel++;
        }
        feedback.classList.remove("hidden");
        feedback.style.background = "rgba(0, 184, 148, 0.1)";
        feedback.style.color = "#00b894";
        document.getElementById("feedbackEmoji").textContent = "✅";
        document.getElementById("feedbackText").textContent = "Correct! +" + (10 + (gameStreak - 1) * 2) + " points";
    } else {
        e.target.classList.add("wrong");
        allBtns[q.correct].classList.add("correct");
        gameLives--;
        gameStreak = 0;
        feedback.classList.remove("hidden");
        feedback.style.background = "rgba(214, 48, 49, 0.1)";
        feedback.style.color = "#d63031";
        document.getElementById("feedbackEmoji").textContent = "❌";
        document.getElementById("feedbackText").textContent = "Wrong! The correct answer was: " + q.a[q.correct];
    }

    updateHUD();

    setTimeout(function () {
        currentGameQ++;
        showGameQuestion();
    }, 1500);
}

function updateHUD() {
    document.getElementById("gameScore").textContent = gameScore;
    document.getElementById("gameLives").textContent = gameLives;
    document.getElementById("gameLevel").textContent = gameLevel;
    document.getElementById("gameStreak").textContent = gameStreak;
}

function showGameResult() {
    document.getElementById("gameQuestionScreen").classList.add("hidden");
    document.getElementById("gameResultScreen").classList.remove("hidden");

    var total = shuffledQuestions.length;
    var pct = Math.round((gameCorrectCount / total) * 100);

    if (pct >= 80) {
        document.getElementById("resultCharacter").textContent = "🏆";
        document.getElementById("resultTitle").textContent = "Legendary!";
    } else if (pct >= 60) {
        document.getElementById("resultCharacter").textContent = "⭐";
        document.getElementById("resultTitle").textContent = "Great Job!";
    } else if (pct >= 40) {
        document.getElementById("resultCharacter").textContent = "💪";
        document.getElementById("resultTitle").textContent = "Keep Practicing!";
    } else {
        document.getElementById("resultCharacter").textContent = "📚";
        document.getElementById("resultTitle").textContent = "Study More!";
    }

    document.getElementById("resultMessage").textContent = "You answered " + gameCorrectCount + "/" + total + " correctly! Score: " + gameScore + " points.";

    var rewards = document.getElementById("resultRewards");
    rewards.innerHTML = "";
    if (gameScore >= 50) {
        var b1 = document.createElement("span");
        b1.className = "reward-badge";
        b1.textContent = "🗡️ Bronze Sword";
        rewards.appendChild(b1);
    }
    if (gameScore >= 80) {
        var b2 = document.createElement("span");
        b2.className = "reward-badge";
        b2.textContent = "🛡️ Silver Shield";
        rewards.appendChild(b2);
    }
    if (gameCorrectCount >= 8) {
        var b3 = document.createElement("span");
        b3.className = "reward-badge";
        b3.textContent = "💎 Diamond Key";
        rewards.appendChild(b3);
    }
    if (gameStreak >= 5) {
        var b4 = document.createElement("span");
        b4.className = "reward-badge";
        b4.textContent = "🔥 Fire Streak";
        rewards.appendChild(b4);
    }
}

// Play again
document.getElementById("playAgainBtn").addEventListener("click", function () {
    document.getElementById("gameResultScreen").classList.add("hidden");
    document.getElementById("gameStartScreen").classList.remove("hidden");
});

// ===== GRANT MATCHER =====
var grantDatabase = [
    { name: "Chevening Scholarship", uni: "UK Government — Any UK University", amount: "Full Tuition + Stipend", major: ["CS", "BUS", "LAW", "ART", "ENG", "MED"], gpa: 3.0, country: ["UZ", "KZ", "KG", "TJ", "TM", "other"], match: 96 },
    { name: "Erasmus Mundus Joint Masters", uni: "European Consortium Universities", amount: "€1,400/month + Tuition", major: ["CS", "ENG", "BUS"], gpa: 3.2, country: ["UZ", "KZ", "KG", "TJ", "TM", "other"], match: 91 },
    { name: "Stipendium Hungaricum", uni: "Hungarian Universities", amount: "Full Tuition + €150/month", major: ["CS", "ENG", "MED", "BUS", "ART", "LAW"], gpa: 2.5, country: ["UZ", "KZ", "KG", "TJ", "TM"], match: 88 },
    { name: "Korean Government Scholarship (KGSP)", uni: "South Korean Universities", amount: "Full Ride", major: ["CS", "ENG", "BUS", "ART"], gpa: 2.8, country: ["UZ", "KZ", "KG", "TJ", "TM", "other"], match: 85 },
    { name: "Turkey Burslari Scholarship", uni: "Turkish State Universities", amount: "Full Tuition + $300/month", major: ["CS", "ENG", "MED", "BUS", "LAW", "ART"], gpa: 2.5, country: ["UZ", "KZ", "KG", "TJ", "TM", "other"], match: 93 },
    { name: "KAIST International Scholarship", uni: "KAIST, South Korea", amount: "Full Tuition + $350/month", major: ["CS", "ENG"], gpa: 3.5, country: ["UZ", "KZ", "KG", "TJ", "TM", "other"], match: 79 },
    { name: "Aga Khan Foundation Scholarship", uni: "Various International", amount: "50-100% Tuition", major: ["CS", "BUS", "MED", "LAW"], gpa: 3.0, country: ["KG", "TJ", "KZ", "UZ"], match: 82 },
    { name: "Chinese Government Scholarship", uni: "Top Chinese Universities", amount: "Full Ride + Stipend", major: ["CS", "ENG", "MED", "BUS", "ART", "LAW"], gpa: 2.5, country: ["UZ", "KZ", "KG", "TJ", "TM", "other"], match: 90 },
    { name: "DAAD Scholarship (Germany)", uni: "German Universities", amount: "€934/month + Insurance", major: ["CS", "ENG", "BUS"], gpa: 3.3, country: ["UZ", "KZ", "KG", "TJ", "TM", "other"], match: 87 },
    { name: "Fulbright Program", uni: "US Universities", amount: "Full Tuition + Living", major: ["CS", "BUS", "LAW", "ART", "ENG", "MED"], gpa: 3.5, country: ["UZ", "KZ", "KG", "TJ", "TM"], match: 78 }
];

document.getElementById("findGrantsBtn").addEventListener("click", function () {
    var gpa = parseFloat(document.getElementById("grantGPA").value);
    var country = document.getElementById("grantCountry").value;
    var major = document.getElementById("grantMajor").value;
    var budget = parseInt(document.getElementById("grantBudget").value);

    var resultsPanel = document.getElementById("grantResults");

    if (!gpa || !country || !major) {
        resultsPanel.innerHTML = '<div class="grant-placeholder"><span class="grant-placeholder-icon">⚠️</span><p>Please fill in GPA, country, and major to search.</p></div>';
        return;
    }

    var matches = [];
    for (var i = 0; i < grantDatabase.length; i++) {
        var g = grantDatabase[i];
        var gpaOk = gpa >= g.gpa;
        var countryOk = false;
        for (var c = 0; c < g.country.length; c++) {
            if (g.country[c] === country) { countryOk = true; }
        }
        var majorOk = false;
        for (var m = 0; m < g.major.length; m++) {
            if (g.major[m] === major) { majorOk = true; }
        }

        if (gpaOk && countryOk && majorOk) {
            matches.push(g);
        }
    }

    // Sort by match score descending
    matches.sort(function (a, b) { return b.match - a.match; });

    if (matches.length === 0) {
        resultsPanel.innerHTML = '<div class="grant-placeholder"><span class="grant-placeholder-icon">😔</span><p>No matching grants found. Try adjusting your criteria.</p></div>';
        return;
    }

    resultsPanel.innerHTML = "<h3 style='margin-bottom:20px;font-size:1.1rem;'>🎯 Found " + matches.length + " matching scholarships</h3>";

    for (var r = 0; r < matches.length; r++) {
        var grant = matches[r];
        var card = document.createElement("div");
        card.className = "grant-card";
        card.style.animationDelay = (r * 0.1) + "s";
        card.innerHTML =
            '<h4>' + grant.name + '</h4>' +
            '<div class="grant-uni">' + grant.uni + '</div>' +
            '<div class="grant-details">' +
            '<span class="grant-tag">💰 ' + grant.amount + '</span>' +
            '<span class="grant-match">' + grant.match + '% match</span>' +
            '</div>';
        resultsPanel.appendChild(card);
    }
});


// ===== SNAP & SOLVE =====
document.getElementById("snapCaptureBtn").addEventListener("click", function () {
    var cameraUI = document.querySelector(".snap-camera-ui");
    var solution = document.getElementById("snapSolution");

    this.textContent = "⏳";
    this.disabled = true;

    setTimeout(function () {
        cameraUI.classList.add("hidden");
        solution.classList.remove("hidden");
    }, 1200);

    setTimeout(function () {
        var btn = document.getElementById("snapCaptureBtn");
        btn.textContent = "📸";
        btn.disabled = false;
    }, 1500);
});

// Allow toggling back
document.getElementById("snapSolution").addEventListener("click", function () {
    this.classList.add("hidden");
    document.querySelector(".snap-camera-ui").classList.remove("hidden");
});


// ===== SMOOTH SCROLL FOR NAV =====
var navAnchors = document.querySelectorAll('a[href^="#"]');
for (var n = 0; n < navAnchors.length; n++) {
    navAnchors[n].addEventListener("click", function (e) {
        var target = document.querySelector(this.getAttribute("href"));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth" });
            // Close mobile menu if open
            navLinks.style.display = "";
        }
    });
}

// ===== SCROLL REVEAL ANIMATION =====
function revealOnScroll() {
    var elements = document.querySelectorAll(".feature-card, .step-card, .price-card, .grant-card");
    for (var i = 0; i < elements.length; i++) {
        var rect = elements[i].getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
            elements[i].style.opacity = "1";
            elements[i].style.transform = "translateY(0)";
        }
    }
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);


// ===== PAYMENT MODAL =====
var selectedPaymentMethod = null;

var pricingPlans = {
    free: { name: "Free Trial", price: "$0", period: "forever" },
    student: { name: "Student Plan", price: "$5.00", period: "/month" },
    center: { name: "Learning Center", price: "$49.00", period: "/month" }
};

function openPaymentModal(planKey) {
    var plan = pricingPlans[planKey];
    document.getElementById("paymentPlanName").textContent = plan.name + " — " + plan.price + plan.period;
    document.getElementById("paymentAmount").textContent = plan.price;
    selectedPaymentMethod = null;

    var methodBtns = document.querySelectorAll(".payment-method-btn");
    for (var i = 0; i < methodBtns.length; i++) {
        methodBtns[i].classList.remove("selected");
    }

    var confirmBtn = document.getElementById("paymentConfirmBtn");
    confirmBtn.disabled = true;
    confirmBtn.textContent = "Select a payment method";

    document.getElementById("paymentOverlay").classList.remove("hidden");
    document.body.style.overflow = "hidden";
}

// Wire up pricing buttons
var pricingButtons = document.querySelectorAll("#pricing .price-card .btn");
for (var p = 0; p < pricingButtons.length; p++) {
    pricingButtons[p].addEventListener("click", function (e) {
        e.preventDefault();
        var card = this.closest(".price-card");
        var cards = document.querySelectorAll("#pricing .price-card");
        var index = 0;
        for (var c = 0; c < cards.length; c++) {
            if (cards[c] === card) { index = c; }
        }
        var keys = ["free", "student", "center"];
        if (keys[index] === "free") {
            alert("🎉 Welcome! Your free trial is now active. Enjoy 1 IELTS test and 5 EduQuest quizzes!");
            return;
        }
        openPaymentModal(keys[index]);
    });
}

// Payment method selection
var paymentMethodBtns = document.querySelectorAll(".payment-method-btn");
for (var pm = 0; pm < paymentMethodBtns.length; pm++) {
    paymentMethodBtns[pm].addEventListener("click", function () {
        for (var j = 0; j < paymentMethodBtns.length; j++) {
            paymentMethodBtns[j].classList.remove("selected");
        }
        this.classList.add("selected");
        selectedPaymentMethod = this.getAttribute("data-method");

        var confirmBtn = document.getElementById("paymentConfirmBtn");
        confirmBtn.disabled = false;
        var names = { payme: "Payme", click: "Click", visa: "Visa", uzcard: "Uzcard" };
        confirmBtn.textContent = "Pay with " + names[selectedPaymentMethod];
    });
}

// Close modal
document.getElementById("paymentClose").addEventListener("click", function () {
    document.getElementById("paymentOverlay").classList.add("hidden");
    document.body.style.overflow = "";
});

document.getElementById("paymentOverlay").addEventListener("click", function (e) {
    if (e.target === this) {
        this.classList.add("hidden");
        document.body.style.overflow = "";
    }
});

// Confirm payment (simulated)
document.getElementById("paymentConfirmBtn").addEventListener("click", function () {
    if (!selectedPaymentMethod) return;

    this.disabled = true;
    this.textContent = "Processing...";

    var btn = this;
    setTimeout(function () {
        var modal = document.querySelector(".payment-modal");
        var amount = document.getElementById("paymentAmount").textContent;
        var names = { payme: "Payme", click: "Click", visa: "Visa", uzcard: "Uzcard" };

        modal.innerHTML =
            '<button class="payment-close" id="paymentCloseSuccess">✕</button>' +
            '<div class="payment-success">' +
            '<span class="payment-success-icon">🎉</span>' +
            '<h4>Payment Successful!</h4>' +
            '<p>Your payment of <strong>' + amount + '</strong> via <strong>' + names[selectedPaymentMethod] + '</strong> has been processed.</p>' +
            '<br><p>Welcome to AlloTutor! Start learning now.</p>' +
            '</div>';

        document.getElementById("paymentCloseSuccess").addEventListener("click", function () {
            document.getElementById("paymentOverlay").classList.add("hidden");
            document.body.style.overflow = "";
            // Restore modal content for next use
            setTimeout(restorePaymentModal, 300);
        });
    }, 1500);
});

function restorePaymentModal() {
    var modal = document.querySelector(".payment-modal");
    modal.innerHTML =
        '<button class="payment-close" id="paymentClose">✕</button>' +
        '<h3>Complete Payment</h3>' +
        '<div class="payment-plan-name" id="paymentPlanName">Student Plan — $5/month</div>' +
        '<div class="payment-divider"></div>' +
        '<div class="payment-label">Choose Payment Method</div>' +
        '<div class="payment-methods-grid">' +
        '<button class="payment-method-btn" data-method="payme"><span class="payment-method-icon payme-logo">payme</span><span class="payment-method-desc">UZS balance</span></button>' +
        '<button class="payment-method-btn" data-method="click"><span class="payment-method-icon click-logo">CLICK</span><span class="payment-method-desc">UZS balance</span></button>' +
        '<button class="payment-method-btn" data-method="visa"><span class="payment-method-icon visa-logo">VISA</span><span class="payment-method-desc">International card</span></button>' +
        '<button class="payment-method-btn" data-method="uzcard"><span class="payment-method-icon uzcard-logo">UZCARD</span><span class="payment-method-desc">Local card</span></button>' +
        '</div>' +
        '<div class="payment-amount"><span class="payment-amount-label">Total Amount</span><span class="payment-amount-value" id="paymentAmount">$5.00</span></div>' +
        '<button class="payment-confirm-btn" id="paymentConfirmBtn" disabled>Select a payment method</button>' +
        '<div class="payment-secure-note">🔒 Secure payment — your data is encrypted</div>';

    // Re-bind event listeners
    document.getElementById("paymentClose").addEventListener("click", function () {
        document.getElementById("paymentOverlay").classList.add("hidden");
        document.body.style.overflow = "";
    });

    var newMethodBtns = document.querySelectorAll(".payment-method-btn");
    for (var i = 0; i < newMethodBtns.length; i++) {
        newMethodBtns[i].addEventListener("click", function () {
            selectedPaymentMethod = this.getAttribute("data-method");
            for (var j = 0; j < newMethodBtns.length; j++) {
                newMethodBtns[j].classList.remove("selected");
            }
            this.classList.add("selected");
            var confirmBtn = document.getElementById("paymentConfirmBtn");
            confirmBtn.disabled = false;
            var names = { payme: "Payme", click: "Click", visa: "Visa", uzcard: "Uzcard" };
            confirmBtn.textContent = "Pay with " + names[selectedPaymentMethod];
        });
    }

    document.getElementById("paymentConfirmBtn").addEventListener("click", function () {
        if (!selectedPaymentMethod) return;
        this.disabled = true;
        this.textContent = "Processing...";
        var btn = this;
        setTimeout(function () {
            var modal = document.querySelector(".payment-modal");
            var amount = document.getElementById("paymentAmount").textContent;
            var names = { payme: "Payme", click: "Click", visa: "Visa", uzcard: "Uzcard" };
            modal.innerHTML =
                '<button class="payment-close" id="paymentCloseSuccess">✕</button>' +
                '<div class="payment-success"><span class="payment-success-icon">🎉</span><h4>Payment Successful!</h4>' +
                '<p>Your payment of <strong>' + amount + '</strong> via <strong>' + names[selectedPaymentMethod] + '</strong> has been processed.</p>' +
                '<br><p>Welcome to AlloTutor! Start learning now.</p></div>';
            document.getElementById("paymentCloseSuccess").addEventListener("click", function () {
                document.getElementById("paymentOverlay").classList.add("hidden");
                document.body.style.overflow = "";
                setTimeout(restorePaymentModal, 300);
            });
        }, 1500);
    });
}

