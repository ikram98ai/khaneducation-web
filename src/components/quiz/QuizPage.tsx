import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuiz, useSubmitQuiz } from "@/hooks/useApiQueries";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export const QuizPage = () => {
  const { lessonId } = useParams();

  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});

  const onBack = () => {
    window.history.back();
  };

  const {
    data: quiz,
    isLoading: isQuizLoading,
    isError: isQuizError,
  } = useQuiz(lessonId, {
    enabled: quizStarted,
  });

  const submitQuizMutation = useSubmitQuiz();

  const handleQuizAnswer = (questionId: string, student_answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: student_answer,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.quiz_questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      const responses = Object.entries(selectedAnswers).map(
        ([question_id, student_answer]) => ({
          question_id,
          student_answer,
        })
      );

      submitQuizMutation.mutate(
        { quiz_id: quiz.id, responses },
        {
          onSuccess: () => {
            setQuizStarted(false);
            setCurrentQuestion(0);
            setSelectedAnswers({});
          },
        }
      );
    }
  };

  if (isQuizLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 p-6">
        <Skeleton className="h-10 w-48 mb-8" />
        <Skeleton className="h-16 w-full mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (isQuizError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 p-6 flex items-center justify-center">
        <Alert variant="destructive" className="max-w-lg">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error Loading Quiz</AlertTitle>
          <AlertDescription>
            There was a problem fetching the quiz. Please try again later.
            <Button onClick={onBack} variant="link" className="p-0 h-auto mt-2">
              Go Back
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 p-6 flex items-center justify-center">
        <Card className="shadow-soft w-full max-w-lg">
          <CardHeader>
            <CardTitle>Knowledge Check Quiz</CardTitle>
            <CardDescription>
              Test your understanding of the lesson.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-2xl">🧠</div>
                <div>
                  <p className="font-medium">Ready to test your knowledge?</p>
                  <p className="text-sm text-muted-foreground">
                    You need 70% or higher to pass.
                  </p>
                  <p className="text-sm text-red-500">
                    Note: If you leave the quiz page once you started, it will
                    be submitted.
                  </p>
                </div>
              </div>
              <Button
                variant="gradient"
                onClick={() => setQuizStarted(true)}
                size="lg"
                className="w-full"
              >
                Start Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isQuizLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 p-6">
        <Skeleton className="h-10 w-48 mb-8" />
        <Skeleton className="h-16 w-full mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 p-6 flex items-center justify-center">
        <Alert variant="destructive" className="max-w-lg">
          <Terminal className="h-4 w-4" />
          <AlertTitle>No Quiz Available</AlertTitle>
          <AlertDescription>
            There is no quiz available for this lesson.
            <Button onClick={onBack} variant="link" className="p-0 h-auto mt-2">
              Go Back
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5">
      {/* Header */}
      <div className="bg-gradient-primary text-white px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-white hover:bg-white/20 mb-4"
          >
            ← Back to Lesson
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-red-100">
              Note: If you leave the quiz page once you started, it will be
              submitted.
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {quiz.quiz_questions.length == 0 ? (
          <p> There are no questions for this quiz</p>
        ) : (
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Question {currentQuestion + 1} of {quiz.quiz_questions.length}
                </CardTitle>
                <Progress
                  value={
                    ((currentQuestion + 1) / quiz.quiz_questions.length) * 100
                  }
                  className="w-32"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <h3 className="text-lg font-medium">
                  {quiz.quiz_questions[currentQuestion].question_text}
                </h3>

                <div className="space-y-3">
                  {quiz.quiz_questions[currentQuestion].options &&
                    quiz.quiz_questions[currentQuestion].options.map(
                      (option, index) => (
                        <label
                          key={index}
                          className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                            selectedAnswers[
                              quiz.quiz_questions[currentQuestion].question_id
                            ] === option
                              ? "border-primary bg-primary/10"
                              : "border-border hover:bg-muted/50"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${currentQuestion}`}
                            value={option}
                            checked={
                              selectedAnswers[
                                quiz.quiz_questions[currentQuestion].question_id
                              ] === option
                            }
                            onChange={() =>
                              handleQuizAnswer(
                                quiz.quiz_questions[currentQuestion]
                                  .question_id,
                                option
                              )
                            }
                            className="mr-3"
                          />
                          <span>{option}</span>
                        </label>
                      )
                    )}
                </div>

                <Button
                  onClick={nextQuestion}
                  disabled={
                    !selectedAnswers[
                      quiz.quiz_questions[currentQuestion].question_id
                    ]
                  }
                  className="w-full"
                >
                  {currentQuestion === quiz.quiz_questions.length - 1
                    ? "Finish Quiz"
                    : "Next Question"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
