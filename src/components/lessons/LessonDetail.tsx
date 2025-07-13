import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  useQuizzes,
  usePracticeTasks,
  useSubmitQuiz,
  useSubject,
  useLesson,
} from "@/hooks/useApiQueries";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { AIAssistant } from "../learning/AIAssistant";

export const LessonDetail = () => {
  const { subjectId, lessonId } = useParams();

  const {
    data: subject,
    isLoading: isSubjectLoading,
    isError: isSubjectError,
  } = useSubject(subjectId);
  const {
    data: lesson,
    isLoading: isLessonLoading,
    isError: isLessonError,
  } = useLesson(subjectId, lessonId);

  const [activeTab, setActiveTab] = useState("content");
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const { toast } = useToast();

  const { data: quizzes = [] } = useQuizzes(subject?.id, lesson?.id);
  const { data: practiceTasks = [] } = usePracticeTasks(subject?.id, lesson?.id);
  const submitQuizMutation = useSubmitQuiz();

  const onBack = () => {
    window.history.back();
  };

  const mockQuiz = {
    id: 1,
    questions: [
      {
        id: 1,
        question_text: "What is the standard form of a linear equation?",
        options: [
          "y = mx + b",
          "ax + by + c = 0",
          "y = ax² + bx + c",
          "x = y + 1",
        ],
        correct_answer: "y = mx + b",
      },
      {
        id: 2,
        question_text: "If 2x + 5 = 15, what is the value of x?",
        options: ["5", "10", "7.5", "2.5"],
        correct_answer: "5",
      },
      {
        id: 3,
        question_text: "Which of the following is NOT a linear equation?",
        options: ["3x + 2y = 6", "x² + y = 5", "2x - y = 4", "x + y = 10"],
        correct_answer: "x² + y = 5",
      },
    ],
  };

  const mockTasks = [
    {
      id: 1,
      content: "Solve the equation: 3x + 7 = 22",
      solution: "x = 5",
    },
    {
      id: 2,
      content: "Find the slope and y-intercept of the line y = -2x + 3",
      solution: "Slope = -2, y-intercept = 3",
    },
    {
      id: 3,
      content: "Graph the equation y = 2x - 1 and identify where it crosses the axes",
      solution: "x-intercept at (0.5, 0), y-intercept at (0, -1)",
    },
  ];

  const handleQuizAnswer = (questionId: number, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < mockQuiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // Quiz completed
      const score = mockQuiz.questions.reduce((acc, question) => {
        return acc + (selectedAnswers[question.id] === question.correct_answer ? 1 : 0);
      }, 0);

      const percentage = Math.round((score / mockQuiz.questions.length) * 100);

      toast({
        title: "Quiz Completed!",
        description: `You scored ${score}/${mockQuiz.questions.length} (${percentage}%)`,
        variant: percentage >= 70 ? "default" : "destructive",
      });

      setQuizStarted(false);
      setCurrentQuestion(0);
      setSelectedAnswers({});
    }
  };

  if (isSubjectLoading || isLessonLoading) {
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

  if (isSubjectError || isLessonError || !subject || !lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 p-6 flex items-center justify-center">
        <Alert variant="destructive" className="max-w-lg">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error Loading Lesson</AlertTitle>
          <AlertDescription>
            There was a problem fetching the details for this lesson. Please try
            again later.
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
            ← Back to {subject.name}
          </Button>
          <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
          <div className="flex items-center gap-3">
            {/* <Badge className="bg-white/20 text-white border-white/30">
              {lesson.duration}
            </Badge> */}

            <span className="text-blue-100">• Progress: {lesson.progress||0}%</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">📖 Content</TabsTrigger>
            <TabsTrigger value="practice">✏️ Practice</TabsTrigger>
            <TabsTrigger value="quiz">🎯 Quiz</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="mt-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Lesson Content</CardTitle>
                <CardDescription>Learn the core concepts</CardDescription>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">
                    Introduction to Linear Equations
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    A linear equation is an algebraic equation where the highest
                    power of the variable is 1. Linear equations form straight
                    lines when graphed and are fundamental to understanding
                    algebra.
                  </p>

                  <h4 className="text-lg font-medium">Key Concepts:</h4>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Standard form: ax + by = c</li>
                    <li>Slope-intercept form: y = mx + b</li>
                    <li>Point-slope form: y - y₁ = m(x - x₁)</li>
                  </ul>

                  <div className="bg-accent/20 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Example:</h4>
                    <p>Solve for x: 2x + 3 = 11</p>
                    <div className="mt-2 space-y-1 text-sm">
                      <p>Step 1: Subtract 3 from both sides → 2x = 8</p>
                      <p>Step 2: Divide both sides by 2 → x = 4</p>
                    </div>
                  </div>

                  <Button variant="gradient" className="mt-6">
                    Mark as Complete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="practice" className="mt-6">
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Practice Problems</h2>
              {mockTasks.map((task, index) => (
                <Card key={task.id} className="shadow-soft">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Problem {index + 1}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{task.content}</p>
                    <details className="cursor-pointer">
                      <summary className="text-primary hover:underline">
                        Show Solution
                      </summary>
                      <div className="mt-2 p-3 bg-muted/50 rounded">
                        <strong>Solution:</strong> {task.solution}
                      </div>
                    </details>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quiz" className="mt-6">
            {!quizStarted ? (
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Knowledge Check Quiz</CardTitle>
                  <CardDescription>
                    Test your understanding with {mockQuiz.questions.length}{" "}
                    questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">🧠</div>
                      <div>
                        <p className="font-medium">
                          Ready to test your knowledge?
                        </p>
                        <p className="text-sm text-muted-foreground">
                          You need 70% or higher to pass
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="gradient"
                      onClick={() => setQuizStarted(true)}
                      size="lg"
                    >
                      Start Quiz
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-soft">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      Question {currentQuestion + 1} of{" "}
                      {mockQuiz.questions.length}
                    </CardTitle>
                    <Progress
                      value={
                        ((currentQuestion + 1) / mockQuiz.questions.length) * 100
                      }
                      className="w-32"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">
                      {mockQuiz.questions[currentQuestion].question_text}
                    </h3>

                    <div className="space-y-3">
                      {mockQuiz.questions[currentQuestion].options.map(
                        (option, index) => (
                          <label
                            key={index}
                            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                              selectedAnswers[
                                mockQuiz.questions[currentQuestion].id
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
                                  mockQuiz.questions[currentQuestion].id
                                ] === option
                              }
                              onChange={() =>
                                handleQuizAnswer(
                                  mockQuiz.questions[currentQuestion].id,
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
                      disabled={!selectedAnswers[mockQuiz.questions[currentQuestion].id]}
                      className="w-full"
                    >
                      {currentQuestion === mockQuiz.questions.length - 1
                        ? "Finish Quiz"
                        : "Next Question"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    <AIAssistant subject={subject.name} lesson={lesson.title} />
    </div>
  );
};
