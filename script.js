document.addEventListener('DOMContentLoaded', () => {
  const mathForm = document.getElementById('math-form');
  const result = document.querySelector('.result');
  const dialogContainer = document.querySelector('.dialog-container');
  const dialogOutput = document.querySelector('.dialog');
  const copyButton = document.getElementById('copy-button');
  const copyDialogButton = document.getElementById('copy-dialog-button');
  const notification = document.getElementById('notification');
  const welcomeNotification = document.getElementById('welcome-notification');

  const mathButton = document.getElementById('mathematics-button');
  const testsButton = document.getElementById('tests-button');
  const autotestsButton = document.getElementById('autotests-button');
  const mathContainer = document.getElementById('mathematics-container');
  const testsContainer = document.getElementById('tests-container');
  const autotestsContainer = document.getElementById('autotests-container');

  const problemMarkerButton = document.getElementById('problem-marker-button');
  const macaroniButton = document.getElementById('macaroni-button');
  const problemMarkerContainer = document.getElementById('problem-marker-container');
  const singleChoiceButton = document.getElementById('single-choice-button');
  const multipleChoiceButton = document.getElementById('multiple-choice-button');
  const problemForm = document.getElementById('problem-form');
  const testResult = document.getElementById('test-result');
  const testCopyButton = document.getElementById('test-copy-button');
  const resultContainer = document.getElementById('result-container');

  const macaroniContainer = document.getElementById('macaroni-container');
  const macaroniForm = document.getElementById('macaroni-form');
  const macaroniResult = document.getElementById('macaroni-result');
  const macaroniCopyButton = document.getElementById('macaroni-copy-button');
  const macaroniResultContainer = document.getElementById('macaroni-result-container');

  const autotestsForm = document.getElementById('autotests-form');
  const autotestResult = document.getElementById('autotest-result');
  const autotestCopyButton = document.getElementById('autotest-copy-button');

  let currentFormat = 'single'; // Default format

  mathButton.addEventListener('click', () => {
    mathContainer.classList.remove('hidden');
    testsContainer.classList.add('hidden');
    autotestsContainer.classList.add('hidden');
  });

  testsButton.addEventListener('click', () => {
    testsContainer.classList.remove('hidden');
    mathContainer.classList.add('hidden');
    autotestsContainer.classList.add('hidden');
  });

  autotestsButton.addEventListener('click', () => {
    autotestsContainer.classList.remove('hidden');
    mathContainer.classList.add('hidden');
    testsContainer.classList.add('hidden');
  });

  problemMarkerButton.addEventListener('click', () => {
    problemMarkerContainer.classList.remove('hidden');
    macaroniContainer.classList.add('hidden');
  });

  macaroniButton.addEventListener('click', () => {
    macaroniContainer.classList.remove('hidden');
    problemMarkerContainer.classList.add('hidden');
  });

  singleChoiceButton.addEventListener('click', () => {
    currentFormat = 'single';
    problemForm.classList.remove('hidden');
    resultContainer.classList.remove('hidden');
  });

  multipleChoiceButton.addEventListener('click', () => {
    currentFormat = 'multiple';
    problemForm.classList.remove('hidden');
    resultContainer.classList.remove('hidden');
  });

  document.addEventListener('DOMContentLoaded', () => {
    showWelcomeNotification();
  });

  mathForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = mathForm.text.value;
    const formattedText = formatText(removeDialogLines(text));
    const formattedDialog = formatDialog(text);
    
    result.textContent = formattedText;

    if (formattedDialog) {
      dialogOutput.textContent = formattedDialog;
      dialogContainer.style.display = 'block';
    } else {
      dialogContainer.style.display = 'none';
    }
  });

  problemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = problemForm['test-text'].value;
    const formattedText = currentFormat === 'single' ? formatSingleChoiceText(text) : formatMultipleChoiceText(text);
    testResult.textContent = formattedText;
  });

  macaroniForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const leftText = macaroniForm['left'].value;
    const rightText = macaroniForm['right'].value;
    const answerText = macaroniForm['answer'].value;

    const leftChoices = cleanChoices(leftText);
    const rightChoices = cleanChoices(rightText);
    const correctAnswers = answerText.match(/\(\d+,\d+\)/g).map(pair => pair.replace(/[()]/g, '').split(',').map(Number));

    const { shuffledArray: shuffledRightChoices, newCorrectAnswers } = shuffleArrayAndUpdateAnswers(rightChoices, correctAnswers);

    const macaroniResultObject = {
      content: {
        options: {
          left: {
            choices: leftChoices
          },
          right: {
            choices: shuffledRightChoices
          }
        },
        button_text: "Узнать ответ",
        correct_answers: [newCorrectAnswers],
        meta: {},
        isPasted: true
      },
      type: "QuizMacaroni"
    };

    macaroniResult.textContent = JSON.stringify(macaroniResultObject, null, 2);
    macaroniResultContainer.classList.remove('hidden');
  });

  autotestsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const tag = autotestsForm['tag'].value;
    const path = autotestsForm['path'].value;
    const adminLink = autotestsForm['admin-link'].value;
    const lessonLink = autotestsForm['lesson-link'].value;
    const autotestCode = autotestsForm['autotest-code'].value;

    const formattedResult = `
# ${tag}
# ${path}
# ${adminLink}
# ${lessonLink}

${autotestCode}
    `.trim();

    autotestResult.textContent = formattedResult;
  });

  copyButton.addEventListener('click', () => {
    const text = result.textContent;
    navigator.clipboard.writeText(text).then(() => {
      showNotification('Результат скопирован в буфер обмена');
    }, (err) => {
      console.error('Ошибка при копировании: ', err);
    });
  });

  copyDialogButton.addEventListener('click', () => {
    const text = dialogOutput.textContent;
    navigator.clipboard.writeText(text).then(() => {
      showNotification('Диалог скопирован в буфер обмена');
    }, (err) => {
      console.error('Ошибка при копировании: ', err);
    });
  });

  testCopyButton.addEventListener('click', () => {
    const text = testResult.textContent;
    navigator.clipboard.writeText(text).then(() => {
      showNotification('Результат скопирован в буфер обмена');
    }, (err) => {
      console.error('Ошибка при копировании: ', err);
    });
  });

  macaroniCopyButton.addEventListener('click', () => {
    const text = macaroniResult.textContent;
    navigator.clipboard.writeText(text).then(() => {
      showNotification('Результат скопирован в буфер обмена');
    }, (err) => {
      console.error('Ошибка при копировании: ', err);
    });
  });

  autotestCopyButton.addEventListener('click', () => {
    const text = autotestResult.textContent;
    navigator.clipboard.writeText(text).then(() => {
      showNotification('Результат скопирован в буфер обмена');
    }, (err) => {
      console.error('Ошибка при копировании: ', err);
    });
  });

  function cleanChoices(text) {
    return text.split('\n').map(line => line.trim().replace(/^[A-Z]\)\s*/, '').replace(/^[-–]\s*/, '')).filter(line => line);
  }

  function formatText(text) {
    const formulaRegex = /\$(.*?)\$/gs;
    text = text.replace(formulaRegex, (match, p1) => `{formula}${p1}{/formula}`);

    const asideRegex = /<aside>\s*(.*?)\s*<\/aside>/gs;
    text = text.replace(asideRegex, (match, p1) => `{quiz-task}\n    background: |\n        #f5f6f7\n    content: |\n    ${p1}\n{/quiz-task}`);
    
    const linkRegex = /https:\/\/code\.s3\.yandex\.net\/.*?\.html/g;
    text = text.replace(linkRegex, (match) => `{iframe:${match}|minHeight:580px|minWidth:764px}`);
    
    return text;
  }

  function formatDialog(text) {
    const dialogRegex = /(Макс|Ульяна):\s*(.+)/gm;
    const content = [];
    let match;
    while ((match = dialogRegex.exec(text)) !== null) {
      const [_, character, message] = match;
      const formattedCharacter = character === 'Макс' ? 'Max-new' : 'Ulyana';
      const formattedMessage = formatText(message.trim());
      content.push({
        side: 'left',
        type: 'text',
        message: formattedMessage,
        character: formattedCharacter
      });
    }
    return content.length ? JSON.stringify({ content, type: 'Dialog' }, null, 2) : '';
  }

  function removeDialogLines(text) {
    return text.replace(/^(Макс|Ульяна):\s*(.+)$/gm, '').trim();
  }

  function formatSingleChoiceText() {
    const choices = [
      "Заголовок (Header).",
      "Полезная нагрузка (Payload).",
      "Ключ шифрования (Encryption Key).",
      "Подпись (Signature).",
      "Идентификатор пользователя (User ID).",
      "Время создания (Timestamp)."
    ];

    const problemMarker = {
      content: {
        id: "44c296e3-eb80-4ae9-beb3-d8b997c37d51",
        misc: {
          feedback: [null, null, null, null]
        },
        type: "choice",
        options: {
          flavor: "radio",
          choices: choices,
          type_display: "vertical"
        },
        meta: {
          correct_answers: [1]
        }
      },
      type: "ProblemMarker"
    };
    return JSON.stringify(problemMarker, null, 2);
  }

  function formatMultipleChoiceText(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    const choices = lines.map(line => line.replace(/^[A-Z]\)\s*/, '').replace(/^[-–]\s*/, ''));
    const problemMarker = {
      content: {
        id: "44c296e3-eb80-4ae9-beb3-d8b997c37d51",
        misc: {
          feedback: [null, null, null, null]
        },
        type: "choice",
        options: {
          flavor: "checkbox",
          choices: choices,
          type_display: "vertical"
        },
        meta: {
          correct_answers: [1]
        }
      },
      type: "ProblemMarker"
    };
    return JSON.stringify(problemMarker, null, 2);
  }

  function shuffleArrayAndUpdateAnswers(array, correctAnswers) {
    const shuffledArray = [...array];
    const newIndices = shuffledArray.map((_, index) => index);
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
      [newIndices[i], newIndices[j]] = [newIndices[j], newIndices[i]];
    }
    const newCorrectAnswers = correctAnswers.map(([leftIndex, rightIndex]) => [leftIndex, newIndices[rightIndex]]);
    return { shuffledArray, newCorrectAnswers };
  }

  function showNotification(message) {
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
      notification.style.display = 'none';
    }, 3000);
  }

  function showWelcomeNotification() {
    welcomeNotification.style.display = 'block';
    setTimeout(() => {
      welcomeNotification.style.display = 'none';
    }, 8000);
  }
});
