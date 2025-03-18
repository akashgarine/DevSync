
// This would connect to your database in a real application
// For this example, we'll simulate database operations

const quizzes = new Map();
const userAnswers = new Map();

export async function saveQuizData(roomCode, data) {
  // In a real app, you would save this to a database
  quizzes.set(roomCode, data);
  return { success: true };
}

export async function saveUserAnswer(
  roomCode,
  userId,
  questionIndex,
  selectedAnswer,
  isCorrect
) {
  // In a real app, you would save this to a database
  const roomAnswers = userAnswers.get(roomCode) || new Map();
  const userAnswerList = roomAnswers.get(userId) || [];

  userAnswerList.push({
    questionIndex,
    selectedAnswer,
    isCorrect,
  });

  roomAnswers.set(userId, userAnswerList);
  userAnswers.set(roomCode, roomAnswers);

  return { success: true };
}

export async function getQuizData(roomCode) {
  // In a real app, you would fetch this from a database
  return quizzes.get(roomCode) || null;
}

export async function getUserAnswers(roomCode, userId) {
  // In a real app, you would fetch this from a database
  const roomAnswers = userAnswers.get(roomCode) || new Map();
  return roomAnswers.get(userId) || [];
}
