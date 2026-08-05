const quoteStrings = [
  // Digital Minimalism & Focus
  "Almost everything will work again if you unplug it for a few minutes, including you.",
  "Your attention is your most valuable asset. Spend it wisely.",
  "The cost of a thing is the amount of what I will call life which is required to be exchanged for it.",
  "Disconnect to connect.",
  "Life is what happens when you're busy looking at your screen.",
  "You don't have to be available to everyone, all the time.",
  "Wherever you are, be all there.",
  "Real life is happening right now, outside of that glowing rectangle.",
  "If it costs you your peace, it's too expensive.",
  "Stop scrolling and start living.",
  "Comparison is the thief of joy.",
  "The shorter way to do many things is to only do one thing at a time.",
  "You can always make more money, but you cannot make more time.",
  "Half of the modern world's problems are caused by people trying to distract themselves.",
  "Take a deep breath. You are exactly where you need to be.",
  "There is more to life than increasing its speed.",
  "Nothing changes if nothing changes.",
  "We are shaped by our thoughts; we become what we think.",
  "Don't let the noise of others' opinions drown out your own inner voice.",
  "If you want to live a happy life, tie it to a goal, not to people or things.",
  "A wealth of information creates a poverty of attention.",
  "The present moment is the only moment available to us, and it is the door to all moments.",
  "To do two things at once is to do neither.",
  "Boredom is the space where creativity and clarity are born. Don't run from it.",
  "You are not missing out on anything by being present in your own life.",
  "Your mind is a sacred space. Do not let just anything enter it.",
  "Every time you open an app, you are giving away a piece of your day.",
  "The world will wait. Your peace of mind cannot.",
  "It takes courage to say yes to rest and play in a culture where exhaustion is seen as a status symbol.",
  "Silence is not empty, it is full of answers.",

  // Thich Nhat Hanh Inspired (Mindfulness & Presence)
  "Smile, breathe, and go slowly.",
  "There is no way to happiness; happiness is the way.",
  "Life is available only in the present moment.",
  "Walk as if you are kissing the Earth with your feet.",
  "Letting go gives us freedom, and freedom is the only condition for happiness.",
  "To be beautiful means to be yourself. You don't need to be accepted by others.",
  "Drink your tea slowly and reverently, as if it is the axis on which the world earth revolves.",
  "Breathing in, I calm body and mind. Breathing out, I smile.",
  "The seed of suffering in you may be strong, but don't wait until you have no more suffering before allowing yourself to be happy.",
  "Because you are alive, everything is possible.",
  "If we are not fully ourselves, truly in the present moment, we miss everything.",
  "Many people are alive but don't touch the miracle of being alive.",
  "When you love someone, the best thing you can offer is your presence.",
  "Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.",
  "Hope is important because it can make the present moment less difficult to bear.",
  "Waking up this morning, I smile. Twenty-four brand new hours are before me.",
  "Mindfulness helps you go home to the present. And every time you go there and recognize a condition of happiness that you have, happiness comes.",
  "Sometimes your joy is the source of your smile, but sometimes your smile can be the source of your joy.",
  "To think in terms of either pessimism or optimism oversimplifies the truth. The problem is to see reality as it is.",
  "We have more possibilities available in each moment than we realize.",
  "Our own life has to be our message.",
  "You must love in such a way that the person you love feels free.",
  "Peace can exist only in the present moment.",
  "Do not lose yourself in the past. Do not lose yourself in the future.",
  "The mind can go in a thousand directions, but on this beautiful path, I walk in peace.",
  "If you truly get in touch with a piece of carrot, you get in touch with the soil, the rain, the sunshine.",
  "At any moment, you have a choice, that either leads you closer to your spirit or further away from it.",
  "Understanding is the other name of love. If you don't understand, you can't love.",
  "Every breath we take, every step we make, can be filled with peace, joy and serenity.",
  "Let us fill our hearts with our own compassion—towards ourselves and towards all living beings.",

  // Dalai Lama Inspired (Compassion & Happiness)
  "Happiness is not something ready made. It comes from your own actions.",
  "Our prime purpose in this life is to help others. And if you can't help them, at least don't hurt them.",
  "If you want others to be happy, practice compassion. If you want to be happy, practice compassion.",
  "Remember that sometimes not getting what you want is a wonderful stroke of luck.",
  "Choose to be optimistic, it feels better.",
  "Sleep is the best meditation.",
  "A disciplined mind leads to happiness, and an undisciplined mind leads to suffering.",
  "The purpose of our lives is to be happy.",
  "Love and compassion are necessities, not luxuries. Without them humanity cannot survive.",
  "My religion is very simple. My religion is kindness.",
  "Be kind whenever possible. It is always possible.",
  "We can never obtain peace in the outer world until we make peace with ourselves.",
  "Look at situations from all angles, and you will become more open.",
  "If a problem is fixable, if a situation is such that you can do something about it, then there is no need to worry.",
  "The ultimate source of happiness is not money and power, but warm-heartedness.",
  "Anger is the ultimate destroyer of your own peace of mind.",
  "A true hero is one who conquers his own anger and hatred.",
  "Inner peace is the key: if you have inner peace, the external problems do not affect your deep sense of peace and tranquility.",
  "Share your knowledge. It is a way to achieve immortality.",
  "Judge your success by what you had to give up in order to get it.",
  "When you talk, you are only repeating what you already know. But if you listen, you may learn something new.",
  "Open your arms to change, but don't let go of your values.",
  "Compassion naturally creates a positive atmosphere, and as a result you feel peaceful and content.",
  "The more you are motivated by love, the more fearless and free your action will be.",
  "Time passes unhindered. When we make mistakes, we cannot turn the clock back and try again. All we can do is use the present well.",
  "To conquer oneself is a greater victory than to conquer thousands in a battle.",
  "Give the ones you love wings to fly, roots to come back, and reasons to stay.",
  "An open heart is an open mind.",
  "Happiness is not determined by what's happening around you, but rather what's happening inside you.",
  "Peace does not mean an absence of conflicts; differences will always be there. Peace means solving these differences through peaceful means.",

  // Jordan Peterson Inspired (Meaning & Responsibility)
  "Compare yourself to who you were yesterday, not to who someone else is today.",
  "Pursue what is meaningful, not what is expedient.",
  "Set your house in perfect order before you criticize the world.",
  "Treat yourself like someone you are responsible for helping.",
  "Tell the truth. Or, at least, don't lie.",
  "Assume that the person you are listening to might know something you don't.",
  "Meaning is what sustains you in life; it's not expedience.",
  "To suffer terribly and to know yourself as the cause: that is Hell.",
  "Notice that opportunity lurks where responsibility has been abdicated.",
  "If you are not willing to be a fool, you can't become a master.",
  "You must determine where you are going, so that you can bargain for yourself.",
  "Stand up straight with your shoulders back.",
  "Make friends with people who want the best for you.",
  "Do not let your children do anything that makes you dislike them.",
  "Pet a cat when you encounter one on the street.",
  "You cannot be protected from the things that frighten you and hurt you, but if you identify with the part of your being that handles transformation, then you are always equal to the task.",
  "You're going to pay a price for every bloody thing you do and everything you don't do.",
  "It is better to do something badly than to not do it at all.",
  "The purpose of life is finding the largest burden that you can bear and bearing it.",
  "Face the demands of life voluntarily. Respond to a challenge, instead of bracing for a catastrophe.",
  "You can only find out what you actually believe by watching how you act.",
  "If you fulfill your obligations everyday you don't need to worry about the future.",
  "Don't underestimate the power of vision and direction.",
  "Truth is the handmaiden of love.",
  "There is no faith and no courage and no sacrifice in doing what is expedient.",
  "When you have something to say, silence is a lie.",
  "Intolerance of others' views is not a sign of strength, but of weakness.",
  "The successful among us delay gratification. The successful among us bargain with the future.",
  "You must discipline yourself carefully. You must keep the promises you make to yourself.",
  "To learn is to die voluntarily and be born again, in great ways and small.",

  // General Heartfulness & Purpose
  "Doubt kills more dreams than failure ever will.",
  "Focus on the step in front of you, not the whole staircase.",
  "Action is the foundational key to all success.",
  "Do what you can, with what you have, where you are.",
  "Your life is too valuable to be left to chance.",
  "Am I using my time, or is my time using me?",
  "He who has a why to live for can bear almost any how.",
  "The obstacle in the path becomes the path. Never forget, within every obstacle is an opportunity.",
  "Waste no more time arguing what a good man should be. Be one.",
  "If it is not right, do not do it; if it is not true, do not say it.",
  "You have power over your mind—not outside events. Realize this, and you will find strength.",
  "The happiness of your life depends upon the quality of your thoughts.",
  "It is not death that a man should fear, but he should fear never beginning to live.",
  "How long are you going to wait before you demand the best for yourself?",
  "First say to yourself what you would be; and then do what you have to do.",
  "We suffer more often in imagination than in reality.",
  "It is not the man who has too little, but the man who craves more, that is poor.",
  "No person has the power to have everything they want, but it is in their power not to want what they don't have.",
  "Man is not worried by real problems so much as by his imagined anxieties about real problems.",
  "Difficulties strengthen the mind, as labor does the body.",
  "If a man knows not to which port he sails, no wind is favorable.",
  "Every day is a new life to a wise man.",
  "True happiness is to enjoy the present, without anxious dependence upon the future.",
  "While we wait for life, life passes.",
  "The whole future lies in uncertainty: live immediately.",
  "Begin at once to live, and count each separate day as a separate life.",
  "As long as you live, keep learning how to live.",
  "Life is long, if you know how to use it.",
  "Associate with people who are likely to improve you.",
  "Wealth consists not in having great possessions, but in having few wants.",

  // Finding Quiet & Breaking Illusions
  "Sometimes doing nothing is the most productive thing you can do.",
  "You cannot pour from an empty cup. Take care of yourself first.",
  "The quiet mind is richer than a crown.",
  "Notice the trees. Notice the sky. The world is right here.",
  "Scrolling is a pause button on your actual life.",
  "Nothing on this website will fix a bad day. A walk might.",
  "The internet is a library, a marketplace, and a casino. Know which room you are in.",
  "Every minute spent envying someone else's life is a minute wasted in your own.",
  "Boredom is not a problem to be solved; it is the mind seeking stillness.",
  "There is nothing in the digital world more important than your physical peace.",
  "Be ruthless with the things that steal your focus.",
  "Do you control your devices, or do they control you?",
  "A distracted mind is an unhappy mind.",
  "Stillness is where you find out who you really are.",
  "The urgency of a notification is an illusion.",
  "You don't need to have an opinion on everything.",
  "Let the internet exist without you for an hour.",
  "Breathe in the air, not the algorithm.",
  "It is okay to sit in silence. The world will keep turning.",
  "Your worth is not measured by your productivity, nor by your online presence.",

  // Depth, Reflection & Clarity
  "What would you do today if you weren't trying to distract yourself?",
  "Avoid the trap of thinking that being busy is the same as being important.",
  "Solitude is the furnace of transformation.",
  "Look down at your hands. Wiggle your fingers. You are real. The screen is not.",
  "When was the last time you let yourself be completely uninterrupted?",
  "A deep life is a good life.",
  "Do not measure your days by the dopamine hits you collect.",
  "Focus is a muscle. You are training it right now by closing this tab.",
  "If you want to master yourself, master your attention.",
  "You are currently blocking a habit that no longer serves you. Good job.",
  "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
  "Your future self is watching you right now through memories. Make them proud.",
  "What is the most meaningful thing you could be doing right now?",
  "Clarity comes from engagement with the real world, not the digital one.",
  "You owe it to yourself to be completely present.",
  "Don't trade your reality for a curated illusion.",
  "The best things in life aren't on a screen.",
  "Notice the tension in your shoulders. Drop them. Take a breath.",
  "You do not need more information. You need more quiet.",
  "The only way out is through. Do the hard work.",

  // Finishing Strong
  "Protect your energy.",
  "What you focus on expands. Choose wisely.",
  "You are capable of intense, unbroken focus. Reclaim it.",
  "Life is too short to be lived on autopilot.",
  "You are the author of your own attention.",
  "Put the phone down. Look up.",
  "Read a book. Write a sentence. Make something.",
  "Your inner peace is worth more than any content.",
  "It is a radical act to be satisfied with what you have right now.",
  "Do not let the endless scroll bury your ambitions.",
  "Every time you choose focus over distraction, you win.",
  "You are exactly where you are supposed to be. Now do what you are supposed to do.",
  "Your life is unfolding right now.",
  "Distraction is a way of hiding from yourself.",
  "The greatest gift you can give someone is your undivided attention.",
  "The grass is greener where you water it.",
  "Be a creator of your life, not a consumer of others'.",
  "Rest is productive. Mindless scrolling is not.",
  "You have enough. You know enough. You are enough.",
  "Now, close this tab and go do something beautiful."
];

