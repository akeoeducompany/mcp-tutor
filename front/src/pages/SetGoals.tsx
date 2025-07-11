import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import tutorImage from "@/assets/tutor1.png";
import tutor2Image from "@/assets/tutor2.png";

const topics = [
  { id: "Data Structures", label: "자료구조" },
  { id: "Algorithms", label: "알고리즘" },
  { id: "Operating Systems", label: "운영체제" },
  { id: "Networks", label: "네트워크" },
  { id: "Database", label: "데이터베이스" },
  { id: "Java", label: "Java" },
  { id: "Python", label: "Python" },
  { id: "JavaScript", label: "JavaScript" },
];

const personas = [
  {
    id: "teacher",
    name: "중학교 선생님",
    image: tutorImage,
  },
  {
    id: "professor",
    name: "비전공자반 교수님",
    image: tutor2Image,
  },
];

const SetGoals = () => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    "Data Structures",
    "Algorithms",
  ]);
  const [userId, setUserId] = useState("악어학생");
  const [persona, setPersona] = useState("teacher");
  const navigate = useNavigate();

  const handleTopicChange = (topicId: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleStart = async () => {
    if (selectedTopics.length === 0) {
      alert("하나 이상의 학습 주제를 선택해주세요.");
      return;
    }
    try {
      const response = await fetch("/api/v1/sessions/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          topics: selectedTopics,
          persona,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const { sessionId } = data;
        navigate("/tutoring", {
          state: { sessionId, selectedTopics, userId, persona },
        });
      } else {
        throw new Error("세션 생성에 실패했습니다");
      }
    } catch (err) {
      console.error(err);
      alert("세션 생성 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader>
          <CardTitle>AI 코딩 튜터와 함께 실력 향상하기</CardTitle>
          <CardDescription>
            학습하고 싶은 주제를 선택하고 튜터링을 시작하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
          <div className="space-y-2">
            <Label htmlFor="user-id">사용자 ID</Label>
            <Input
              id="user-id"
              placeholder="사용자 ID를 입력하세요"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
          <div className="space-y-4">
            <Label>학습 주제 선택</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {topics.map((topic) => (
                <div key={topic.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={topic.id}
                    checked={selectedTopics.includes(topic.id)}
                    onCheckedChange={() => handleTopicChange(topic.id)}
                  />
                  <label
                    htmlFor={topic.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {topic.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Label>튜터 페르소나 선택</Label>
            <div className="flex justify-center gap-8 pt-4">
              {personas.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col items-center gap-2 cursor-pointer"
                  onClick={() => setPersona(p.id)}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className={cn(
                      "h-32 w-32 rounded-full object-cover border-4 transition-all",
                      persona === p.id
                        ? "border-blue-500 scale-105"
                        : "border-transparent"
                    )}
                  />
                  <Label
                    className={cn(
                      "text-lg transition-colors",
                      persona === p.id
                        ? "font-bold text-blue-600"
                        : "text-gray-500"
                    )}
                  >
                    {p.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleStart} className="w-full" size="lg">
            튜터링 시작하기
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SetGoals;
