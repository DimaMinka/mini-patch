/**
 * Common low-value words or phrases that don't warrant a full LLM/Search query
 * but should get a polite/fun response.
 */
const LOW_VALUE_INPUTS: Record<string, string> = {
    // English - Greetings
    'hi': 'Hello! Looking for custom patches? 🦎',
    'hey': 'Hey there! � How can I help you today?',
    'hello': 'Hi! Ready to find some patches? 🦎',
    'yo': 'Yo! 👋 What\'s up?',
    'sup': 'Hey! What can I help you find today?',
    'wassup': 'Not much! Just ready to help you find patches. 😎',
    'hiya': 'Hiya! � Looking for something specific?',
    'heya': 'Hey! Ready to browse our collection?',
    'howdy': 'Howdy! 🤠 What brings you here today?',
    'greetings': 'Greetings! How can I assist you?',

    // English - Thanks
    'thx': 'You\'re welcome! Any time! 🦎',
    'thanks': 'You\'re welcome! Let me know if you need anything else.',
    'thank you': 'No problem! Happy to help.',
    'ty': 'You\'re welcome! 😊',
    'tysm': 'You\'re very welcome! Glad I could help!',
    'thank u': 'No worries! Here to help.',
    'thnx': 'Anytime! 🦎',
    'appreciate it': 'My pleasure! Let me know if you need more help.',

    // English - Acknowledgments
    'ok': 'Okay! What would you like to do next?',
    'okay': 'Roger that! 🫡',
    'k': 'Copy that.',
    'kk': 'Got it! What\'s next?',
    'alright': 'Alright! Ready when you are.',
    'got it': 'Perfect! Anything else?',
    'understood': 'Great! What can I help with?',
    'cool': 'Right? 😎 We have even cooler patches in the collection.',
    'nice': 'Glad you like it! Want to see more?',
    'awesome': 'Awesome indeed! 🎉 Check out our full collection.',
    'great': 'Great! What would you like to explore?',
    'perfect': 'Perfect! Ready to find more?',
    'good': 'Good! What\'s next on your list?',

    // English - Reactions
    'lol': '😂 Glad I could entertain you! Let me know if you want to see some cool patches.',
    'haha': 'Hehe! 😄 Looking for something funny? Check out our morale patches!',
    'hehe': 'Hehe! � We have some fun designs!',
    'lmao': '😂 Glad you\'re having fun! Want to see our collection?',
    'rofl': '� Happy to entertain! Check out our patches!',
    'wow': 'I know, right? 🤩 Want to see more?',
    'omg': 'Right?! � We have amazing stuff!',
    'wtf': 'Surprising, isn\'t it? 😄 Let me show you around.',
    'damn': 'Pretty impressive, right? 😎',
    'whoa': 'Whoa indeed! � Want to explore more?',

    // English - Farewells
    'bye': 'See you later! Come back soon! 👋',
    'goodbye': 'Goodbye! Have a great day!',
    'cya': 'See ya! Come back anytime! 👋',
    'see ya': 'See you! Have a good one! 👋',
    'later': 'Later! Don\'t be a stranger! 👋',
    'peace': 'Peace out! ✌️ Come back soon!',
    'ttyl': 'Talk to you later! 👋',
    'gn': 'Good night! Sweet dreams! 🌙',
    'good night': 'Good night! Sleep well! 🌙',
    'goodnight': 'Goodnight! See you tomorrow! 🌙',

    // English - Testing
    'test': 'Systems online! 🦎 Ready to search.',
    'testing': 'All systems operational! Ready to help.',
    'hello world': 'Hello back! 👋 Ready to find patches?',

    // English - Single letters/short
    'y': 'Yes! What would you like to do?',
    'n': 'No problem! Let me know if you change your mind.',
    'yes': 'Great! What can I help you with?',
    'no': 'No worries! Let me know if you need anything.',
    'yep': 'Yep! What\'s next?',
    'nope': 'No problem! Just let me know if you need help.',
    'yeah': 'Yeah! What are you looking for?',
    'nah': 'No worries! I\'m here if you need me.',

    // Hebrew - Greetings
    'היי': 'היי! 👋 איך אני יכול לעזור לך היום?',
    'הי': 'הי! מה נשמע? 🦎',
    'שלום': 'שלום! מוכן למצוא כמה טלאים מגניבים? 🦎',
    'שלומות': 'שלום שלום! איך אפשר לעזור?',
    'מה קורה': 'הכל טוב! מה אפשר לעזור לך למצוא?',
    'מה נשמע': 'הכל בסדר! מחפש משהו מיוחד?',
    'בוקר טוב': 'בוקר טוב! איזה יום מעולה לחפש טלאים! ☀️',
    'ערב טוב': 'ערב טוב! מה נחפש היום? 🌙',
    'לילה טוב': 'לילה טוב! חלומות מתוקים! 🌙',

    // Hebrew - Thanks
    'תודה': 'בכיף! אני כאן אם צריך עוד משהו.',
    'תודה רבה': 'אין בעד מה! שמח לעזור! 😊',
    'תודוש': 'בכיף! שמח לעזור. 😄',
    'תנקס': 'בכיף! 🦎',
    'תנקיו': 'אין על מה! תמיד פה.',
    'מעריך': 'בכיף גדול! �',

    // Hebrew - Acknowledgments
    'אוקיי': 'אוקיי! מה הלאה?',
    'אוקי': 'סבבה! מה עושים?',
    'בסדר': 'מעולה! איך אפשר לעזור?',
    'טוב': 'טוב מאוד! מה הדבר הבא?',
    'יופי': 'יופי! 👍 מה עוד?',
    'מצוין': 'מצוין! בוא נמשיך.',
    'אחלה': 'מעולה! 👍 מה בא לך לראות עכשיו?',
    'סבבה': 'סבבה לגמרי! בוא נמשיך. �',
    'כיף': 'כיף! מה עוד אפשר להראות לך?',
    'מגניב': 'מגניב! 😎 יש לנו עוד הרבה דברים מגניבים.',
    'שיק': 'שיק! רוצה לראות עוד?',

    // Hebrew - Reactions
    'חחח': 'חחח! 😄 מחפש משהו מצחיק? יש לנו טלאי מורל אדירים!',
    'חחחח': 'חחחח! 😂 שמח שאתה נהנה!',
    'חחחחח': '🤣 יש לנו עוד דברים מצחיקים!',
    'חחחחחחח': '😂 בוא נמצא לך עוד!',
    'הההה': 'הההה! 😄 כיף לראות שאתה נהנה!',
    'וואו': 'נכון? 🤩 וזה עוד כלום לעומת מה שיש באוסף.',
    'וואלה': 'וואלה! 😮 יש עוד הרבה מה לראות!',
    'אוף': 'אוף! 😱 מרשים, נכון?',
    'וואי': 'וואי! 🤩 רוצה לראות עוד?',

    // Hebrew - Farewells
    'ביי': 'ביי ביי! נתראה בקרוב! 👋',
    'ביי ביי': 'ביי! חזור בקרוב! 👋',
    'להתראות': 'להתראות! שיהיה אחלה יום!',
    'שלום שלום': 'שלום! תחזור בקרוב! 👋',
    'יאללה ביי': 'יאללה! נתראה! 👋',
    'נתראה': 'נתראה! כל טוב! 👋',

    // Russian - Greetings
    'привет': 'Привет! 👋 Готовы найти крутые патчи? 🦎',
    'приветик': 'Приветик! 👋 Чем могу помочь?',
    'здравствуйте': 'Здравствуйте! Чем могу помочь?',
    'здравствуй': 'Здравствуй! Что ищем?',
    'здорово': 'Здорово! Как дела?',
    'хай': 'Хай! 👋 Что будем искать?',
    'хей': 'Хей! Чем помочь?',
    'доброе утро': 'Доброе утро! ☀️ Отличный день для поиска патчей!',
    'добрый день': 'Добрый день! Чем могу помочь?',
    'добрый вечер': 'Добрый вечер! 🌙 Что ищем?',
    'доброй ночи': 'Доброй ночи! Сладких снов! 🌙',
    'спокойной ночи': 'Спокойной ночи! До завтра! 🌙',

    // Russian - Thanks
    'спасибо': 'Пожалуйста! Обращайтесь в любое время! 🦎',
    'спасибо большое': 'Пожалуйста! Рад помочь! 😊',
    'спс': 'Не за что! 😉',
    'сенкс': 'Не за что! 🦎',
    'благодарю': 'Всегда пожалуйста! 😊',
    'благодарствую': 'Рад помочь!',
    'пасиб': 'Не за что! 😄',
    'пасибо': 'Пожалуйста! 😊',

    // Russian - Acknowledgments
    'ок': 'Окей! Что будем искать дальше?',
    'окей': 'Окей! Что дальше?',
    'хорошо': 'Отлично! 👍',
    'ладно': 'Ладно! Что еще?',
    'понятно': 'Отлично! Что-то еще?',
    'ясно': 'Ясно! Продолжаем?',
    'класс': 'Класс! 😎 Хотите еще?',
    'классно': 'Классно! Что еще посмотрим?',
    'круто': 'Да, круто! 😎 А у нас есть еще круче.',
    'супер': 'Супер! 🎉 Хотите увидеть больше?',
    'отлично': 'Отлично! Что дальше?',
    'прекрасно': 'Прекрасно! Продолжаем?',
    'замечательно': 'Замечательно! Что еще?',
    'норм': 'Норм! 👍 Что дальше?',
    'нормально': 'Нормально! Продолжаем?',

    // Russian - Reactions
    'хаха': 'Ха-ха! 😄 Ищете что-то веселое? Посмотрите наши мораль-патчи!',
    'хахаха': 'Ха-ха-ха! 😂 Рад, что весело!',
    'хахахаха': '🤣 Есть еще много интересного!',
    'ахаха': 'А-ха-ха! 😄 Весело, правда?',
    'ахахаха': '😂 Отлично! Что еще посмотрим?',
    'хехе': 'Хе-хе! 😄 Забавно, да?',
    'хихи': 'Хи-хи! 😊 Рад, что нравится!',
    'вау': 'Впечатляет, правда? 🤩 Хотите увидеть больше?',
    'ого': 'Ого! 😮 Круто, да?',
    'ничего себе': 'Ничего себе! 😱 Впечатляет?',
    'офигеть': 'Офигеть! 🤯 Правда круто!',
    'блин': 'Да уж! 😅 Впечатляет!',

    // Russian - Farewells
    'пока': 'Пока! Заходите еще! 👋',
    'пока пока': 'Пока-пока! До встречи! 👋',
    'до свидания': 'До свидания! Хорошего дня!',
    'до встречи': 'До встречи! Возвращайтесь! 👋',
    'увидимся': 'Увидимся! Всего доброго! 👋',
    'бывай': 'Бывай! Заходи еще! 👋',
    'чао': 'Чао! 👋 До скорого!',
    'адьос': 'Адьос! 👋 Возвращайтесь!',
};

