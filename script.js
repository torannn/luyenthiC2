// const URL = "http://khoakomlem-internal.ddns.net:3000"
const URL = ""

document.addEventListener('DOMContentLoaded', () => {
    // Get all the HTML elements
    const startScreen = document.getElementById('start-screen');
    const examScreen = document.getElementById('exam-screen');
    const resultsScreen = document.getElementById('results-screen');
    const examMenu = document.getElementById('exam-menu');
    const examForm = document.getElementById('exam-form');
    const tabs = document.querySelectorAll('.exam-tab');
    const panels = document.querySelectorAll('.exam-panel');
    const getFeedbackBtn = document.getElementById('get-feedback-btn');
    const aiFeedbackArea = document.getElementById('ai-feedback-area');
    const writingPart1 = document.getElementById('writing-part1');
    const wcPart1 = document.getElementById('wc-part1');
    const restartBtn = document.getElementById('restart-btn');
    const examTitleHeader = document.getElementById('exam-title-header');

    let timerInterval;
    let finalWritingFeedback = '';
    let currentExam;

    function createExamMenu() {
        examMenu.innerHTML = '';
        window.examData.forEach(exam => {
            const button = document.createElement('button');
            button.className = 'w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-10 rounded-lg hover:bg-blue-700 transition-colors text-lg';
            button.textContent = exam.title;
            button.dataset.examId = exam.id;
            button.addEventListener('click', () => {
                startScreen.classList.add('hidden');
                examScreen.classList.remove('hidden');
                loadExam(exam.id);
            });
            examMenu.appendChild(button);
        });
    }

    function initializeAccordions() {
        const headers = document.querySelectorAll('.accordion-header');

        headers.forEach(header => {
            header.addEventListener('click', () => {
                header.classList.toggle('active');
                const content = header.nextElementSibling;

                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    // Force reflow and recalculate scrollHeight
                    content.style.display = 'block';
                    const height = content.scrollHeight;
                    content.style.maxHeight = height + "px";
                }
            });
        });
    }

    function loadExam(examId) {
        currentExam = window.examData.find(e => e.id === examId);
        if (!currentExam) {
            console.error("Exam data not found for ID:", examId);
            return;
        }

        examTitleHeader.textContent = currentExam.title;
        startTimer(currentExam.duration);

        // Render Reading Section
        const readingContainer = document.getElementById('reading-task-container');
        const readingInfo = currentExam.reading.part1;
        let readingHTML = `
            <article class="exam-part mb-12">
                <h3 class="text-xl font-semibold border-b-2 border-blue-200 pb-2 mb-4">${readingInfo.title}</h3>
                <p class="mb-4 text-gray-600">${readingInfo.instructions}</p>
                <div class="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                    <h4 class="text-lg font-semibold mb-2">${readingInfo.text_title}</h4>
                    <p class="text-gray-700 leading-relaxed">${readingInfo.text.replace(/\(\d+\)___/g, (match, p1) => `<strong>(${match.slice(1, 2)})</strong> _____`)}</p>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">`;

        // ======================================================
        // =========== THIS IS THE CORRECTED PART ===============
        // ======================================================
        readingInfo.questions.forEach(q => {
            readingHTML += `<div><strong>${q.q}.</strong><div class="mt-2 space-y-2">`;
            const optionLetters = ['A', 'B', 'C', 'D'];
            q.options.forEach((opt, index) => {
                const letter = optionLetters[index];
                // The value of the input is now the letter (A, B, C, D) to match the answer key
                readingHTML += `<label class="block"><input type="radio" name="q${q.q}" value="${letter}"> ${letter}. ${opt}</label>`;
            });
            readingHTML += `</div></div>`;
        });
        // ======================================================
        // ======================================================

        readingHTML += `</div></article>`;
        readingContainer.innerHTML = readingHTML;

        // Render Writing Section
        const writingContainer = document.getElementById('writing-task-container');
        const writingInfo = currentExam.writing.part1;
        let writingPromptHTML = `
            <h3 class="text-xl font-semibold border-b-2 border-blue-200 pb-2 mb-4">Part 1: ${writingInfo.taskType.charAt(0).toUpperCase() + writingInfo.taskType.slice(1)}</h3>
            <p class="mb-4 text-gray-600">${writingInfo.instructions}</p>`;

        if (writingInfo.prompt.text2_content) {
            writingPromptHTML += `
             <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
               <div class="writing-prompt bg-blue-50 p-6 rounded-lg border border-blue-200">
                   <h4 class="font-semibold mb-2">${writingInfo.prompt.text1_title}</h4>
                   <p class="text-sm">${writingInfo.prompt.text1_content}</p>
               </div>
               <div class="writing-prompt bg-blue-50 p-6 rounded-lg border border-blue-200">
                   <h4 class="font-semibold mb-2">${writingInfo.prompt.text2_title}</h4>
                   <p class="text-sm">${writingInfo.prompt.text2_content}</p>
               </div>
            </div>`;
        } else {
            writingPromptHTML += `
            <div class="writing-prompt bg-blue-50 p-6 rounded-lg border border-blue-200 mb-4">
                <h4 class="font-semibold mb-2">${writingInfo.prompt.text1_title}</h4>
                <p>${writingInfo.prompt.text1_content}</p>
            </div>`;
        }
        writingContainer.innerHTML = writingPromptHTML;

        aiFeedbackArea.innerHTML = '';
        writingPart1.value = '';
        wcPart1.textContent = 'Word count: 0';
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('tab-active'));
            e.target.classList.add('tab-active');
            panels.forEach(panel => panel.classList.remove('active'));
            document.getElementById(`${e.target.dataset.tab}-panel`).classList.add('active');
        });
    });

    function startTimer(duration) {
        clearInterval(timerInterval);
        let timer = duration, hours, minutes, seconds;
        const display = document.getElementById('timer');
        timerInterval = setInterval(() => {
            hours = parseInt(timer / 3600, 10);
            minutes = parseInt((timer % 3600) / 60, 10);
            seconds = parseInt(timer % 60, 10);
            hours = hours < 10 ? "0" + hours : hours;
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            display.textContent = `${hours}:${minutes}:${seconds}`;
            if (--timer < 0) {
                clearInterval(timerInterval);
                display.textContent = "Time's up!";
                examForm.requestSubmit();
            }
        }, 1000);
    }

    writingPart1.addEventListener('input', () => {
        const words = writingPart1.value.trim().split(/\s+/).filter(Boolean);
        wcPart1.textContent = `Word count: ${words.length}`;
    });

    // Find this function in your script.js
    getFeedbackBtn.addEventListener('click', async () => {
        const textToAnalyze = writingPart1.value;
        if (!textToAnalyze.trim()) {
            alert("Please write your text before requesting feedback.");
            return;
        }
        aiFeedbackArea.innerHTML = `<p class="text-indigo-600">🤖 Analyzing... Please wait.</p>`;
        getFeedbackBtn.disabled = true;
        getFeedbackBtn.textContent = 'Analyzing...';
        try {
            const response = await fetch(`${URL}/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    essay: textToAnalyze,
                    taskType: currentExam.writing.part1.taskType 
                })
            });
            if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
            const data = await response.json();
            finalWritingFeedback = data.feedback;
            aiFeedbackArea.innerHTML = finalWritingFeedback;
        } catch (error) {
            console.error("Error:", error);
            aiFeedbackArea.innerHTML = `<p class="text-red-600">An error occurred. Please ensure the backend server is running.</p>`;
        } finally {
            getFeedbackBtn.disabled = false;
            getFeedbackBtn.textContent = 'Get AI Feedback';
        }
       
    });

    // --- FINAL VERSION: This function processes all results and generates the final report ---
    examForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!finalWritingFeedback) {
            alert("Please get AI feedback for your writing task before submitting the exam.");
            return; // This stops the function from continuing
        }
        clearInterval(timerInterval);


        // 1. Switch to the results screen and show loading messages in the new containers
        examScreen.classList.add('hidden');
        resultsScreen.classList.remove('hidden');
        document.getElementById('reading-feedback-content').innerHTML = `<p>Grading your reading answers...</p>`;
        document.getElementById('final-report-content').innerHTML = `<p>Generating your final report...</p>`;
        window.scrollTo(0, 0);

        // 2. Process Reading Feedback
        const formData = new FormData(examForm);
        const userAnswers = {};
        for (const [key, value] of formData.entries()) {
            userAnswers[key] = value;
        }

        const readingQuestions = currentExam.reading.part1.questions;
        let readingFeedbackHTML = '';
        const readingResultsForAI = []; // This new array will be sent to the server

        readingQuestions.forEach(q => {
            const questionId = `q${q.q}`;
            const userAnswer = userAnswers[questionId];
            const isCorrect = userAnswer === q.answer;

            readingResultsForAI.push({
                question: q.q,
                userAnswer: userAnswer || "No answer",
                correctAnswer: q.answer,
                isCorrect: isCorrect
            });

            const status = isCorrect ? 'Correct' : 'Incorrect';
            const statusColor = isCorrect ? 'text-green-600' : 'text-red-600';
            readingFeedbackHTML += `
        <div class="p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}">
            <p class="font-semibold"><strong class="${statusColor}">Question ${q.q}: ${status}</strong></p>
            <p class="text-sm mt-1">Your answer: <span class="font-medium">${userAnswer || 'No answer'}</span></p>
            ${!isCorrect ? `<p class="text-sm">Correct answer: <span class="font-medium">${q.answer}</span></p>` : ''}
            <div class="text-sm mt-2 pt-2 border-t border-gray-200">
                <strong class="text-gray-600">Rationale:</strong> ${q.explanation}
            </div>
        </div>
    `;
        });
        document.getElementById('reading-feedback-content').innerHTML = readingFeedbackHTML;
        
        if (finalWritingFeedback) {
            try {
                debugger
                const response = await fetch(`${URL}/generate-report`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        readingResults: readingResultsForAI,
                        writingFeedback: finalWritingFeedback
                    })
                });
                if (!response.ok) throw new Error('Failed to get final report.');
    
                const data = await response.json();
                document.getElementById('final-report-content').innerHTML = data.report;
                initializeAccordions();
            } catch (error) {
                console.error("Report Generation Error:", error);
                document.getElementById('final-report-content').innerHTML = `<p class="text-red-500">Could not generate the final performance report.</p>`;
            }
        } else {
            document.getElementById('final-report-content').innerHTML = `<p class="text-gray-600">Complete the writing task and get feedback to generate a final report.</p>`;
        }
       
    });

    restartBtn.addEventListener('click', () => {
        resultsScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
        finalWritingFeedback = '';
    });

    createExamMenu();
});