const emojis = ["🌿", "✨", "🕊️", "🌅", "💛", "🧘", "🌸", "🦋", "🍵", "🏔️", "🕯️", "🪴", "☀️", "🌱", "💧", "🌙"];

function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// ---------------------------------------------------------
// SET YOUR GOAL HERE: Change this to 25 when you are done testing
const TOTAL_REQUIRED = 2; 
// ---------------------------------------------------------

const selectedQuotes = shuffle([...quoteStrings]).slice(0, TOTAL_REQUIRED);

const gridContainer = document.getElementById("quotes-grid");
const counterEl = document.getElementById("counter");
const proceedBtn = document.getElementById("proceed-btn");

let collectedCount = 0;

// Update initial UI numbers to match TOTAL_REQUIRED dynamically
counterEl.innerText = `Moments of Pause: 0 / ${TOTAL_REQUIRED}`;
proceedBtn.innerText = `Click all ${TOTAL_REQUIRED} tiles to unlock (0/${TOTAL_REQUIRED})`;

// Extract target URL safely, ignoring '&' separators
const fullSearch = window.location.search;
let targetUrl = "";
if (fullSearch.includes("?target=")) {
  targetUrl = fullSearch.substring(fullSearch.indexOf("?target=") + 8);
}

function updateProceedButton() {
  if (collectedCount >= TOTAL_REQUIRED) {
    proceedBtn.classList.add("unlocked");
    proceedBtn.removeAttribute("disabled");
    proceedBtn.innerText = "Proceed to Website ➔";
  } else {
    proceedBtn.classList.remove("unlocked");
    proceedBtn.setAttribute("disabled", "true");
    proceedBtn.innerText = `Click all ${TOTAL_REQUIRED} tiles to unlock (${collectedCount}/${TOTAL_REQUIRED})`;
  }
}

selectedQuotes.forEach(quoteText => {
  const cardDiv = document.createElement("div");
  cardDiv.className = "quote-card";
  
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  const textP = document.createElement("p");
  textP.className = "quote-text";
  textP.innerHTML = `${randomEmoji} "${quoteText}"`;
  
  cardDiv.appendChild(textP);
  
  cardDiv.addEventListener('click', () => {
    if (!cardDiv.classList.contains('collected')) {
      cardDiv.classList.add('collected');
      collectedCount++;
    } else {
      cardDiv.classList.remove('collected');
      collectedCount--;
    }

    counterEl.innerText = `Moments of Pause: ${collectedCount} / ${TOTAL_REQUIRED}`;
    updateProceedButton();
  });
  
  gridContainer.appendChild(cardDiv);
});

proceedBtn.addEventListener("click", () => {
  if (collectedCount >= TOTAL_REQUIRED && targetUrl) {
    const separator = targetUrl.includes('?') ? '&' : '?';
    window.location.href = `${targetUrl}${separator}unblock=true`;
  }
});