import React from "react";
import {
  ChevronsLeft,
  ChevronsRight,
  User,
  Book,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import tutorImage from "@/assets/tutor1.png";
import tutor2Image from "@/assets/tutor2.png";

const personaImages = {
  teacher: tutorImage,
  professor: tutor2Image,
};

interface Problem {
  id: string;
  title: string;
  completed: boolean;
}

interface ProgressSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  currentTopic: string;
  problems: Problem[];
  currentProblemId: string;
  onProblemSelect: (id: string) => void;
  persona: 'teacher' | 'professor';
  userId: string;
}

const ProgressSidebar: React.FC<ProgressSidebarProps> = ({
  isExpanded,
  onToggle,
  currentTopic,
  problems,
  currentProblemId,
  onProblemSelect,
  persona,
  userId,
}) => {
  const selectedPersonaImage = personaImages[persona] || tutorImage;
  const personaName = persona === 'teacher' ? '중학교 선생님' : '비전공자반 교수님';

  return (
    <div
      className={cn(
        "relative h-full flex flex-col bg-white border-r shadow-md transition-width duration-300 ease-in-out",
        isExpanded ? "w-72" : "w-16"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b">
        {isExpanded && (
          <h2 className="font-bold text-lg text-gray-800">Learning Progress</h2>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggle}
        >
          {isExpanded ? (
            <ChevronsLeft className="h-5 w-5" />
          ) : (
            <ChevronsRight className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isExpanded ? (
          <>
            {/* Current Topic Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                <Book className="h-5 w-5 flex-shrink-0" />
                <span>Current Topic</span>
              </div>
              <div className="pl-8 text-gray-600 font-medium">{currentTopic}</div>
            </div>

            {/* Tutor Profile Section */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                <User className="h-5 w-5 flex-shrink-0" />
                <span>Your Tutor</span>
              </div>
              <div className="pl-8 flex items-center gap-3">
                <img src={selectedPersonaImage} alt={personaName} className="w-12 h-12 rounded-full border-2 border-blue-200 object-cover" />
                <div>
                  <div className="font-bold text-gray-800">{personaName}</div>
                  <div className="text-xs text-gray-500">for {userId}</div>
                </div>
              </div>
            </div>

            {/* Problems Section */}
            <div className="space-y-2 pt-4 border-t">
              <div className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <span>Problems</span>
              </div>
              <ul className="pl-8 space-y-2">
                {problems.map((problem) => (
                  <li key={problem.id}>
                    <button
                      onClick={() => onProblemSelect(problem.id)}
                      disabled={problem.id !== currentProblemId}
                      className={cn(
                        "w-full text-left flex items-center gap-3 p-2 rounded-md transition-colors",
                        "disabled:opacity-100 disabled:cursor-default",
                        currentProblemId === problem.id
                          ? "bg-blue-100 text-blue-800 font-bold"
                          : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      <CheckCircle
                        className={cn(
                          "h-5 w-5 flex-shrink-0",
                          problem.completed ? "text-green-500" : "text-gray-400",
                          currentProblemId === problem.id && "text-blue-700"
                        )}
                      />
                      <span className="flex-1 truncate">{problem.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default ProgressSidebar;
