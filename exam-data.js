const exams = [
  {
    id: 'c2_practice_1',
    title: 'C2 Proficiency: Practice Exam 1',
    duration: 90 * 60,
    reading: {
        part1: {
            title: 'Part 1: Multiple-choice cloze',
            instructions: 'For questions 1-8, read the text below and decide which answer (A, B, C or D) best fits each gap.',
            text_title: 'The Subtleties of Communication',
            text: 'Effective communication is often mistakenly believed to be a simple matter of uttering intelligible words. In reality, it is a far more complex affair, (1)___ a vast range of non-verbal cues and an intuitive understanding of context. A pause at the right moment can be more (2)___ than a torrent of words. The slightest shift in tone can (3)___ the entire meaning of a sentence, turning a compliment into an insult. These subtleties are often culturally (4)___. What might be a sign of respect in one culture could be interpreted as insincere in another. Therefore, mastering a language is not merely about learning vocabulary and grammar; it is about becoming (5)___ to the unspoken symphony of human interaction. It requires a high level of perceptual (6)___, the ability to read between the lines and to grasp what is implied rather than explicitly stated. Without this sensitivity, one can easily (7)___ the wrong impression, potentially leading to misunderstandings that (8)___ relationships.',
            questions: [
                { q: '1', options: ['involving', 'containing', 'consisting', 'comprising'], answer: 'A', explanation: "'Involving' correctly suggests that non-verbal cues are a component part of the complex affair of communication." },
                { q: '2', options: ['eloquent', 'outspoken', 'articulate', 'vocal'], answer: 'A', explanation: "'Eloquent' means fluent or persuasive in speaking or writing. It can be used figuratively to describe a non-verbal action that is very expressive." },
                { q: '3', options: ['invert', 'adapt', 'alter', 'adjust'], answer: 'C', explanation: "'Alter' means to change in character or composition, which is the most fitting word for changing the entire meaning of a sentence." },
                { q: '4', options: ['bound', 'derived', 'based', 'inherent'], answer: 'A', explanation: "The phrase 'culturally bound' is a fixed collocation meaning that something is limited or defined by a particular culture." },
                { q: '5', options: ['attuned', 'acquainted', 'accustomed', 'aware'], answer: 'A', explanation: "'Attuned to' is the correct phrasal verb meaning to be or become receptive or aware of something, in this case, the 'unspoken symphony'." },
                { q: '6', options: ['sharpness', 'acuity', 'intensity', 'clarity'], answer: 'B', explanation: "'Perceptual acuity' is a collocation meaning sharpness of perception or the ability to notice and understand things that are not obvious." },
                { q: '7', options: ['transmit', 'convey', 'impart', 'bestow'], answer: 'B', explanation: "'Convey an impression' is a strong collocation meaning to communicate or make an impression known." },
                { q: '8', options: ['sour', 'spoil', 'embitter', 'worsen'], answer: 'A', explanation: "The verb 'sour' can be used transitively to mean 'make unpleasant or new'. It fits the context of relationships turning bad." }
            ]
        }
    },
    writing: {
      part1: { taskType: 'essay', instructions: 'Write your answer in 240-280 words.', prompt: { text1_title: 'Technology in our lives', text1_content: `Despite the obvious advantages of new technology, the speed with which we are confronted with new developments leaves many feeling overwhelmed. How we respond to new technologies is often a reflection of how able we are as individuals to cope with change in other areas of our lives. If we feel in control, we are more likely to embrace innovation; if we are less confident, we may avoid situations which threaten or challenge us.`, text2_title: 'Technology at work', text2_content: `Whether it be new software for the office, or state-of-the-art equipment for the factory, the successful introduction of new technology in the workplace requires effective, practical training in how to use it. This training allows staff to become familiar with the technology before using it for real in their daily tasks. Getting everyone on board by preparing them psychologically for change is the first step...` } }
    }
  },
  {
    id: 'c2_practice_2',
    title: 'C2 Proficiency: Practice Exam 2',
    duration: 90 * 60,
    reading: {
        part1: {
            title: 'Part 1: Multiple-choice cloze',
            instructions: 'For questions 1-8, read the text below and decide which answer (A, B, C or D) best fits each gap.',
            text_title: 'The Nature of Genius',
            text: 'The concept of genius is something that has fascinated thinkers for centuries. Is it an innate quality, a gift from the gods, or is it the (1)___ of relentless hard work? While a certain level of natural aptitude is undeniable, the stories of many so-called geniuses (2)___ to the latter. They often speak of years of obsessive practice, of grappling with a subject until they have (3)___ it inside out. This dedication allows them to see patterns and connections that (4)___ others. It is this depth of understanding, rather than a magical spark, that (5)___ their groundbreaking discoveries. Furthermore, genius does not operate in a vacuum. It is often (6)___ by the intellectual climate of the time, building upon the work of predecessors and collaborating with contemporaries. Thus, to (7)___ genius to a single, isolated individual is to overlook the complex web of influences that makes such extraordinary achievements possible. It is a more comforting, but less accurate, narrative to believe in effortless inspiration than to (8)___ the sheer effort involved.',
            questions: [
                { q: '1', options: ['outcome', 'product', 'result', 'consequence'], answer: 'B', explanation: "'Product of' is the correct collocation here, meaning something produced by a process, in this case, hard work." },
                { q: '2', options: ['indicate', 'signal', 'point', 'suggest'], answer: 'C', explanation: "'Point to' is a phrasal verb meaning to suggest that something is true or the cause of something." },
                { q: '3', options: ['known', 'realised', 'understood', 'mastered'], answer: 'D', explanation: "'Mastered' is the strongest and most appropriate word for gaining complete knowledge or skill in a subject." },
                { q: '4', options: ['evade', 'elude', 'avoid', 'shun'], answer: 'B', explanation: "'Elude' means to escape from or fail to be understood by someone, fitting the context of connections that most people don't see." },
                { q: '5', options: ['underpins', 'cradles', 'props', 'sustains'], answer: 'A', explanation: "'Underpins' means to support, justify, or form the basis for something, like a discovery." },
                { q: '6', options: ['kindled', 'ignited', 'fired', 'sparked'], answer: 'A', explanation: "'Kindled' means to arouse or inspire an emotion or feeling, fitting the idea of being stimulated by the intellectual climate." },
                { q: '7', options: ['attribute', 'assign', 'credit', 'blame'], answer: 'A', explanation: "'Attribute something to someone' is the correct structure for saying that someone is the cause of something." },
                { q: '8', options: ['admit', 'receive', 'accept', 'acknowledge'], answer: 'D', explanation: "'Acknowledge' means to accept or admit the existence or truth of something, which is the best fit for recognizing the effort involved." }
            ]
        }
    },
    writing: {
      part1: { taskType: 'review', instructions: 'Write your answer in 280-320 words.', prompt: { text1_title: 'Review Task', text1_content: `...`, text2_title: '', text2_content: '' } }
    }
  }
];

window.examData = exams;