/**
 * Basic profanity filter to avoid processing harmful inputs.
 * Returns a canned response if a match is found.
 */
const PROFANITY_LIST = [
    // English
    'fuck', 'shit', 'bitch', 'asshole', 'cunt', 'dick', 'pussy', 'bastard', 'whore', 'slut',
    // Hebrew
    'זונה', 'שרמוטה', 'מניאק', 'חרא', 'בן זונה', 'כוס', 'זין', 'דפוק', 'אידיוט',
    // Russian
    'бля', 'сука', 'хуй', 'пизда', 'ебать', 'мудак', 'говно', 'жопа', 'урод', 'дебил'
];

export function filterInput(input: string): string | null {
    const normalize = input.trim().toLowerCase();

    // 1. Check for exact matches of low-value inputs
    if (LOW_VALUE_INPUTS[normalize]) {
        return LOW_VALUE_INPUTS[normalize];
    }

    // 2. Check for profanity (simple inclusion check)
    // We check if the input *contains* the word as a distinct token
    const words = normalize.split(/\s+/);
    const hasProfanity = words.some(word => PROFANITY_LIST.includes(word));

    if (hasProfanity) {
        return "I prefer to keep our conversation clean and professional. Let's focus on patches! 🦎";
    }

    // 3. Check for very short/meaningless input
    if (normalize.length < 2 && !['y', 'n'].includes(normalize)) {
        return "Could you be a bit more specific? I'm listening! 👂";
    }

    return null; // Input is valid/complex enough to process
}
